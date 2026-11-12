import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'image-search-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/api/approve-image', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
            return;
          }
          try {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const payload = JSON.parse(body || '{}');
            const {
              title,
              itemTitle = '',
              associationWord = '',
              coreConcept = '',
              imageUrl,
              keywords = [],
              associatedTask = '',
              explanation = '',
              emoji = '🧠'
            } = payload;
            const resolvedTitle = (title || associationWord || itemTitle || associatedTask || '').trim();
            const resolvedTask = (associatedTask || itemTitle || resolvedTitle || '').trim();
            if (!imageUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Missing imageUrl' }));
              return;
            }

            let localImageUrl = imageUrl;
            const poolDir = path.resolve(process.cwd(), 'public', 'staged_images', 'pool');
            fs.mkdirSync(poolDir, { recursive: true });

            if (/^https?:\/\//i.test(imageUrl)) {
              try {
                const imgRes = await fetch(imageUrl, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                  signal: AbortSignal.timeout(8000)
                });
                if (imgRes.ok) {
                  const contentType = imgRes.headers.get('content-type') || '';
                  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
                  const fileName = `approved_${Date.now()}.${ext}`;
                  const filePath = path.join(poolDir, fileName);
                  const arrayBuf = await imgRes.arrayBuffer();
                  fs.writeFileSync(filePath, Buffer.from(arrayBuf));
                  localImageUrl = `/staged_images/pool/${fileName}`;
                }
              } catch {
                // Keep original URL if download fails
              }
            } else if (/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/.test(imageUrl)) {
              const match = imageUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
              const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
              const fileName = `approved_${Date.now()}.${ext}`;
              const filePath = path.join(poolDir, fileName);
              fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
              localImageUrl = `/staged_images/pool/${fileName}`;
            }

            // Append/update approved_manifest.json in public/staged_images/
            try {
              const manifestPath = path.resolve(process.cwd(), 'public', 'staged_images', 'approved_manifest.json');
              let manifest = [];
              if (fs.existsSync(manifestPath)) {
                manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8') || '[]');
              }
              const existingIdx = manifest.findIndex(item => item.imageUrl === localImageUrl || (resolvedTitle && item.title === resolvedTitle));
              const entry = {
                id: `approved_${Date.now()}`,
                title: resolvedTitle,
                name: resolvedTitle,
                imageUrl: localImageUrl,
                keywords: Array.from(new Set([...(keywords || []), coreConcept, resolvedTitle].filter(Boolean))),
                associatedTasks: Array.from(new Set([resolvedTask, resolvedTitle].filter(Boolean))),
                caption: explanation || resolvedTask,
                emoji,
                isUserApproved: true,
                source: 'user_positive_feedback',
                qualityScore: 100,
                approvedAt: new Date().toISOString()
              };
              if (existingIdx >= 0) {
                manifest[existingIdx] = {
                  ...manifest[existingIdx],
                  ...entry,
                  id: manifest[existingIdx].id || entry.id,
                  keywords: Array.from(new Set([...(manifest[existingIdx].keywords || []), ...entry.keywords])),
                  associatedTasks: Array.from(new Set([...(manifest[existingIdx].associatedTasks || []), ...entry.associatedTasks]))
                };
              } else {
                manifest.unshift(entry);
              }
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
            } catch {
              // Ignore manifest write errors
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, localImageUrl }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });

        // Endpoint to sync human curation decisions (discarded, flagged for replacement, edits) straight to disk
        server.middlewares.use('/api/sync-curation', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
            return;
          }
          try {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const payload = JSON.parse(body || '{}');
            const dataDir = path.resolve(process.cwd(), 'public', 'data');
            fs.mkdirSync(dataDir, { recursive: true });
            const targetPath = path.join(dataDir, 'user_curation_state.json');
            
            fs.writeFileSync(targetPath, JSON.stringify({
              savedAt: new Date().toISOString(),
              ...payload
            }, null, 2), 'utf8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, savedAt: new Date().toISOString(), path: targetPath }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });

        const SERVER_IMAGE_CACHE = new Map();

        // רשימה שחורה של אתרי תמונות בתשלום עם סימני מים, חנויות, קליפארט וממים באיכות נמוכה
        const BLOCKED_IMAGE_DOMAINS = [
          'dreamstime.', 'vecteezy.', 'shutterstock.', 'alamy.', 'istockphoto.', 'gettyimages.',
          '123rf.', 'depositphotos.', 'bigstockphoto.', 'canstockphoto.', 'freepik.', 'stock.adobe.',
          'pond5.', 'agefotostock.', 'meisterdrucke.', 'fineartamerica.', 'artpal.', 'displate.',
          'aliexpress.', 'amazon.', 'ebay.', 'etsy.', 'temu.', 'walmart.', 'target.', 'redbubble.',
          'zazzle.', 'spreadshirt.', 'teepublic.', 'cafepress.', 'shein.', 'wish.',
          'youtube.com', 'ytimg.com', 'tiktok.com', 'facebook.com', 'fbsbx.com', 'instagram.com',
          'imgflip.com', '9gag.com', 'knowyourmeme.com', 'cheezburger.com', 'memedroid.com'
        ];

        const BLOCKED_TITLE_PATTERNS = /stock photo|stock image|royalty[\s-]?free|watermark|vector|clipart|clip art|illustration|cartoon|silhouette|icon|logo|diagram|chart|infographic|blueprint|worksheet|coloring page|template|mockup|book cover|page scan|barcode|djvu/i;

        function distillEnglishSearchQuery(rawEn = '') {
          return String(rawEn || '')
            .replace(/\b(photography|photograph|photo|iconic|portrait|classic|vintage|picture|image|high quality|hd|wallpaper|stock|background|isolated)\b/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }

        function scoreCandidatePhoto({ imageUrl = '', pageUrl = '', title = '', width = 0, height = 0 }) {
          const lowImg = String(imageUrl || '').toLowerCase();
          const lowPage = String(pageUrl || '').toLowerCase();
          const lowTitle = String(title || '').toLowerCase();

          if (!lowImg.startsWith('http')) return -999;
          if (/\.svg|\.gif|\.tif|\.pdf|\.djvu|\.webm(\?|$)/i.test(lowImg)) return -999;

          for (const dom of BLOCKED_IMAGE_DOMAINS) {
            if (lowImg.includes(dom) || lowPage.includes(dom)) return -999;
          }
          if (BLOCKED_TITLE_PATTERNS.test(lowTitle)) return -999;

          const w = Number(width) || 0;
          const h = Number(height) || 0;
          if (w > 0 && h > 0) {
            if (w < 420 || h < 260) return -999;
            const ratio = w / h;
            // סינון תמונות אנכיות (שנחתכות במסגרת 16:10) או באנרים צרים מדי
            if (ratio < 1.05 || ratio > 2.35) return -999;
          }

          let score = 100;
          if (w > 0 && h > 0) {
            const ratio = w / h;
            // בונוס לתמונות שמתאימות בול ליחס המסגרת של הקלף (16:10 = 1.6)
            if (ratio >= 1.28 && ratio <= 1.85) score += 45;
            else if (ratio >= 1.15 && ratio <= 2.05) score += 20;

            if (w >= 800 && w <= 2500) score += 25;
            else if (w >= 600) score += 15;
          }

          // בונוס למקורות אנציקלופדיים וצילומיים איכותיים ונקיים מסימני מים
          if (/wikimedia\.org|wikipedia\.org|unsplash\.com|pexels\.com|pixabay\.com|britannica\.com|nationalgeographic\.com|smithsonianmag\.com|bbc\.co|nytimes\.com|seriouseats\.com|bonappetit\.com/.test(lowImg + ' ' + lowPage)) {
            score += 35;
          }

          return score;
        }

        server.middlewares.use('/api/search-image', async (req, res) => {
          try {
            const url = new URL(req.url, 'http://localhost');
            const query = (url.searchParams.get('q') || '').trim();
            const rawEnglishQuery = (url.searchParams.get('en') || '').trim();
            const englishQuery = distillEnglishSearchQuery(rawEnglishQuery) || rawEnglishQuery;

            // שער ברזל הרמטי: לעולם לא לפנות לרשת ללא שאילתת צילום מאומתת באנגלית!
            // איסור מוחלט על הרצת שאילתות עבריות גולמיות או ביטויי חלופה/עוגן.
            if (
              !englishQuery || 
              englishQuery.length < 2 || 
              /[\u0590-\u05FF]/.test(englishQuery) ||
              /חלופה|עוגן|דמות מומחה|fallback|alternative/i.test(query)
            ) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ results: [] }));
              return;
            }

            const cacheKey = `${query}__${englishQuery.toLowerCase()}`;
            if (SERVER_IMAGE_CACHE.has(cacheKey)) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ results: SERVER_IMAGE_CACHE.get(cacheKey) }));
              return;
            }

            const scoredCandidates = [];
            const seenUrls = new Set();

            const pushCandidate = (cand) => {
              if (!cand || !cand.image) return;
              const dedupeKey = cand.originalImage || cand.image;
              if (seenUrls.has(dedupeKey)) return;
              seenUrls.add(dedupeKey);
              scoredCandidates.push(cand);
            };

            // Stage 1A (המנוע המרכזי והמהיר ביותר): חיפוש ישיר ב-Bing Images עם פילטר צילום + רוחב (Wide) + רזולוציה גבוהה (Large)
            const bingPromise = (async () => {
              try {
                const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(englishQuery)}&qft=+filterui:photo-photo+filterui:aspect-wide+filterui:imagesize-large&form=IRFLTR`;
                const bRes = await fetch(bingUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9'
                  },
                  signal: AbortSignal.timeout(3500)
                });
                if (bRes.ok) {
                  const html = await bRes.text();
                  const matches = [...html.matchAll(/m="(\{[^"]+\})"/g)];
                  let validIdx = 0;
                  for (const m of matches.slice(0, 35)) {
                    try {
                      const decoded = m[1]
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&')
                        .replace(/&#39;/g, "'");
                      const obj = JSON.parse(decoded);
                      const murl = obj.murl || '';
                      const purl = obj.purl || '';
                      const turl = obj.turl || '';
                      const cleanTitle = String(obj.t || obj.desc || englishQuery).replace(/[\uE000-\uF8FF]/g, '').trim();
                      // מאחר ש-Bing כבר סינן ל-aspect-wide ו-imagesize-large, נזין מידות 1200x750 לדירוג
                      const sc = scoreCandidatePhoto({
                        imageUrl: murl,
                        pageUrl: purl,
                        title: cleanTitle,
                        width: 1200,
                        height: 750
                      });
                      if (sc > 0 && (turl.startsWith('http') || murl.startsWith('http'))) {
                        const rankBonus = Math.max(0, 42 - validIdx * 3);
                        validIdx++;
                        const highResProxy = turl.startsWith('http')
                          ? `${turl}&w=800&qlt=90`
                          : murl;
                        pushCandidate({
                          title: cleanTitle,
                          image: highResProxy,
                          originalImage: murl || highResProxy,
                          thumbnail: highResProxy,
                          width: 800,
                          height: 500,
                          score: sc + rankBonus
                        });
                      }
                    } catch (_) {}
                  }
                }
              } catch (_) {}
            })();

            // Stage 1B (במקביל): תמונות ערך ראשיות מויקיפדיה האנגלית והעברית (Wikipedia Lead Article PageImages)
            const wikiArticlePromise = (async () => {
              const fetchWikiPageImages = async (lang, searchTerm, baseBonus = 0, exactTitleOnly = false) => {
                if (!searchTerm || searchTerm.length < 2) return;
                try {
                  const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=960&format=json`;
                  const r = await fetch(apiUrl, {
                    headers: { 'User-Agent': 'LifeQuestMnemonicApp/2.0 (educational)' },
                    signal: AbortSignal.timeout(3000)
                  });
                  if (!r.ok) return;
                  const d = await r.json();
                  const pages = d.query?.pages ? Object.values(d.query.pages) : [];
                  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
                  for (const p of pages) {
                    const thumb = p.thumbnail;
                    if (!thumb?.source) continue;
                    const pageTitle = String(p.title || '').trim();
                    if (exactTitleOnly && (p.index || 1) > 1 && pageTitle !== searchTerm) continue;
                    const src = thumb.source;
                    const tLow = `${pageTitle} ${src}`.toLowerCase();
                    if (!src.includes('/wikipedia/commons/')) continue;
                    if (/\.svg|\.gif|\.tif|\.pdf|\.djvu|disambig|question_book|icon|logo|flag_of|coat_of_arms|map_of|locator|blank|signature|stamp|book|album|band|singer|actor|politician/i.test(tLow)) continue;
                    const w = Number(thumb.width) || 0;
                    const h = Number(thumb.height) || 0;
                    if (w < 420 || h < 260) continue;
                    const ratio = w / h;
                    if (ratio < 1.08 || ratio > 2.25) continue;

                    const rankBonus = Math.max(0, 18 - ((p.index || 1) - 1) * 8);
                    const ratioBonus = (ratio >= 1.25 && ratio <= 1.85) ? 30 : 10;
                    pushCandidate({
                      title: pageTitle || englishQuery,
                      image: src,
                      originalImage: src,
                      thumbnail: src,
                      width: w,
                      height: h,
                      score: 125 + baseBonus + rankBonus + ratioBonus
                    });
                  }
                } catch (_) {}
              };

              const conciseEn = englishQuery.split(/\s+/).slice(0, 3).join(' ');
              const tasks = [fetchWikiPageImages('en', conciseEn, 10, false)];
              if (query && /[\u0590-\u05FF]/.test(query)) {
                tasks.push(fetchWikiPageImages('he', query, 15, true));
              }
              await Promise.allSettled(tasks);
            })();

            await Promise.allSettled([bingPromise, wikiArticlePromise]);

            // Stage 3: גיבוי מבוקר מ-Wikimedia Commons רק אם לא נמצאו מספיק תמונות איכותיות
            if (scoredCandidates.length < 3 && englishQuery) {
              try {
                const safeWikiQ = `${englishQuery} -filetype:djvu -filetype:pdf -filetype:tif -filetype:svg -intitle:djvu -intitle:book -intitle:volume -intitle:map -intitle:diagram`;
                const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(safeWikiQ)}&gsrnamespace=6&gsrlimit=12&prop=pageimages&pithumbsize=960&format=json`;
                const wikiRes = await fetch(wikiUrl, {
                  headers: { 'User-Agent': 'LifeQuestMnemonicApp/2.0 (educational)' },
                  signal: AbortSignal.timeout(3500)
                });
                if (wikiRes.ok) {
                  const wikiData = await wikiRes.json();
                  const pages = wikiData.query?.pages;
                  if (pages) {
                    for (const p of Object.values(pages)) {
                      const thumb = p.thumbnail;
                      const img = thumb?.source;
                      const tLow = (p.title || '').toLowerCase();
                      const imgLow = (img || '').toLowerCase();
                      const w = Number(thumb?.width) || 0;
                      const h = Number(thumb?.height) || 0;
                      const ratio = (w > 0 && h > 0) ? (w / h) : 1.4;
                      if (
                        img &&
                        ratio >= 1.05 && ratio <= 2.25 &&
                        w >= 450 &&
                        !/\.djvu|\.pdf|\.tif|\.svg|\.webm|book|volume|page_|ia_|library|archive|scan|catalog|treatise|diagram|map|plaque|sign|gravestone|herbarium|specimen/.test(tLow) &&
                        !/\.djvu|\.pdf|\.tif|\.svg|\.webm|page1-|ia_|scan|book/.test(imgLow)
                      ) {
                        pushCandidate({
                          title: p.title || englishQuery,
                          image: img,
                          originalImage: img,
                          thumbnail: img,
                          width: w,
                          height: h,
                          score: 110 + (ratio >= 1.25 && ratio <= 1.85 ? 25 : 0)
                        });
                      }
                    }
                  }
                }
              } catch (_) {}
            }

            scoredCandidates.sort((a, b) => (b.score || 0) - (a.score || 0));
            const results = scoredCandidates.slice(0, 8);

            if (results.length > 0) {
              SERVER_IMAGE_CACHE.set(cacheKey, results);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ results }));
          } catch (err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ results: [], error: err.message }));
          }
        });
      }
    }
  ],
  base: './',
  server: {
    port: 5175,
  },
})


