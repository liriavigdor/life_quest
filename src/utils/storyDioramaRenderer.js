// Multi-Layered Visual Scene Diorama Renderer for LifeQuest
// Composes terrain, environmental weather, primary subjects, companion props, and AI illustrations
// into a unified, rich isometric scene.

const imageCache = new Map();

export function getOrCreateCachedImage(url) {
  if (!url) return null;
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  imageCache.set(url, img);
  return img;
}

/**
 * Draws a complete visual combination scene of the user's story
 */
export function drawStoryDiorama(ctx, cx, cy, monument, timeMs = Date.now(), scale = 1) {
  if (!monument) return;

  ctx.save();
  ctx.scale(scale, scale);
  const scx = cx / scale;
  const scy = cy / scale;

  const seed = monument.seed || 12345;
  const terrain = monument.terrain || 'ancient_sanctuary';
  const weather = monument.weather || 'sunlit_sparks';
  const primaryEntity = monument.primaryEntity || { emoji: '✨', color: '#f59e0b' };
  const secondaryEntity = monument.secondaryEntity || null;
  const primaryColor = monument.suggestedColor || primaryEntity.color || '#f59e0b';

  // 1. Contact shadow under the entire diorama
  ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
  ctx.beginPath();
  ctx.ellipse(scx, scy + 10, 26, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw Thematic Terrain Island
  drawTerrainIsland(ctx, scx, scy, terrain, primaryColor, seed);

  // 3. Draw Environmental Weather (Rain, Snow, Stars, Embers)
  drawWeatherAtmosphere(ctx, scx, scy, weather, timeMs, seed);

  // 4. Check if a full AI painted diorama is active
  const aiUrl = monument.aiImageUrl;
  let drewAiImage = false;

  if (monument.useAiImage && aiUrl) {
    const aiImg = getOrCreateCachedImage(aiUrl);
    if (aiImg && aiImg.complete && aiImg.naturalWidth > 0) {
      drawAiDioramaGlobe(ctx, scx, scy - 20, aiImg, primaryColor, timeMs);
      drewAiImage = true;
    }
  }

  // 5. If not drawing AI image, draw Procedural Visual Combination of subjects!
  if (!drewAiImage) {
    drawProceduralCompositeScene(ctx, scx, scy, monument, primaryEntity, secondaryEntity, primaryColor, timeMs, seed);
  }

  // 6. Floating Top Sparkle Crown
  const pulse = 0.8 + Math.sin(timeMs * 0.005 + seed) * 0.4;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(scx, scy - 48, 1.8 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the ground terrain island matching the story's setting
 */
function drawTerrainIsland(ctx, cx, cy, terrain, primaryColor, seed) {
  switch (terrain) {
    case 'snow_mountain': {
      // Rugged snowy peak with blue ice shadow
      const peakGrad = ctx.createLinearGradient(cx - 16, cy - 8, cx + 16, cy + 8);
      peakGrad.addColorStop(0, '#e2e8f0');
      peakGrad.addColorStop(0.5, '#cbd5e1');
      peakGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = peakGrad;

      // Base diamond cliff
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 22, cy + 3);
      ctx.lineTo(cx, cy + 14);
      ctx.lineTo(cx - 22, cy + 3);
      ctx.closePath();
      ctx.fill();

      // Snow cap layer
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 14, cy - 1);
      ctx.lineTo(cx + 5, cy + 4);
      ctx.lineTo(cx - 6, cy + 5);
      ctx.lineTo(cx - 16, cy - 1);
      ctx.closePath();
      ctx.fill();

      // Ice glint
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy + 2);
      ctx.lineTo(cx - 4, cy + 7);
      ctx.stroke();
      break;
    }

    case 'ocean_waves': {
      // Deep blue translucent water slab with animated foam
      const waterGrad = ctx.createLinearGradient(cx - 18, cy, cx + 18, cy + 12);
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(0.5, '#0284c7');
      waterGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = waterGrad;

      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 22, cy + 4);
      ctx.lineTo(cx, cy + 13);
      ctx.lineTo(cx - 22, cy + 4);
      ctx.closePath();
      ctx.fill();

      // White foam ripple lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx - 3, cy + 3, 11, 4.5, 0.2, 0, Math.PI);
      ctx.stroke();
      break;
    }

    case 'rainy_puddles': {
      // Dark wet cobblestones with reflective puddles
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 20, cy + 3);
      ctx.lineTo(cx, cy + 12);
      ctx.lineTo(cx - 20, cy + 3);
      ctx.closePath();
      ctx.fill();

      // Water puddles reflecting sky
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(cx - 5, cy + 2, 7, 3.2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 7, cy + 5, 5, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Puddle shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 6, cy + 1.2, 1, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'starry_celestial': {
      // Floating obsidian platform with glowing astral edge
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 22, cy + 3);
      ctx.lineTo(cx, cy + 13);
      ctx.lineTo(cx - 22, cy + 3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Astral rune disc
      ctx.strokeStyle = 'rgba(232, 121, 249, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 3, 12, 5.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'victory_podium': {
      // Tiered marble podium with golden laurel trim and red carpet
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(cx - 18, cy + 3, 36, 8, 3);
      ctx.fill();

      // Red carpet top
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 13, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gold rim
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      break;
    }

    case 'lush_forest':
    default: {
      // Mossy grassy knoll with wildflowers and mushrooms
      const grassGrad = ctx.createRadialGradient(cx, cy + 2, 2, cx, cy + 2, 18);
      grassGrad.addColorStop(0, '#22c55e');
      grassGrad.addColorStop(0.7, '#16a34a');
      grassGrad.addColorStop(1, '#14532d');
      ctx.fillStyle = grassGrad;

      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 22, cy + 3);
      ctx.lineTo(cx, cy + 13);
      ctx.lineTo(cx - 22, cy + 3);
      ctx.closePath();
      ctx.fill();

      // Tiny red toadstool mushroom on the side
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 12, cy + 2, 2.5, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 13, cy + 2, 2, 2.5);
      break;
    }
  }
}

