/**
 * LociCharacterTransformation:
 * Cognitive Memory Palace Metamorphosis Engine.
 * In accordance with the Von Restorff (Isolation / Bizarreness) Effect and Dual-Coding Theory:
 * Whenever the character steps into a room, they physically and hilariously metamorphose
 * into the memory item (Giant Sunglasses, Walking Smartphone, Billowing T-Shirt,
 * Sloshing Water Bottle, Jingling Car Keys with Headlight Beams).
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnPoof(x, y, color = '#fbbf24') {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 2.8;
      this.particles.push({
        x,
        y: y - 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: 5 + Math.random() * 7,
        alpha: 1.0,
        decay: 0.028 + Math.random() * 0.018,
        type: i % 2 === 0 ? 'star' : 'cloud',
        color: i % 2 === 0 ? '#fef08a' : color
      });
    }
  }

  spawnTrail(x, y, type) {
    if (Math.random() > 0.45) return;
    if (type === 'entry_foyer') {
      // Golden sun sparkles
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.8 - Math.random() * 0.8,
        size: 3 + Math.random() * 3,
        alpha: 0.9,
        decay: 0.04,
        type: 'sparkle',
        color: '#fbbf24'
      });
    } else if (type === 'main_hall') {
      // Digital cyan pulse rings
      this.particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 6,
        vx: 0,
        vy: -0.3,
        size: 2,
        maxSize: 14,
        alpha: 0.8,
        decay: 0.035,
        type: 'ring',
        color: '#38bdf8'
      });
    } else if (type === 'left_store') {
      // Gentle fresh laundry soap bubbles
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 10 + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1.2 - Math.random() * 0.8,
        size: 4 + Math.random() * 4,
        alpha: 0.85,
        decay: 0.022,
        type: 'bubble',
        color: '#e0f2fe'
      });
    } else if (type === 'right_sanctuary') {
      // Water splash droplets & ripples
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 5,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -1.0 - Math.random() * 1.5,
        gravity: 0.12,
        size: 3 + Math.random() * 2.5,
        alpha: 0.9,
        decay: 0.03,
        type: 'droplet',
        color: '#0284c7'
      });
    } else if (type === 'right_south') {
      // Metallic golden sparks
      this.particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 0.6,
        size: 3 + Math.random() * 2.5,
        alpha: 0.9,
        decay: 0.035,
        type: 'sparkle',
        color: '#eab308'
      });
    }
  }

  updateAndDraw(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = p.size;
        for (let s = 0; s < 5; s++) {
          const a1 = (s * Math.PI * 2) / 5 - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          ctx.lineTo(p.x + Math.cos(a1) * r, p.y + Math.sin(a1) * r);
          ctx.lineTo(p.x + Math.cos(a2) * (r * 0.45), p.y + Math.sin(a2) * (r * 0.45));
        }
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'bubble') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.fillStyle = 'rgba(224, 242, 254, 0.25)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Bubble glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ring') {
        p.size += 0.4;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'droplet') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sparkle / Cloud
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}

export const lociParticles = new ParticleSystem();

/**
 * Draws the character metamorphosis on canvas
 */
export function drawLociCharacterMetamorphosis(ctx, params) {
  // Transformation animations and trail disabled per user request (normal character)
  return;
}

/**
 * 1. ENTRY FOYER: GIANT GLAMOROUS SUNGLASSES
 */
