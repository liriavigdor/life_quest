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

        server.middlewares.use('/api/search-image', async (req, res) => {
          try {
            const url = new URL(req.url, 'http://localhost');
            const query = (url.searchParams.get('q') || '').trim();
            const englishQuery = (url.searchParams.get('en') || '').trim();

            // שער ברזל הרמטי: לעולם לא לפנות לרשת ללא שאילתת צילום מאומתת באנגלית!
            // איסור מוחלט על הרצת שאילתות עבריות גולמיות או ביטויי חלופה/עוגן.
            if (
              !englishQuery || 
              englishQuery.length < 3 || 
              /[\u0590-\u05FF]/.test(englishQuery) ||
              /חלופה|עוגן|דמות מומחה|fallback|alternative/i.test(query)
            ) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ results: [] }));
              return;
            }

            const cacheKey = `${query}__${englishQuery}`;
            if (SERVER_IMAGE_CACHE.has(cacheKey)) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ results: SERVER_IMAGE_CACHE.get(cacheKey) }));
              return;
            }

            const results = [];

            // 1. Try DuckDuckGo image search (ONLY with verified clean English query)
            try {
              const targetQ = englishQuery;
              const tokenRes = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(targetQ), {
                headers: { 
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                  'Accept-Language': 'en-US,en;q=0.9'
                },
                signal: AbortSignal.timeout(2200)
              });
              const text = await tokenRes.text();
              const vqdMatch = text.match(/vqd=([0-9-]+)/);
              if (vqdMatch) {
                const imgRes = await fetch(
                  'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(targetQ) + '&vqd=' + vqdMatch[1],
                  {
                    headers: { 
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                      'Referer': 'https://duckduckgo.com/'
                    },
                    signal: AbortSignal.timeout(2200)
                  }
                );
                if (imgRes.ok) {
                  const data = await imgRes.json();
                  if (Array.isArray(data.results)) {
                    for (const r of data.results.slice(0, 8)) {
                      if (r.image && typeof r.image === 'string' && r.image.startsWith('http')) {
                        results.push({
                          title: r.title || targetQ,
                          image: r.image,
                          thumbnail: r.thumbnail || r.image
                        });
                      }
                    }
                  }
                }
              }
            } catch (_) {}

            // 2. Wikimedia Commons API fallback (ONLY with verified English query)
            if (results.length === 0 && englishQuery) {
              try {
                const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(englishQuery)}&gsrnamespace=6&gsrlimit=6&prop=pageimages&pithumbsize=800&format=json`;
                const wikiRes = await fetch(wikiUrl, {
                  headers: { 'User-Agent': 'LifeQuestMnemonicApp/1.0 (educational)' },
                  signal: AbortSignal.timeout(4000)
                });
                if (wikiRes.ok) {
                  const wikiData = await wikiRes.json();
                  const pages = wikiData.query?.pages;
                  if (pages) {
                    for (const p of Object.values(pages)) {
                      const img = p.thumbnail?.source;
                      if (img && !img.includes('.svg') && !img.includes('.pdf') && !img.includes('.webm')) {
                        results.push({
                          title: p.title || englishQuery,
                          image: img,
                          thumbnail: img
                        });
                      }
                    }
                  }
                }
              } catch (_) {}
            }

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


