// Storybook parchment signs for the village canvas (visual only).
// These badges live on the canvas, so the CSS-style "transition / float" behaviour is reproduced here:
//  - stepBadgeReveal(): per-badge eased 0..1 reveal driven by real time (0.3s, cubic-bezier(0.4,0,0.2,1) feel)
//  - drawParchmentBadge(): draws the sign with opacity/scale from that reveal plus a gentle 2px float.

const REVEAL_SECONDS = 0.3;
const reveals = new Map();

// Smoothstep: close to cubic-bezier(0.4, 0, 0.2, 1) (Material "standard" easing)
function easeStandard(t) {
  return t * t * (3 - 2 * t);
}

/** Advance (and return) the eased reveal value for a badge. `target` is true when it should be visible. */
export function stepBadgeReveal(key, target, now = performance.now()) {
  let s = reveals.get(key);
  if (!s) {
    s = { t: 0, last: now, seen: now };
    reveals.set(key, s);
  }
  const dt = Math.min(0.1, Math.max(0, (now - s.last) / 1000));
  s.last = now;
  s.seen = now;
  s.t = Math.min(1, Math.max(0, s.t + (target ? dt : -dt) / REVEAL_SECONDS));

  // Occasional cleanup of badges that are no longer rendered (removed objects / animals)
  if (reveals.size > 200) {
    for (const [k, v] of reveals) {
      if (now - v.seen > 5000) reveals.delete(k);
    }
  }
  return easeStandard(s.t);
}

function keyPhase(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return (Math.abs(h) % 628) / 100;
}

/**
 * Draw a parchment sign whose pointer tip sits at (x, tipY).
 * @param {object} o { x, tipY, text, cared, reveal(0..1), key }
 */
export function drawParchmentBadge(ctx, { x, tipY, text, cared = false, reveal = 1, key = '' }) {
  if (reveal <= 0.01) return;

  const now = Date.now();
  const floatY = Math.sin(now * 0.002 + keyPhase(key)) * 1; // +-1px = 2px total travel
  const scale = 0.9 + 0.1 * reveal;

  ctx.save();
  ctx.globalAlpha *= reveal;
  ctx.translate(x, tipY + floatY);
  ctx.scale(scale, scale); // pops from the pointer tip
  ctx.translate(-x, -tipY);

  ctx.font = '600 11px Rubik, system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(text).width;
  const w = textWidth + (cared ? 30 : 20);
  const h = 20;
  const bx = x - w / 2;
  const by = tipY - 4 - h;
  const r = 7;

  // Soft warm drop shadow (0 4px 12px) + tight contact shadow
  ctx.shadowColor = 'rgba(74, 59, 50, 0.22)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#F4EFE6';
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, r);
  ctx.fill();
  ctx.shadowColor = 'rgba(74, 59, 50, 0.2)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 1;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Kraft-paper sheen
  const sheen = ctx.createLinearGradient(0, by, 0, by + h);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  sheen.addColorStop(1, 'rgba(196, 164, 105, 0.12)');
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, r);
  ctx.fill();

  // Outer thin earth border + inner gold stroke
  ctx.lineWidth = 1;
  ctx.strokeStyle = cared ? 'rgba(106, 148, 52, 0.7)' : 'rgba(139, 111, 71, 0.55)';
  ctx.beginPath();
  ctx.roundRect(bx + 0.5, by + 0.5, w - 1, h - 1, r);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(201, 168, 106, 0.5)';
  ctx.beginPath();
  ctx.roundRect(bx + 2.5, by + 2.5, w - 5, h - 5, r - 2);
  ctx.stroke();

  // Pointer tab
  ctx.fillStyle = '#F4EFE6';
  ctx.strokeStyle = cared ? 'rgba(106, 148, 52, 0.7)' : 'rgba(139, 111, 71, 0.55)';
  ctx.beginPath();
  ctx.moveTo(x - 4, by + h - 0.5);
  ctx.lineTo(x, tipY);
  ctx.lineTo(x + 4, by + h - 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 4, by + h);
  ctx.lineTo(x, tipY);
  ctx.lineTo(x + 4, by + h);
  ctx.stroke();

  // Text (dark umber)
  ctx.fillStyle = '#4A3B32';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + (cared ? 6 : 0), by + h / 2 + 0.5);

  if (cared) {
    ctx.fillStyle = '#6a9434';
    ctx.beginPath();
    ctx.arc(bx + 10, by + h / 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F4EFE6';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('✓', bx + 10, by + h / 2 + 0.5);
  }

  ctx.restore();
}