function drawGiantSunglassesCostume(ctx, { x, y, time, facingLeft, walkCycle }) {
  const headY = y - 24;
  const bob = Math.sin(walkCycle * 2) * 2;
  const dir = facingLeft ? -1 : 1;

  ctx.save();
  ctx.translate(x, headY + bob);

  // Aura of bright sunlight around head
  const auraGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
  auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
  auraGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();

  // Giant Sunglasses Frame (Oversized width: 44px, height: 20px)
  const glassW = 44;
  const glassH = 20;

  // Golden brow bar
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#d97706';
  ctx.fillStyle = '#f59e0b';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-glassW / 2 - 2, -3);
  ctx.quadraticCurveTo(0, -7, glassW / 2 + 2, -3);
  ctx.stroke();

  // Left & Right Lenses (Deep midnight indigo with gold rims)
  const lensW = 18;
  const lensH = 16;
  const lensR = 5;

  [-12, 12].forEach((lx) => {
    // Outer Gold Rim
    ctx.fillStyle = '#b45309';
    roundRect(ctx, lx - lensW / 2 - 1.5, -2, lensW + 3, lensH + 3, lensR + 1);
    ctx.fill();

    // Dark Polarized Lens
    const lensGrad = ctx.createLinearGradient(lx, -2, lx, lensH);
    lensGrad.addColorStop(0, '#1e1b4b');
    lensGrad.addColorStop(0.5, '#312e81');
    lensGrad.addColorStop(1, '#4338ca');
    ctx.fillStyle = lensGrad;
    roundRect(ctx, lx - lensW / 2, 0, lensW, lensH, lensR);
    ctx.fill();

    // Glossy Glare Reflection Line
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, lx - lensW / 2, 0, lensW, lensH, lensR);
    ctx.clip();
    const glareX = lx - 4 + Math.sin(time * 0.003) * 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(glareX - 6, -2);
    ctx.lineTo(glareX + 4, lensH + 2);
    ctx.stroke();
    ctx.restore();
  });

  // Nose bridge
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-3, 2);
  ctx.quadraticCurveTo(0, -1, 3, 2);
  ctx.stroke();

  // Sparkle stars at edges
  const sparkPhase = Math.sin(time * 0.006);
  if (sparkPhase > 0.2) {
    drawMiniSparkle(ctx, -glassW / 2 - 1, -4, 4 * sparkPhase);
    drawMiniSparkle(ctx, glassW / 2 + 1, -4, 4 * sparkPhase);
  }

  // Floating Speech Bubble
  drawFloatingSpeechBubble(ctx, 0, -32, '🕶️ משקפי שמש!', 'שלא נסתנוור ביציאה!');

  ctx.restore();
}

/**
 * 2. MAIN HALL: GIANT VIBRATING SMARTPHONE
 */
function drawWalkingSmartphoneCostume(ctx, { x, y, time, facingLeft, walkCycle, isWalking }) {
  const bob = Math.sin(walkCycle * 2) * 2;
  const jitter = isWalking ? Math.sin(time * 0.06) * 1.5 : Math.sin(time * 0.02) * 0.8;

  ctx.save();
  ctx.translate(x + jitter, y - 28 + bob);

  const phoneW = 34;
  const phoneH = 50;
  const phoneR = 6;

  // Vibration sound wave arcs emitting from sides
  const wavePulse = (time * 0.005) % 1;
  const waveDist = 20 + wavePulse * 16;
  ctx.strokeStyle = `rgba(56, 189, 248, ${1 - wavePulse})`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(-waveDist, 0, 14, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(waveDist, 0, 14, Math.PI * 0.65, Math.PI * 1.35);
  ctx.stroke();

  // Outer phone case (Titanium Dark Slate)
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, -phoneW / 2, -phoneH / 2, phoneW, phoneH, phoneR);
  ctx.fill();
  ctx.stroke();

  // Glowing OLED Screen
  const screenW = phoneW - 6;
  const screenH = phoneH - 10;
  const screenGrad = ctx.createLinearGradient(0, -screenH / 2, 0, screenH / 2);
  screenGrad.addColorStop(0, '#0369a1');
  screenGrad.addColorStop(0.5, '#0284c7');
  screenGrad.addColorStop(1, '#075985');
  ctx.fillStyle = screenGrad;
  roundRect(ctx, -screenW / 2, -screenH / 2 + 1, screenW, screenH, phoneR - 2);
  ctx.fill();

  // Speaker Notch at top
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, -7, -phoneH / 2 + 2, 14, 2.5, 1);
  ctx.fill();

  // Screen Content: App grid & Calling banner
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 7px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('12:00', 0, -phoneH / 2 + 11);

  // App Icons (Tiny colored squares)
  const appColors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
  appColors.forEach((c, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const ix = -10 + col * 10;
    const iy = -4 + row * 9;
    ctx.fillStyle = c;
    roundRect(ctx, ix - 3.5, iy - 3.5, 7, 7, 1.5);
    ctx.fill();
  });

  // Incoming Call Bar
  ctx.fillStyle = '#10b981';
  roundRect(ctx, -screenW / 2 + 2, screenH / 2 - 10, screenW - 4, 7, 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 5.5px sans-serif';
  ctx.fillText('📞 שיחה נכנסת', 0, screenH / 2 - 4.5);

  // Floating Speech Bubble
  drawFloatingSpeechBubble(ctx, 0, -phoneH / 2 - 14, '📱 רינג-רינג! טלפון חכם!', 'שיחות ומשימות שלא נשכח!');

  ctx.restore();
}

