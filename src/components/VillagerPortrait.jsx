import React, { useEffect, useRef } from 'react';
import { drawCompleteVillager } from '../utils/villagerRenderer';

export const VillagerPortrait = ({
  outfit = 'autumn_sweater',
  inWater = false,
  activity = null,
  look = {},
  scale = 4.5,
  width = 180,
  height = 200,
  showPedestal = true,
  interactive = false
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let lastRenderTime = 0;
    const render = (time = performance.now()) => {
      animId = requestAnimationFrame(render);
      if (time - lastRenderTime < 32) return; // Clean 30 FPS cap for side portrait
      lastRenderTime = time;

      ctx.clearRect(0, 0, width, height);

      // Ambient pedestal glow
      if (showPedestal) {
        const pedGlow = ctx.createRadialGradient(width / 2, height - 32, 5, width / 2, height - 32, width * 0.42);
        pedGlow.addColorStop(0, 'rgba(52, 211, 153, 0.28)');
        pedGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
        pedGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pedGlow;
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 32, width * 0.42, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wooden / stone stepping disc
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 32, 42, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Draw enlarged animated villager
      drawCompleteVillager(ctx, {
        cx: width / 2,
        cy: height - 32,
        scale,
        outfit,
        inWater,
        activity,
        activityTimer: 150, // balanced for activity pose
        facingLeft: false,
        isWalking: false,
        walkCycle: 0,
        hopY: 0,
        isNight: false,
        isSunset: false,
        look,
        timestamp: time
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [outfit, inWater, activity, look, scale, width, height, showPedestal]);

  return (
    <div className="villager-portrait-wrap">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="villager-portrait-canvas"
      />
    </div>
  );
};
