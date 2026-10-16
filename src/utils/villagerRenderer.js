import { SKIN_TONES, HAIR_COLORS } from '../data/wardrobe';

/**
 * Renders the cute cozy villager at given coordinates with any scale.
 * Supports full customization: skinTone, hairColor, hairStyle, glasses, headwear, accessory,
 * as well as all outfits and activity props.
 */
export function drawCompleteVillager(ctx, {
  cx = 0,
  cy = 0,
  scale = 1,
  outfit = 'autumn_sweater',
  inWater = false,
  activity = null,
  activityTimer = 0,
  facingLeft = false,
  isWalking = false,
  walkCycle = 0,
  hopY = 0,
  isNight = false,
  isSunset = false,
  look = {},
  timestamp = Date.now()
}) {
  const effectiveOutfit = inWater ? 'swimwear' : (outfit || 'autumn_sweater');
  const isSitting = activity === 'drinking_tea' || activity === 'bonfire_warming' || activity === 'reading_book';

  // Resolve custom appearance
  const skinObj = SKIN_TONES.find(s => s.id === look.skinTone) || SKIN_TONES[1];
  const skinColor = skinObj.color;
  const skinShadow = skinObj.shadow;

  const hairObj = HAIR_COLORS.find(h => h.id === look.hairColor) || HAIR_COLORS[0];
  const hairColor = hairObj.color;
  const hairStyle = look.hairStyle || 'messy';
  const glasses = look.glasses || 'none';
  const headwear = look.headwear || 'outfit_default';
  const accessory = look.accessory || 'none';

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 1. Water ripples or Ground contact shadow
  if (inWater) {
    const ripPhase = timestamp * 0.005;
    const ripR = 13 + Math.sin(ripPhase) * 2.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 3, ripR, ripR * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    const ripInner = 8 + Math.cos(ripPhase * 1.3) * 1.8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 3, ripInner, ripInner * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const shadowScale = Math.max(0.6, 1 + hopY * 0.03);
    ctx.save();
    ctx.translate(0, 1);
    ctx.scale(1, 0.5);
    const aoR = 12 * shadowScale;
    const aoGrad = ctx.createRadialGradient(0, 0, aoR * 0.1, 0, 0, aoR);
    aoGrad.addColorStop(0, isNight ? 'rgba(45, 31, 24, 0.45)' : 'rgba(45, 31, 24, 0.3)');
    aoGrad.addColorStop(0.65, isNight ? 'rgba(45, 31, 24, 0.28)' : 'rgba(45, 31, 24, 0.18)');
    aoGrad.addColorStop(1, 'rgba(45, 31, 24, 0)');
    ctx.fillStyle = aoGrad;
    ctx.beginPath();
    ctx.arc(0, 0, aoR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Vertical bobbing
  let charY = 0;
  if (inWater) {
    charY = 2 + Math.sin(timestamp * 0.006) * 1.6;
  } else if (isSitting) {
    charY = 3 + Math.sin(timestamp * 0.003) * 0.5;
  } else {
    const walkBob = isWalking ? Math.abs(Math.sin(walkCycle * 2)) * 2.2 : Math.sin(timestamp * 0.004) * 0.6;
    charY = hopY - walkBob - 1;
  }

  ctx.translate(0, charY);
  if (facingLeft) {
    ctx.scale(-1, 1);
  }

  const legCycle = isWalking ? Math.sin(walkCycle) * 3.5 : 0;

  // 3. Legs & Footwear
  if (effectiveOutfit === 'swimwear') {
    // Striped shorts
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-4.5, -7, 9, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -7, 1.4, 5);
    ctx.fillRect(1.5, -7, 1.4, 5);

    // Bare legs in water with chosen skin color
    const kick = isWalking ? Math.sin(walkCycle * 2) * 2.4 : Math.sin(timestamp * 0.005) * 1.2;
    ctx.fillStyle = skinColor;
    ctx.fillRect(-4.5 + kick * 0.4, -2, 3, 3);
    ctx.fillRect(1.5 - kick * 0.4, -2, 3, 3);

    // Splash spray
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(-4 + kick, 1.5, 1.8, 0, Math.PI * 2);
    ctx.arc(4 - kick, 1.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Rubber Duck Floatie Ring
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, -7.5, 8.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(0, -7.5, 4.8, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute duck head
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(6.5, -10.5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Duck beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(8.5, -11.5);
    ctx.lineTo(12.5, -10.5);
    ctx.lineTo(8.5, -9.5);
    ctx.closePath();
    ctx.fill();

    // Duck eye
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(7.2, -11.2, 0.65, 0, Math.PI * 2);
    ctx.fill();
  } else if (isSitting) {
    let pantsColor = '#334155';
    let shoesColor = '#78350f';
    if (effectiveOutfit === 'gardener') {
      pantsColor = '#1d4ed8'; shoesColor = '#eab308';
    } else if (effectiveOutfit === 'cozy_robe') {
      pantsColor = '#9333ea'; shoesColor = '#f472b6';
    } else if (effectiveOutfit === 'baker_apron') {
      pantsColor = '#5c2e14'; shoesColor = '#292524';
    } else if (effectiveOutfit === 'adventurer') {
      pantsColor = '#3f2e1e'; shoesColor = '#451a03';
    } else if (effectiveOutfit === 'zen_robe') {
      pantsColor = '#e0e7ff'; shoesColor = '#78350f';
    }
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-5.5, -4.5, 11, 4.5, 2) : ctx.rect(-5.5, -4.5, 11, 4.5);
    ctx.fill();
    ctx.fillStyle = shoesColor;
    ctx.beginPath();
    ctx.arc(-6, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    let pantsColor = '#334155';
    let bootColor1 = '#78350f';
    let bootColor2 = '#92400e';

    if (effectiveOutfit === 'gardener') {
      pantsColor = '#1d4ed8'; bootColor1 = '#ca8a04'; bootColor2 = '#eab308';
    } else if (effectiveOutfit === 'adventurer') {
      pantsColor = '#3f2e1e'; bootColor1 = '#451a03'; bootColor2 = '#5c2e14';
    } else if (effectiveOutfit === 'cozy_robe') {
      pantsColor = '#a855f7'; bootColor1 = '#f472b6'; bootColor2 = '#f472b6';
    } else if (effectiveOutfit === 'baker_apron') {
      pantsColor = '#44403c'; bootColor1 = '#292524'; bootColor2 = '#1c1917';
    } else if (effectiveOutfit === 'zen_robe') {
      pantsColor = '#e0e7ff'; bootColor1 = '#78350f'; bootColor2 = '#92400e';
    }

    // Back leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(-4.5 - legCycle * 0.5, -6, 3, 5);
    ctx.fillStyle = bootColor1;
    ctx.beginPath();
    ctx.rect(-5.5 - legCycle * 0.5, -2, 4.5, 3);
    ctx.fill();

    // Front leg
    ctx.fillStyle = pantsColor;
    ctx.fillRect(1.5 + legCycle * 0.5, -6, 3, 5);
    ctx.fillStyle = bootColor2;
    ctx.beginPath();
    ctx.rect(0.5 + legCycle * 0.5, -2, 4.5, 3);
    ctx.fill();

    if (effectiveOutfit === 'cozy_robe') {
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(-5.5 - legCycle * 0.5, -4, 1.5, 2.5);
      ctx.fillRect(1.5 + legCycle * 0.5, -4, 1.5, 2.5);
    }
  }

  // 4. Torso & Clothes
  if (effectiveOutfit === 'swimwear') {
    ctx.fillStyle = skinColor;
    ctx.fillRect(-5, -15, 10, 9);
    ctx.strokeStyle = skinShadow;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-2, -12);
    ctx.lineTo(0, -10.5);
    ctx.lineTo(2, -12);
    ctx.stroke();
  } else if (effectiveOutfit === 'autumn_sweater') {
    ctx.fillStyle = isNight ? '#b45309' : (isSunset ? '#d97706' : '#f59e0b');
    ctx.fillRect(-5.5, -15, 11, 10);
    // Cream collar
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, -14.5, 4.5, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crossbody strap & bag
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-4.5, -14);
    ctx.lineTo(4, -8);
    ctx.stroke();
    ctx.fillStyle = '#92400e';
    ctx.fillRect(2.5, -9, 4, 3.5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(4, -8, 1.2, 1.2);
  } else if (effectiveOutfit === 'gardener') {
    ctx.fillStyle = '#86efac';
    ctx.fillRect(-5.5, -15, 11, 10);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-4.5, -13, 9, 8);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-4.5, -15, 2, 6);
    ctx.fillRect(2.5, -15, 2, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-4, -13, 1.2, 1.2);
    ctx.fillRect(3, -13, 1.2, 1.2);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(-1.5, -10, 3, 2.5);
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(0, -10.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (effectiveOutfit === 'adventurer') {
    ctx.fillStyle = isNight ? '#052e16' : '#15803d';
    ctx.fillRect(-5.5, -15, 11, 10);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4.5, -14);
    ctx.lineTo(4.5, -7);
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-0.5, -11, 2, 2);
  } else if (effectiveOutfit === 'cozy_robe') {
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-5.5, -15, 11, 10);
    ctx.fillStyle = '#faf5ff';
    ctx.fillRect(-1.5, -15, 3, 10);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(-5.5, -9, 11, 1.8);
    ctx.fillStyle = '#faf5ff';
    ctx.fillRect(-1, -8, 2, 3);
  } else if (effectiveOutfit === 'baker_apron') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-5.5, -15, 11, 10);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-3.5, -13, 7, 8);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-3.5, -13, 7, 8);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(1, -12, 1.2, 4);
  } else if (effectiveOutfit === 'zen_robe') {
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-5.5, -15, 11, 10);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(-5.5, -10, 11, 2.5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-0.5, -9.5, 1.5, 1.5);
  }

  // 5. Arms & Activity Props
  if (activity === 'drinking_tea') {
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(2, -10, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(3.5, -13, 4.5, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, -13.5, 3.5, 1);

    const sTime = timestamp * 0.003;
    for (let s = 0; s < 3; s++) {
      const sx = 4.5 + Math.sin(sTime + s * 1.6) * 1.8;
      const sy = -14 - ((sTime * 12 + s * 7) % 15);
      const alpha = Math.max(0, 1 - ((-14 - sy) / 15));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2 + s * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (activity === 'gardening') {
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(4, -13, 5, 4.5);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(3, -15, 1.2, 3);
    ctx.beginPath();
    ctx.moveTo(9, -11);
    ctx.lineTo(13, -7);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const dTime = timestamp * 0.008;
    for (let d = 0; d < 4; d++) {
      const dx = 13 + d * 1.5;
      const dy = -6 + ((dTime * 15 + d * 6) % 11);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(dx, dy, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (activity === 'tending_crops') {
    // Villager holds a fresh carrot and small hand-trowel
    ctx.fillStyle = '#ea580c'; // Carrot orange
    ctx.beginPath();
    ctx.moveTo(4, -8);
    ctx.lineTo(8, -13);
    ctx.lineTo(6, -14);
    ctx.closePath();
    ctx.fill();
    // Carrot leafy greens
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(7, -13.5);
    ctx.lineTo(10, -16);
    ctx.moveTo(7, -13.5);
    ctx.lineTo(8.5, -17);
    ctx.stroke();
    // Hand
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(4, -10, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (activity === 'farming_wheat') {
    // Golden sickle and wheat sheaf
    ctx.strokeStyle = '#94a3b8'; // Steel sickle curve
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(6, -11, 4, -Math.PI * 0.4, Math.PI * 0.5);
    ctx.stroke();
    ctx.strokeStyle = '#78350f'; // Sickle handle
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(6, -7);
    ctx.lineTo(4, -5);
    ctx.stroke();
    // Golden wheat grains
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(8, -12, 1.8, 3.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (activity === 'mining_gems') {
    // Iron pickaxe & glowing gems
    const swingPhase = Math.sin(timestamp * 0.012);
    ctx.save();
    ctx.translate(4, -10);
    ctx.rotate(swingPhase * 0.4);
    // Wooden handle
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(4, -8);
    ctx.stroke();
    // Steel pickaxe head
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(7, -7);
    ctx.stroke();
    // Glowing crystal sparkle
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(7, -6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (activity === 'bonfire_warming') {
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(4, -10, 1.8, 0, Math.PI * 2);
    ctx.arc(6, -9.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    const glowPhase = Math.sin(timestamp * 0.015) * 0.15 + 0.35;
    ctx.fillStyle = `rgba(251, 146, 60, ${glowPhase})`;
    ctx.beginPath();
    ctx.arc(5, -11, 7.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (activity === 'reading_book') {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(2, -12, 7, 5.5);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(2.5, -11.5, 6, 4.5);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(5.5, -11.5);
    ctx.lineTo(5.5, -7);
    ctx.stroke();
  } else if (activity === 'picking_fruit') {
    const isPlucking = activityTimer > 250;
    if (isPlucking) {
      const reachY = -22 + Math.sin(timestamp * 0.01) * 2;
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(3, -13);
      ctx.lineTo(6, reachY);
      ctx.stroke();

      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(6, reachY - 1, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(7.5, reachY + 2, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6.8, reachY + 1.2, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(8.5, reachY - 0.5, 2, 1.2);
    } else {
      const munchPhase = Math.sin(timestamp * 0.012);
      const appleY = -12 + (munchPhase > 0.3 ? -1.5 : 0);

      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0.5, appleY + 1, 1.8, 0, Math.PI * 2);
      ctx.arc(5.5, appleY + 1, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(3, appleY, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(4.2, appleY - 1.2, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, appleY - 1.2, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(3.2, appleY - 4.2, 2, 1.2);

      const sT = timestamp * 0.006;
      for (let sp = 0; sp < 3; sp++) {
        const sx = 3 + Math.sin(sT + sp * 2) * 6;
        const sy = appleY - 5 - ((sT * 8 + sp * 5) % 10);
        ctx.fillStyle = sp % 2 === 0 ? '#fde047' : '#f472b6';
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (effectiveOutfit === 'swimwear') {
    const armCycle = isWalking ? Math.sin(walkCycle * 2) * 2.5 : Math.sin(timestamp * 0.005) * 1.5;
    ctx.fillStyle = skinColor;
    ctx.fillRect(-6.5 - armCycle * 0.4, -13, 2.5, 5);
    ctx.fillRect(4 + armCycle * 0.4, -13, 2.5, 5);
  } else {
    const armSwing = isWalking ? Math.sin(walkCycle) * 2.5 : 0;
    let sleeveColor = isNight ? '#92400e' : '#d97706';
    if (effectiveOutfit === 'gardener') sleeveColor = '#86efac';
    else if (effectiveOutfit === 'adventurer') sleeveColor = '#15803d';
    else if (effectiveOutfit === 'cozy_robe') sleeveColor = '#a855f7';
    else if (effectiveOutfit === 'baker_apron') sleeveColor = '#ef4444';
    else if (effectiveOutfit === 'zen_robe') sleeveColor = '#f472b6';

    ctx.fillStyle = sleeveColor;
    ctx.fillRect(-6.5 - armSwing * 0.4, -13, 2.5, 6);
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(-5.5 - armSwing * 0.4, -6.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = sleeveColor;
    ctx.fillRect(4, -13, 2.5, 5);
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(5.2, -8, 1.4, 0, Math.PI * 2);
    ctx.fill();

    if (effectiveOutfit === 'autumn_sweater' || effectiveOutfit === 'adventurer') {
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6.5, -13);
      ctx.lineTo(6.5, 0);
      ctx.stroke();
      ctx.fillStyle = effectiveOutfit === 'adventurer' ? '#34d399' : '#a16207';
      ctx.beginPath();
      ctx.arc(6.5, -13.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Cozy Scarf Accessory (around neck if selected)
  if (accessory === 'cozy_scarf' && effectiveOutfit !== 'swimwear') {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-6, -16.5, 12, 3.8, 2) : ctx.rect(-6, -16.5, 12, 3.8);
    ctx.fill();
    // Scarf tail hanging down
    ctx.fillRect(2, -14.5, 3.2, 7.5);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(2, -8, 3.2, 1.5); // Fringes
  }

  // 7. Head & Skin
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(0, -19.5, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // 8. Hair Rendering based on hairStyle and hairColor
  if (hairStyle !== 'bald') {
    ctx.fillStyle = hairColor;
    if (hairStyle === 'messy') {
      ctx.beginPath();
      ctx.arc(0, -21.5, 5.6, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-2, -21.5, 2.5, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -22, 2.2, 0, Math.PI);
      ctx.fill();
    } else if (hairStyle === 'curly') {
      // Bouncy curly puffs around head
      for (let angle = 0; angle < Math.PI * 1.5; angle += 0.5) {
        const hx = Math.cos(angle + Math.PI * 0.75) * 5.2;
        const hy = -20 + Math.sin(angle + Math.PI * 0.75) * 4.8;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (hairStyle === 'ponytail') {
      ctx.beginPath();
      ctx.arc(0, -21.5, 5.6, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      // Long cute ponytail in back
      ctx.beginPath();
      ctx.moveTo(-4, -20);
      ctx.quadraticCurveTo(-9, -15, -7, -9);
      ctx.quadraticCurveTo(-5, -12, -4, -18);
      ctx.fill();
      // Bow on ponytail
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(-6, -18, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hairColor;
    } else if (hairStyle === 'wavy_bob') {
      ctx.beginPath();
      ctx.arc(0, -21.5, 5.6, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      // Side wavy hair locks framing face
      ctx.fillRect(-5.8, -21, 2.8, 6.5);
      ctx.fillRect(3, -21, 2.8, 6.5);
    } else if (hairStyle === 'sleek_short') {
      ctx.beginPath();
      ctx.arc(0, -22, 5.4, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
    }
  }

  // 9. Headwear: Resolved from custom choice or outfit
  const effectiveHeadwear = headwear === 'outfit_default' 
    ? (effectiveOutfit === 'swimwear' ? 'swimwear_goggles' : effectiveOutfit)
    : headwear;

  if (effectiveHeadwear === 'swimwear_goggles' || effectiveOutfit === 'swimwear') {
    // Turquoise goggles
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-4.5, -21.5, 9, 2.2);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-3.5, -21.5, 2.5, 1.8);
    ctx.fillRect(1, -21.5, 2.5, 1.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -21.5, 1, 1);
    ctx.fillRect(1.5, -21.5, 1, 1);

    // Snorkel tube
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(4, -18);
    ctx.lineTo(5.5, -22);
    ctx.lineTo(6.5, -26);
    ctx.stroke();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(6.5, -26.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (effectiveHeadwear === 'autumn_sweater' || effectiveHeadwear === 'beret_autumn') {
    ctx.fillStyle = isNight ? '#064e3b' : (isSunset ? '#047857' : '#059669');
    ctx.beginPath();
    ctx.ellipse(0, -23.5, 6.2, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.ellipse(0, -22, 5.8, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -26.2, 1.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (effectiveHeadwear === 'gardener' || effectiveHeadwear === 'straw_hat') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, -22.5, 8.5, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(0, -24.5, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-4.5, -23.5, 9, 1.2);
  } else if (effectiveHeadwear === 'adventurer' || effectiveHeadwear === 'ranger_feather') {
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.ellipse(0, -23, 6.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(0, -24, 4.5, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(3, -24);
    ctx.quadraticCurveTo(5, -28, 4, -30);
    ctx.stroke();
  } else if (effectiveHeadwear === 'cozy_robe' || effectiveHeadwear === 'nightcap') {
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(-5, -22);
    ctx.lineTo(5, -22);
    ctx.lineTo(-2, -29);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, -29.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (effectiveHeadwear === 'baker_apron' || effectiveHeadwear === 'chef_toque') {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(0, -23.5, 5.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-2, -25.5, 2.5, 0, Math.PI * 2);
    ctx.arc(2, -25.5, 2.5, 0, Math.PI * 2);
    ctx.arc(0, -26.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (effectiveHeadwear === 'zen_robe' || effectiveHeadwear === 'flower_crown') {
    // Floral crown with cute colorful petals
    const fCols = ['#f472b6', '#fde047', '#38bdf8', '#a855f7', '#fb7185'];
    for (let fi = -4; fi <= 4; fi += 2) {
      ctx.fillStyle = fCols[Math.abs(fi) % fCols.length];
      ctx.beginPath();
      ctx.arc(fi, -23, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effectiveHeadwear === 'winter_beanie') {
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(0, -23.5, 5.6, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-5.5, -23.5, 11, 2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -29, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 10. Cheeks / Blush
  if (accessory === 'heart_blush') {
    // Glowing little hearts for blush!
    ctx.fillStyle = '#ec4899';
    ctx.font = '3.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('♥', -2.8, -17.5);
    ctx.fillText('♥', 2.8, -17.5);
  } else {
    ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
    ctx.beginPath();
    ctx.arc(-2.5, -18.2, 1.3, 0, Math.PI * 2);
    ctx.arc(2.5, -18.2, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 11. Freckles
  if (accessory === 'freckles') {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-3.2, -18.8, 0.6, 0.6);
    ctx.fillRect(-2, -18.2, 0.6, 0.6);
    ctx.fillRect(2, -18.2, 0.6, 0.6);
    ctx.fillRect(3.2, -18.8, 0.6, 0.6);
    ctx.fillRect(0, -18.5, 0.6, 0.6);
  }

  // 12. Nose Bandage
  if (accessory === 'nose_bandage') {
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-2, -19.2, 4, 1.4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-0.4, -19.2, 0.8, 1.4);
  }

  // 13. Eyes
  const isRelaxed = activity === 'drinking_tea' || activity === 'bonfire_warming' || inWater;
  const blinkTime = (timestamp % 4200) < 180;
  if (isRelaxed || blinkTime) {
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3, -19.5);
    ctx.lineTo(-1.2, -19.5);
    ctx.moveTo(1.2, -19.5);
    ctx.lineTo(3, -19.5);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(-2.2, -19.8, 0.95, 0, Math.PI * 2);
    ctx.arc(2.2, -19.8, 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2.5, -20.2, 0.4, 0, Math.PI * 2);
    ctx.arc(1.9, -20.2, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 14. Glasses
  if (glasses === 'scholar_gold') {
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(-2.2, -19.8, 1.8, 0, Math.PI * 2);
    ctx.arc(2.2, -19.8, 1.8, 0, Math.PI * 2);
    ctx.moveTo(-0.4, -19.8);
    ctx.lineTo(0.4, -19.8);
    ctx.stroke();
  } else if (glasses === 'scholar_black') {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.rect(-3.8, -21.2, 3.2, 2.6);
    ctx.rect(0.6, -21.2, 3.2, 2.6);
    ctx.moveTo(-0.6, -20);
    ctx.lineTo(0.6, -20);
    ctx.stroke();
  } else if (glasses === 'sunglasses_dark') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4.2, -21.2, 3.6, 2.8);
    ctx.fillRect(0.6, -21.2, 3.6, 2.8);
    ctx.fillRect(-0.6, -20.5, 1.2, 1);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(-3.6, -21, 1, 2);
    ctx.fillRect(1.2, -21, 1, 2);
  } else if (glasses === 'rose_tint') {
    ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.beginPath();
    ctx.arc(-2.2, -19.8, 1.9, 0, Math.PI * 2);
    ctx.arc(2.2, -19.8, 1.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 15. Gentle smile
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(0, -18.2, 1.4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}