/**
 * 3. LEFT WING: GIANT BILLOWING T-SHIRT WITH WINGS
 */
function drawBillowingTShirtCostume(ctx, { x, y, time, facingLeft, walkCycle, isWalking }) {
  const bob = Math.sin(walkCycle * 2) * 2;
  const flap = isWalking ? Math.sin(walkCycle * 3) * 0.15 : Math.sin(time * 0.004) * 0.06;

  ctx.save();
  ctx.translate(x, y - 24 + bob);

  const shirtW = 40;
  const shirtH = 34;

  // Fresh laundry clean aura
  ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();

  // T-Shirt Torso (Bright Cyan-White Cotton)
  ctx.save();
  ctx.rotate(flap);

  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;

  ctx.beginPath();
  // Collar
  ctx.moveTo(-10, -shirtH / 2);
  ctx.quadraticCurveTo(0, -shirtH / 2 + 5, 10, -shirtH / 2);
  // Right Shoulder & Flapping Sleeve
  ctx.lineTo(shirtW / 2 + 8, -shirtH / 2 + 7 + Math.sin(walkCycle * 2) * 3);
  ctx.lineTo(shirtW / 2 + 2, -shirtH / 2 + 18);
  ctx.lineTo(shirtW / 2 - 4, -shirtH / 2 + 14);
  // Right side & Bottom hem
  ctx.lineTo(shirtW / 2 - 4, shirtH / 2);
  ctx.quadraticCurveTo(0, shirtH / 2 + 3, -shirtW / 2 + 4, shirtH / 2);
  // Left side & Flapping Sleeve
  ctx.lineTo(-shirtW / 2 + 4, -shirtH / 2 + 14);
  ctx.lineTo(-shirtW / 2 - 2, -shirtH / 2 + 18);
  ctx.lineTo(-shirtW / 2 - 8, -shirtH / 2 + 7 - Math.sin(walkCycle * 2) * 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // White Clean Stripe & Laundry Icon
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨', 0, 1);

  // Collar Ribbing
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, -shirtH / 2, 8, 0, Math.PI);
  ctx.stroke();

  ctx.restore();

  // Floating Speech Bubble
  drawFloatingSpeechBubble(ctx, 0, -shirtH / 2 - 14, '👕 חולצה נקייה להחלפה!', 'להתרענן בסוף יום העבודה!');

  ctx.restore();
}

/**
 * 4. RIGHT SANCTUARY NORTH: GIANT SLOSHING WATER BOTTLE
 */
