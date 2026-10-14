// Animal Isometric Renderer for Life Quest
// Renders adorable, peaceful living animals with idle/walk/peck animations and mind map tags

export function drawAnimal(ctx, animal, screenPos, options = {}) {
  const { isSunset = false, isNight = false, showTag = true, isHovered = false } = options;
  const { x: cx, y: cy } = screenPos;
  const facingLeft = animal.facingLeft;
  const walkCycle = animal.walkCycle || 0;
  const hopY = animal.hopY || 0;
  const time = Date.now() * 0.003;

  ctx.save();
  ctx.translate(cx, cy + hopY);

  // Soft ground contact shadow
  ctx.fillStyle = isNight ? 'rgba(5, 15, 30, 0.45)' : 'rgba(20, 35, 15, 0.25)';
  ctx.beginPath();
  const shadowW = animal.type === 'sheep' ? 16 : (animal.type === 'dog' ? 14 : (animal.type === 'duck' || animal.type === 'cat' ? 12 : 9));
  const shadowH = shadowW * 0.45;
  ctx.ellipse(0, 4 - hopY * 0.3, shadowW, shadowH, 0, 0, Math.PI * 2);
  ctx.fill();

  if (facingLeft) {
    ctx.scale(-1, 1);
  }

  switch (animal.type) {
    case 'chicken': {
      drawCozyChicken(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    case 'cat': {
      drawCozyCat(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    case 'dog': {
      drawCozyDog(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    case 'sheep': {
      drawCozySheep(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    case 'duck': {
      drawCozyDuck(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    case 'rabbit': {
      drawCozyRabbit(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
    default: {
      drawCozyChicken(ctx, walkCycle, animal.state, time, isSunset, isNight);
      break;
    }
  }

  ctx.restore();

  // Floating Mind Map Label / Name Tag
  if (showTag && animal.name) {
    drawAnimalNameTag(ctx, cx, cy - 22 + hopY, animal.name, animal.completed, isHovered);
  }
}

// 🐔 Cute Animated Chicken
function drawCozyChicken(ctx, walkCycle, state, time, isSunset, isNight) {
  const isPecking = state === 'pecking';
  const peckAngle = isPecking ? Math.sin(time * 6) * 0.35 : 0;
  const legSwing = Math.sin(walkCycle) * 3;

  // Legs & Feet
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  // Left leg
  ctx.beginPath();
  ctx.moveTo(-2, 1);
  ctx.lineTo(-2 - legSwing, 5);
  ctx.lineTo(-4 - legSwing, 5);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(2, 1);
  ctx.lineTo(2 + legSwing, 5);
  ctx.lineTo(0 + legSwing, 5);
  ctx.stroke();

  // Fluffy Body
  const bodyGrad = ctx.createLinearGradient(-8, -12, 6, 2);
  bodyGrad.addColorStop(0, '#ffffff');
  bodyGrad.addColorStop(0.7, '#fef3c7');
  bodyGrad.addColorStop(1, '#fde68a');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.ellipse(0, -4, 8, 6.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Tiny Wing with breathing flutter
  const wingFlutter = Math.sin(time * 3) * 0.8;
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(-1, -4 + wingFlutter, 4.5, 3.2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail feathers
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath();
  ctx.moveTo(-7, -4);
  ctx.lineTo(-11, -8);
  ctx.lineTo(-8, -1);
  ctx.closePath();
  ctx.fill();

  // Head with Peck rotation
  ctx.save();
  ctx.translate(5, -7);
  ctx.rotate(peckAngle);

  // Head circle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
  ctx.fill();

  // Red Comb (כרבולת)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-1, -4.5, 1.8, 0, Math.PI * 2);
  ctx.arc(1.5, -4.8, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Red Wattle (דלדל מתחת למקור)
  ctx.beginPath();
  ctx.arc(2, 3.2, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Beak (מקור צהוב)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(3, -1);
  ctx.lineTo(7, 0.5);
  ctx.lineTo(3, 2);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(1.5, -1, 1, 0, Math.PI * 2);
  ctx.fill();
  // Eye glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(1.8, -1.3, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 🐱 Cute Cozy Cat (חתול ג'ינג'י כפרי)
function drawCozyCat(ctx, walkCycle, state, time, isSunset, isNight) {
  const legSwing = Math.sin(walkCycle) * 3.5;
  const tailSway = Math.sin(time * 3) * 0.4;

  // Tail
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.quadraticCurveTo(-14 + tailSway * 3, -10, -12, -15 + tailSway * 4);
  ctx.stroke();

  // White tail tip
  ctx.strokeStyle = '#fff7ed';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-12, -13 + tailSway * 4);
  ctx.lineTo(-12, -15 + tailSway * 4);
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Back legs
  ctx.moveTo(-6, -1);
  ctx.lineTo(-6 - legSwing, 5);
  // Front legs
  ctx.moveTo(5, -1);
  ctx.lineTo(5 + legSwing, 5);
  ctx.stroke();

  // Body (Warm Ginger Orange)
  const bodyGrad = ctx.createLinearGradient(-10, -10, 8, 2);
  bodyGrad.addColorStop(0, '#f97316');
  bodyGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(-1, -4, 9, 6, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // White Chest Patch
  ctx.fillStyle = '#fff7ed';
  ctx.beginPath();
  ctx.ellipse(3, -3, 3.5, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.save();
  ctx.translate(6, -8);

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Ears (Pointy Cat Ears)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  // Left ear
  ctx.moveTo(-3.5, -3.5);
  ctx.lineTo(-5, -8.5);
  ctx.lineTo(-1, -4.8);
  ctx.closePath();
  ctx.fill();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(1, -4.8);
  ctx.lineTo(4, -8.5);
  ctx.lineTo(4.5, -3);
  ctx.closePath();
  ctx.fill();

  // Inner pink ear
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.moveTo(-3, -4);
  ctx.lineTo(-4, -7);
  ctx.lineTo(-1.5, -4.8);
  ctx.fill();

  // Eyes (Almond cat eyes)
  ctx.fillStyle = '#15803d'; // Emerald eyes
  ctx.beginPath();
  ctx.ellipse(1.8, -0.5, 1.3, 1.8, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(1.8, -0.5, 0.5, 1.4, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Tiny Pink Nose & Whiskers
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(4, 1, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(4, 1.5);
  ctx.lineTo(8, 0.5);
  ctx.moveTo(4, 2);
  ctx.lineTo(8, 3);
  ctx.stroke();

  ctx.restore();
}

// 🐶 Cute Country Dog (כלבלב נאמן ומכשכש בזנב)
function drawCozyDog(ctx, walkCycle, state, time, isSunset, isNight) {
  const legSwing = Math.sin(walkCycle) * 3.5;
  const tailWag = Math.sin(time * 12) * 4; // Fast happy wag

  // Tail wagging happily
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.lineTo(-14, -10 + tailWag);
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(-6 - legSwing, 6);
  ctx.moveTo(6, 0);
  ctx.lineTo(6 + legSwing, 6);
  ctx.stroke();

  // Body (Warm Golden/Caramel Fur)
  const bodyGrad = ctx.createLinearGradient(-10, -10, 8, 2);
  bodyGrad.addColorStop(0, '#d97706');
  bodyGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -4, 9.5, 6.5, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy Chest
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(4, -3, 4, 4.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Collar with tiny bell
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(4, -7);
  ctx.lineTo(6, -2);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(6.5, -3.5, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.save();
  ctx.translate(7, -8);

  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Floppy Dog Ear
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(-2, -1, 2.5, 4.5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle (חוטם)
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(3, 1, 3, 2.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Black Nose
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.arc(4.8, 0.5, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(1.5, -1.2, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(1.8, -1.5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 🐑 Fluffy Peaceful Sheep (כבשה צמרירית)
function drawCozySheep(ctx, walkCycle, state, time, isSunset, isNight) {
  const legSwing = Math.sin(walkCycle) * 3;
  const chewOffset = Math.sin(time * 4) * 0.5;

  // Dark Little Legs
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, 1);
  ctx.lineTo(-7 - legSwing, 6);
  ctx.moveTo(5, 1);
  ctx.lineTo(5 + legSwing, 6);
  ctx.stroke();

  // Cloud-like Wool Body
  const woolGrad = ctx.createLinearGradient(-12, -12, 10, 4);
  woolGrad.addColorStop(0, '#ffffff');
  woolGrad.addColorStop(0.8, '#f1f5f9');
  woolGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = woolGrad;

  // Clustered circles for fluffy wool
  const puffs = [
    [-6, -4, 6], [-2, -7, 6.5], [4, -5, 6],
    [-7, 0, 5], [0, -1, 6], [6, 0, 5.5],
    [-1, -4, 7]
  ];
  puffs.forEach(([px, py, pr]) => {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  });

  // Dark Cozy Face
  ctx.save();
  ctx.translate(8, -5 + chewOffset);

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(0, 0, 4.5, 3.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Drooping Ear
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(-2, 1, 1.8, 3.2, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Wool cap on head
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(1.5, -0.8, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(1.8, -0.8, 0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 🦆 Cute Pond Duck (ברווז פלגי מים)
function drawCozyDuck(ctx, walkCycle, state, time, isSunset, isNight) {
  const isSwimming = state === 'swimming';
  const legSwing = isSwimming ? 0 : Math.sin(walkCycle) * 3;
  const bobbing = Math.sin(time * 4) * 1;

  if (!isSwimming) {
    // Webbed Orange Feet
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-3, 1);
    ctx.lineTo(-3 - legSwing, 5);
    ctx.lineTo(-5 - legSwing, 5);
    ctx.moveTo(3, 1);
    ctx.lineTo(3 + legSwing, 5);
    ctx.lineTo(1 + legSwing, 5);
    ctx.stroke();
  } else {
    // Water ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 3, 12, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = '#fef08a'; // Sweet yellow duck or mallard
  ctx.beginPath();
  ctx.ellipse(0, -3 + bobbing, 8.5, 5.8, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.ellipse(-1, -3 + bobbing, 4.5, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.save();
  ctx.translate(5, -7 + bobbing);

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Orange Duck Bill (מקור ברווז רחב)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(4.5, 1, 3.5, 1.6, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(1.5, -1, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(1.8, -1.3, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 🐰 Gentle Field Rabbit (ארנב שדה סקרן)
function drawCozyRabbit(ctx, walkCycle, state, time, isSunset, isNight) {
  const noseTwitch = Math.sin(time * 8) * 0.4;

  // Fluffy round tail
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-8, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Body (Soft Taupe / Cream Fur)
  const bodyGrad = ctx.createLinearGradient(-8, -10, 6, 2);
  bodyGrad.addColorStop(0, '#e2e8f0');
  bodyGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(-1, -3, 8, 6, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.save();
  ctx.translate(5, -6);

  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Tall Ears
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(-2, -7.5, 1.8, 5.5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Inner Pink Ear
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.ellipse(-2, -7.5, 0.9, 4, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Second Ear behind
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(0.5, -7, 1.5, 4.8, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#be185d'; // Gentle ruby eye
  ctx.beginPath();
  ctx.arc(1.8, -0.8, 1, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(3.8, 1 + noseTwitch, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Floating Mind Map Badge for Animals
function drawAnimalNameTag(ctx, x, y, name, completed, isHovered) {
  ctx.save();
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(name).width;
  const badgeW = textWidth + (completed ? 28 : 18);
  const badgeH = 18;
  const badgeX = x - badgeW / 2;
  const badgeY = y - badgeH;

  // Soft glow on hover
  if (isHovered) {
    ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
    ctx.shadowBlur = 8;
  }

  // Glass pill background
  ctx.fillStyle = completed ? 'rgba(22, 101, 52, 0.92)' : 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = completed ? '#4ade80' : 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 9);
  ctx.fill();
  ctx.stroke();

  // Text & Check icon
  ctx.fillStyle = completed ? '#86efac' : '#f8fafc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textOffsetX = completed ? 5 : 0;
  ctx.fillText(name, x + textOffsetX, badgeY + badgeH / 2);

  if (completed) {
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(badgeX + 9, badgeY + badgeH / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('✓', badgeX + 9, badgeY + badgeH / 2);
  }

  // Pointer triangle
  ctx.fillStyle = completed ? 'rgba(22, 101, 52, 0.92)' : 'rgba(15, 23, 42, 0.88)';
  ctx.beginPath();
  ctx.moveTo(x - 3, badgeY + badgeH);
  ctx.lineTo(x + 3, badgeY + badgeH);
  ctx.lineTo(x, badgeY + badgeH + 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
