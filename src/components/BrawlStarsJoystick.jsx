import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * BrawlStarsJoystick:
 * Ultra-responsive, fluid floating virtual thumbstick like Brawl Stars for mobile / touch devices.
 * Directly translates 360-degree thumb drags into intuitive screen-space movement.
 * Completely hidden on desktop / keyboard devices!
 */
export function BrawlStarsJoystick({ onMove }) {
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef(null);
  const touchIdRef = useRef(null);
  const maxRadius = 42; // Maximum drag radius in px

  const handleTouchStart = useCallback((e) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setActive(true);

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(dist, maxRadius);
      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;

      setKnobPos({ x: kx, y: ky });
      if (onMove) {
        onMove(kx / maxRadius, ky / maxRadius);
      }
    }
  }, [onMove]);

  const handleTouchMove = useCallback((e) => {
    if (touchIdRef.current === null || !baseRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = touch.clientX - centerX;
        const dy = touch.clientY - centerY;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const clampedDist = Math.min(dist, maxRadius);
        const kx = Math.cos(angle) * clampedDist;
        const ky = Math.sin(angle) * clampedDist;

        setKnobPos({ x: kx, y: ky });
        if (onMove) {
          onMove(kx / maxRadius, ky / maxRadius);
        }
        break;
      }
    }
  }, [onMove]);

  const handleTouchEnd = useCallback((e) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        if (onMove) {
          onMove(0, 0);
        }
        break;
      }
    }
  }, [onMove]);

  useEffect(() => {
    const cancel = () => {
      touchIdRef.current = null;
      setActive(false);
      setKnobPos({ x: 0, y: 0 });
      if (onMove) onMove(0, 0);
    };
    window.addEventListener('touchend', cancel, { passive: true });
    window.addEventListener('touchcancel', cancel, { passive: true });
    return () => {
      window.removeEventListener('touchend', cancel);
      window.removeEventListener('touchcancel', cancel);
    };
  }, [onMove]);

  return (
    <div 
      className={`brawl-joystick-container ${active ? 'is-active' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div ref={baseRef} className="brawl-joystick-base">
        {/* Subtle crosshairs / radial guides */}
        <div className="brawl-joystick-ring" />
        <div className="brawl-joystick-crosshair h" />
        <div className="brawl-joystick-crosshair v" />

        {/* Floating thumb knob */}
        <div 
          className="brawl-joystick-knob"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
        >
          <div className="brawl-knob-core" />
          <div className="brawl-knob-spark" />
        </div>
      </div>
    </div>
  );
}