/**
 * Draws animated weather, falling rain, snow flurries, or starlight
 */
function drawWeatherAtmosphere(ctx, cx, cy, weather, timeMs, seed) {
  const t = timeMs * 0.003;

  switch (weather) {
    case 'rain_storm': {
      // Dark rain cloud on top
      ctx.fillStyle = 'rgba(71, 85, 105, 0.85)';
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 42, 10, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy - 44, 12, 0, Math.PI * 2);
      ctx.arc(cx - 1, cy - 48, 11, 0, Math.PI * 2);
      ctx.fill();

      // Animated falling diagonal rain streaks
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 7; i++) {
        const offset = (t * 8 + i * 2.3 + (seed % 7)) % 10;
        const rx = cx - 14 + (i * 4.5);
        const ry = cy - 36 + (offset * 3.8);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 2, ry + 5);
        ctx.stroke();
      }
      break;
    }

    case 'snow_flurry': {
      // Swirling white snowflakes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (let i = 0; i < 6; i++) {
        const phase = t * 2 + i * 1.6;
        const sx = cx + Math.sin(phase) * 16;
        const sy = cy - 40 + ((t * 6 + i * 5) % 36);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'starry_night': {
      // Crescent glowing moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx + 12, cy - 40, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.arc(cx + 10, cy - 41, 5.2, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling star motes
      for (let i = 0; i < 4; i++) {
        const sx = cx - 14 + (i * 9);
        const sy = cy - 35 + Math.sin(t * 3 + i) * 6;
        const starGleam = 0.5 + Math.sin(t * 5 + i) * 0.5;
        ctx.fillStyle = `rgba(254, 240, 138, ${starGleam})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'fire_embers': {
      // Flickering orange fire embers rising
      for (let i = 0; i < 5; i++) {
        const offset = (t * 4 + i * 2) % 6;
        const ex = cx + Math.sin(t * 3 + i) * 12;
        const ey = cy - 10 - (offset * 6);
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'falling_petals': {
      // Rose petals drifting down
      for (let i = 0; i < 4; i++) {
        const px = cx + Math.sin(t * 2 + i) * 15;
        const py = cy - 35 + ((t * 4 + i * 4) % 30);
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.ellipse(px, py, 2.5, 1.5, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    default: {
      // Golden motes
      for (let i = 0; i < 4; i++) {
        const angle = t * 1.5 + (i * (Math.PI / 2));
        const mx = cx + Math.cos(angle) * 14;
        const my = cy - 24 + Math.sin(angle) * 8;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.beginPath();
        ctx.arc(mx, my, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
  }
}

/**
 * Draws the combined procedural scene: Primary entity interacting with Companion entity!
 */
function drawProceduralCompositeScene(ctx, cx, cy, monument, primaryEntity, secondaryEntity, primaryColor, timeMs, seed) {
  const bobY = Math.sin(timeMs * 0.003 + seed) * 3;

  // Luminous aura unifying the elements
  const aura = ctx.createRadialGradient(cx, cy - 22 + bobY, 2, cx, cy - 22 + bobY, 22);
  aura.addColorStop(0, hexToRgba(primaryColor, 0.45));
  aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 22 + bobY, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // SPECIAL CASE: Kitten + Rain / Umbrella
  const primaryEn = primaryEntity?.en || '';
  const isKittenRain = (primaryEn === 'cat' || primaryEn === 'kitten') && monument.weather === 'rain_storm';

  if (isKittenRain) {
    // 1. Draw sheltering umbrella angled over the kitten
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 32 + bobY, 14, Math.PI, 0);
    ctx.fill();
    // Umbrella handle
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 32 + bobY);
    ctx.lineTo(cx - 2, cy - 18 + bobY);
    ctx.stroke();

    // 2. The cozy kitten resting safely under umbrella
    drawEntityGraphic(ctx, cx - 2, cy - 18 + bobY, primaryEntity, 28);

    // 3. Tiny heart floating above showing rescue/love
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('❤️', cx + 12, cy - 34 + bobY);
    return;
  }

  // SPECIAL CASE: Mountain / Snowy peak + Book
  const isBookMountain = (primaryEn === 'book' || primaryEn === 'books') && monument.terrain === 'snow_mountain';
  if (isBookMountain) {
    // Glowing open book with golden runes
    drawEntityGraphic(ctx, cx, cy - 20 + bobY, primaryEntity, 30);
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('✨', cx - 12, cy - 28 + bobY);
    ctx.fillText('🕯️', cx + 12, cy - 24 + bobY);
    return;
  }

  // SPECIAL CASE: Runner / Victory + Trophy
  const isRunnerVictory = (primaryEn === 'victory' || primaryEn === 'trophy' || primaryEn === 'running-shoes');
  if (isRunnerVictory) {
    drawEntityGraphic(ctx, cx, cy - 22 + bobY, primaryEntity, 32);
    // Laurel / sparkles
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('🥇', cx - 13, cy - 22 + bobY);
    ctx.fillText('✨', cx + 13, cy - 26 + bobY);
    return;
  }

  // DEFAULT COMPOSITE: Primary Subject + Companion Prop
  // Primary Entity (Front & Center)
  drawEntityGraphic(ctx, cx, cy - 22 + bobY, primaryEntity, 30);

  // Companion Prop (Positioned nearby, interacting)
  if (secondaryEntity) {
    const secBob = Math.sin(timeMs * 0.003 + seed + 1.2) * 2.5;
    drawEntityGraphic(ctx, cx + 14, cy - 28 + secBob, secondaryEntity, 20);
  }
}

/**
 * Draws an entity graphic (SVG icon if loaded, or rich colored emoji)
 */
function drawEntityGraphic(ctx, x, y, entity, size = 26) {
  const iconUrl = entity.iconUrl || entity.svgUrl;
  let drewImg = false;

  if (iconUrl) {
    const img = getOrCreateCachedImage(iconUrl);
    if (img && img.complete && img.naturalWidth > 0) {
      // Glow backdrop
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.arc(x, y, size / 2 + 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      drewImg = true;
    }
  }

  if (!drewImg) {
    ctx.font = `${Math.round(size * 0.85)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(entity.emoji || '✨', x, y);
  }
}

/**
 * Draws a full AI-painted diorama illustration in an isometric crystal sphere
 */
function drawAiDioramaGlobe(ctx, cx, cy, img, primaryColor, timeMs) {
  const bobY = Math.sin(timeMs * 0.003) * 3;
  const radius = 24;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + bobY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Draw the full AI-painted diorama
  ctx.drawImage(img, cx - radius, cy + bobY - radius, radius * 2, radius * 2);
  ctx.restore();

  // Crystal glass rim & sunlit reflection
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy + bobY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Glass shine
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx - 5, cy + bobY - 5, radius * 0.7, Math.PI * 1.1, Math.PI * 1.6);
  ctx.stroke();
}

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string') return `rgba(245, 158, 11, ${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(245, 158, 11, ${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}
