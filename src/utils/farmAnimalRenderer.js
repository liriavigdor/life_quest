// High-Fidelity 2.5D Vector Animal Renderer for the Grand Farmstead
// Eliminates all emoji. Pure canvas rendering with shading, outlines & contact shadows.

export function drawVectorAnimal(ctx, animalId, config) {
  const { x, y, facingLeft = false, happiness = 100, animTime = 0 } = config;

  ctx.save();
  ctx.translate(x, y);
  if (facingLeft) {
    ctx.scale(-1, 1);
  }

  // 1. Soft Oval Contact Shadow (Dark warm ground contact)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 18, 32, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 5, 2, 0.32)';
  ctx.fill();
  ctx.restore();

  switch (animalId) {
    case 'cow':
      drawCow(ctx, animTime);
      break;
    case 'sheep':
      drawSheep(ctx, animTime);
      break;
    case 'pig':
      drawPig(ctx, animTime);
      break;
    case 'horse':
      drawHorse(ctx, animTime);
      break;
    case 'poultry':
      drawPoultry(ctx, animTime);
      break;
    case 'duck':
      drawDuck(ctx, animTime);
      break;
    default:
      break;
  }

  ctx.restore();
}

// ---------------- 1. COW (Bessie) ----------------
function drawCow(ctx, t) {
  const chew = Math.sin(t * 3.5) * 1.5;
  const tailSway = Math.sin(t * 2.2) * 4;

  // Legs (Dark Grey Hooves)
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.2;
  // Back Legs
  ctx.fillRect(-18, 2, 8, 16);
  ctx.fillRect(10, 2, 8, 16);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-18, 14, 8, 4);
  ctx.fillRect(10, 14, 8, 4);

  // Body (White with black patches)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-26, -16, 52, 28, 8);
  ctx.fill();
  ctx.stroke();

  // Black Holstein patches
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(-10, -6, 12, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(12, 0, 9, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Udder
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(-8, 12, 5, 0, Math.PI);
  ctx.fill();

  // Tail
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-26, -6);
  ctx.quadraticCurveTo(-34 + tailSway, 0, -32 + tailSway, 8);
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-32 + tailSway, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  // Head & Neck
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(16, -24 + chew * 0.3, 20, 22, 6);
  ctx.fill();
  ctx.stroke();

  // Horns
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(22, -24);
  ctx.lineTo(20, -30);
  ctx.lineTo(24, -26);
  ctx.moveTo(30, -24);
  ctx.lineTo(32, -30);
  ctx.lineTo(28, -26);
  ctx.fill();
  ctx.stroke();

  // Pink Muzzle & Chewing Jaw
  ctx.fillStyle = '#fbcfe8';
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(26 + chew, -12, 14, 12, 4);
  ctx.fill();
  ctx.stroke();
  // Nostrils
  ctx.fillStyle = '#831843';
  ctx.fillRect(32 + chew, -8, 2, 2.5);
  ctx.fillRect(36 + chew, -8, 2, 2.5);

  // Eye
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(26, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.arc(25.5, -18.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Brass Bell on Red Collar
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(16, -6, 5, 12);
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#ca8a04';
  ctx.beginPath();
  ctx.arc(18, 8, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

// ---------------- 2. SHEEP (Wooly) ----------------
function drawSheep(ctx, t) {
  const hop = Math.abs(Math.sin(t * 2)) * 2;

  // Dark Legs
  ctx.fillStyle = '#332924';
  ctx.fillRect(-14, 4 - hop, 6, 14);
  ctx.fillRect(8, 4 - hop, 6, 14);

  // Fluffy Wool Cloud Body (Layered cream circles)
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;

  const woolCircles = [
    [-18, -4, 14], [-4, -8, 16], [10, -6, 15],
    [-12, 4, 15], [4, 6, 16], [16, 2, 13],
    [-4, 0, 17]
  ];
  woolCircles.forEach(([wx, wy, wr]) => {
    ctx.beginPath();
    ctx.arc(wx, wy - hop, wr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Dark Chocolate Head
  ctx.fillStyle = '#332924';
  ctx.beginPath();
  ctx.roundRect(14, -14 - hop, 18, 18, 5);
  ctx.fill();

  // White Wool Toupee Cap
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(22, -16 - hop, 7, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(24, -10 - hop, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.arc(24.5, -10 - hop, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Droopy Ear
  ctx.fillStyle = '#261e1a';
  ctx.beginPath();
  ctx.ellipse(14, -8 - hop, 6, 3, 0.4, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------- 3. PIG (Truffles) ----------------
function drawPig(ctx, t) {
  const waddle = Math.sin(t * 3) * 1.5;

  // Pink Legs
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-14, 6, 7, 12);
  ctx.fillRect(8, 6, 7, 12);
  ctx.fillStyle = '#9d174d';
  ctx.fillRect(-14, 15, 7, 3);
  ctx.fillRect(8, 15, 7, 3);

  // Rounded Pink Body
  ctx.fillStyle = '#f9a8d4';
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-24, -14 + waddle * 0.2, 46, 26, 12);
  ctx.fill();
  ctx.stroke();

  // Mud splatters
  ctx.fillStyle = '#3b2012';
  ctx.beginPath();
  ctx.ellipse(-16, 2, 5, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(2, 6, 6, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Corkscrew Tail
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-26, -4, 4, 0, Math.PI * 1.8);
  ctx.stroke();

  // Head & Snout
  ctx.fillStyle = '#f9a8d4';
  ctx.beginPath();
  ctx.roundRect(12, -18 + waddle * 0.3, 18, 18, 6);
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.roundRect(24, -10 + waddle * 0.3, 10, 8, 3);
  ctx.fill();
  ctx.fillStyle = '#831843';
  ctx.fillRect(27, -7 + waddle * 0.3, 1.8, 2.5);
  ctx.fillRect(30, -7 + waddle * 0.3, 1.8, 2.5);

  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(20, -12 + waddle * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Floppy Ears
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(14, -18 + waddle * 0.3);
  ctx.lineTo(10, -10);
  ctx.lineTo(18, -14);
  ctx.fill();
}

// ---------------- 4. HORSE (Thunder) ----------------
function drawHorse(ctx, t) {
  const breath = Math.sin(t * 1.8) * 1.2;

  // Legs (Dark Fetlocks & Hooves)
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-18, 2, 7, 18);
  ctx.fillRect(10, 2, 7, 18);
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-18, 16, 7, 4);
  ctx.fillRect(10, 16, 7, 4);

  // Chestnut Muscular Body
  ctx.fillStyle = '#c2410c';
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-26, -16 + breath * 0.2, 50, 24, 8);
  ctx.fill();
  ctx.stroke();

  // Long Flowing Dark Tail
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-26, -8);
  ctx.quadraticCurveTo(-36, 4, -32, 16);
  ctx.stroke();

  // Arched Neck & Head
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(14, -8);
  ctx.lineTo(24, -26);
  ctx.lineTo(34, -20);
  ctx.lineTo(22, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Muzzle & White Blaze
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(26, -24, 4, 8);
  ctx.fillStyle = '#292524';
  ctx.fillRect(30, -22, 6, 6);

  // Dark Mane
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(16, -12);
  ctx.lineTo(22, -26);
  ctx.lineTo(18, -20);
  ctx.lineTo(14, -14);
  ctx.fill();

  // Eye & Alert Ear
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(24, -22, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(22, -26);
  ctx.lineTo(24, -33);
  ctx.lineTo(27, -26);
  ctx.fill();
}

// ---------------- 5. POULTRY (Clucky & Chicks) ----------------
function drawPoultry(ctx, t) {
  const peck = Math.abs(Math.sin(t * 3.2)) * 4;

  // Hen Orange Legs
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, 6);
  ctx.lineTo(-4, 18);
  ctx.moveTo(6, 6);
  ctx.lineTo(6, 18);
  ctx.stroke();

  // White Body & Wings
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, -2, 16, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wing Layer
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.ellipse(-2, -2, 10, 7, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Tail Feathers Fan
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-14, -6);
  ctx.lineTo(-24, -16);
  ctx.lineTo(-12, -12);
  ctx.fill();
  ctx.stroke();

  // Head with Peck animation
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(12, -12 + peck, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Red Comb & Wattle
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(12, -19 + peck, 3, 0, Math.PI * 2);
  ctx.arc(15, -17 + peck, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, -6 + peck, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Orange Beak & Eye
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(17, -13 + peck);
  ctx.lineTo(23, -11 + peck);
  ctx.lineTo(17, -9 + peck);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(14, -14 + peck, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 2 Baby Yellow Chicks following!
  [-18, -26].forEach((cx, idx) => {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, 12 + (idx === 0 ? peck * 0.4 : 0), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cx + 3, 11 + (idx === 0 ? peck * 0.4 : 0), 2, 1.5);
  });
}

// ---------------- 6. DUCK (Ducky) ----------------
function drawDuck(ctx, t) {
  const bob = Math.sin(t * 2) * 2;

  // Water Ripple Rings radiating outward
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 8, 24 + (t % 2) * 6, 8 + (t % 2) * 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Warm Brown Body
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, bob, 18, 10, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wing Layer
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(-2, bob - 2, 11, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // White Neck Ring
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, bob - 12, 6, 3);

  // Iridescent Emerald Green Head
  ctx.fillStyle = '#047857';
  ctx.beginPath();
  ctx.arc(14, bob - 12, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Bill
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.roundRect(19, bob - 13, 9, 4, 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(15, bob - 14, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