function drawSloshingWaterBottleCostume(ctx, { x, y, time, facingLeft, walkCycle, isWalking }) {
  const bob = Math.sin(walkCycle * 2) * 2;
  const slosh = isWalking ? Math.sin(walkCycle * 2) * 4 : Math.sin(time * 0.004) * 1.5;

  ctx.save();
  ctx.translate(x, y - 26 + bob);

  const botW = 28;
  const botH = 46;
  const botR = 8;

  // Soft cool blue moisture aura
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();

  // Bottle Outer Body (Transparent Glass / Hard Plastic)
  ctx.fillStyle = 'rgba(240, 249, 255, 0.35)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.2;
  roundRect(ctx, -botW / 2, -botH / 2 + 6, botW, botH - 6, botR);
  ctx.fill();
  ctx.stroke();

  // Water Liquid Inside (Sloshing dynamically!)
  ctx.save();
  roundRect(ctx, -botW / 2 + 1.5, -botH / 2 + 7.5, botW - 3, botH - 9, botR - 1.5);
  ctx.clip();

  const waterLevel = -botH / 2 + 18;
  const waterGrad = ctx.createLinearGradient(0, waterLevel, 0, botH / 2);
  waterGrad.addColorStop(0, '#38bdf8');
  waterGrad.addColorStop(0.7, '#0284c7');
  waterGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = waterGrad;

  ctx.beginPath();
  ctx.moveTo(-botW / 2, botH / 2);
  ctx.lineTo(botW / 2, botH / 2);
  ctx.lineTo(botW / 2, waterLevel - slosh);
  ctx.quadraticCurveTo(0, waterLevel + slosh * 1.5, -botW / 2, waterLevel + slosh);
  ctx.closePath();
  ctx.fill();

  // Floating Ice Cube bobbing in water
  const iceBob = Math.sin(time * 0.005) * 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1;
  roundRect(ctx, -4, waterLevel + 3 + iceBob, 8, 8, 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Bottle Neck & Cap (Deep Navy / Sports Spout)
  ctx.fillStyle = '#0369a1';
  roundRect(ctx, -7, -botH / 2 + 2, 14, 5, 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  roundRect(ctx, -4, -botH / 2 - 3, 8, 5, 2);
  ctx.fill();

  // Volume measurement ticks on side
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.2;
  for (let t = -4; t <= 12; t += 5) {
    ctx.beginPath();
    ctx.moveTo(botW / 2 - 5, t);
    ctx.lineTo(botW / 2 - 1, t);
    ctx.stroke();
  }

  // Floating Speech Bubble
  drawFloatingSpeechBubble(ctx, 0, -botH / 2 - 14, '💧 גלוק-גלוק! בקבוק מים!', 'לגימה קרה ומרעננת לצמא!');

  ctx.restore();
}

/**
 * 5. RIGHT SANCTUARY SOUTH: GIANT JINGLING CAR KEYS WITH HEADLIGHT BEAMS
 */
function drawJinglingCarKeysCostume(ctx, { x, y, time, facingLeft, walkCycle }) {
  const bob = Math.sin(walkCycle * 2) * 2;
  const dir = facingLeft ? -1 : 1;
  const swing = Math.sin(walkCycle * 1.5) * 0.25;

  ctx.save();
  ctx.translate(x, y - 24 + bob);

  // Twin Headlight Projection Beams lighting up the floor!
  ctx.save();
  const beamAngle = dir === 1 ? 0 : Math.PI;
  const beamGrad = ctx.createRadialGradient(dir * 10, 4, 2, dir * 90, 16, 95);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
  beamGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.25)');
  beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(dir * 8, 0);
  ctx.lineTo(dir * 110, -28);
  ctx.lineTo(dir * 110, 42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Golden Master Keyring
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, -6, 14, 0, Math.PI * 2);
  ctx.stroke();

  // Car Remote Fob (Dangling)
  ctx.save();
  ctx.translate(-6, 2);
  ctx.rotate(swing * 0.8);
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  roundRect(ctx, -8, 0, 16, 26, 5);
  ctx.fill();
  ctx.stroke();

  // Buttons on Remote
  ctx.fillStyle = '#ef4444'; // Lock button
  ctx.beginPath();
  ctx.arc(-3, 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e'; // Unlock button
  ctx.beginPath();
  ctx.arc(3, 6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Blinking Car Alarm LED (beeping!)
  const blink = Math.sin(time * 0.008) > 0;
  ctx.fillStyle = blink ? '#fbbf24' : '#78350f';
  ctx.beginPath();
  ctx.arc(0, 15, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Heavy Brass Ignition Key (Swinging)
  ctx.save();
  ctx.translate(6, 2);
  ctx.rotate(-swing * 1.2);
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;

  // Key bow
  ctx.beginPath();
  ctx.arc(0, 4, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Key blade & teeth
  ctx.fillStyle = '#fde047';
  roundRect(ctx, -2.5, 9, 5, 20, 1);
  ctx.fill();
  ctx.stroke();

  // Teeth notches
  ctx.fillStyle = '#b45309';
  ctx.fillRect(1, 16, 2.5, 2);
  ctx.fillRect(1, 22, 2.5, 2.5);

  ctx.restore();

  // Floating Speech Bubble
  drawFloatingSpeechBubble(ctx, 0, -32, '🏎️ רונאלדו וסטיב ג׳ובס בפרארי!', 'עם משקפי שמש ושתו בקבוק מים! 🕶️💧');

  ctx.restore();
}

/**
 * Utility: Comic Speech Bubble
 */
function drawFloatingSpeechBubble(ctx, x, y, title, subtitle) {
  // Popups disabled per user preference
  return;
}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawMiniSparkle(ctx, x, y, size) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.3, y - size * 0.3);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.3, y + size * 0.3);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.3, y + size * 0.3);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.3, y - size * 0.3);
  ctx.closePath();
  ctx.fill();
}
