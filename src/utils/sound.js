// Audio Synthesizer for warm, calming, cozy, wholesome sounds
class CalmingSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Warm wooden marimba / chime when planting something
  playPlant() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Soft warm pentatonic chime note
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12); // A4

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Crisp, tactile tilling sound with rising chime when cultivating land
  playCultivate() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // 1. Earthy soil digging strike (filtered triangle)
    const digOsc = this.ctx.createOscillator();
    const digGain = this.ctx.createGain();
    digOsc.type = 'triangle';
    digOsc.frequency.setValueAtTime(260, now);
    digOsc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    digGain.gain.setValueAtTime(0.22, now);
    digGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    digOsc.connect(digGain);
    digGain.connect(this.ctx.destination);
    digOsc.start(now);
    digOsc.stop(now + 0.18);

    // 2. Bright sprout chime
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      try {
        const t2 = this.ctx.currentTime;
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(587.33, t2); // D5
        bellOsc.frequency.exponentialRampToValueAtTime(880, t2 + 0.14); // A5
        bellGain.gain.setValueAtTime(0.14, t2);
        bellGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);

        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx.destination);
        bellOsc.start(t2);
        bellOsc.stop(t2 + 0.35);
      } catch {}
    }, 60);
  }

  // Grand ascending fanfare chime when expanding the entire village territory
  playTerritoryExpand() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]; // G4, C5, E5, G5, C6, E6
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + i * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.75);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.8);
    });
  }

  // Crisp, rewarding harvest chime when collecting produce from an institution
  playHarvest() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [440, 554.37, 659.25, 880]; // A Major sparkle
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + idx * 0.055;

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, time + 0.12);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }

  // Grand hammer strike and celebratory resonance when upgrading a village institution
  playBuildingUpgrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Hammer / Anvil Clink
    const hammerOsc = this.ctx.createOscillator();
    const hammerGain = this.ctx.createGain();
    hammerOsc.type = 'triangle';
    hammerOsc.frequency.setValueAtTime(800, now);
    hammerOsc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
    hammerGain.gain.setValueAtTime(0.24, now);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    hammerOsc.connect(hammerGain);
    hammerGain.connect(this.ctx.destination);
    hammerOsc.start(now);
    hammerOsc.stop(now + 0.16);

    // 2. Inspiring ascending progression
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + 0.08 + i * 0.085;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.75);
    });
  }

  // Gentle acoustic bell / harp when completing a personal growth reflection
  playNourish() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major warmth
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.65);
    });
  }

  // Soft raindrop / tap on gentle click
  playTap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Gentle water splash sound when entering water
  playSplash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Gentle secondary droplet
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      try {
        const t2 = this.ctx.currentTime;
        const o2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        o2.type = 'triangle';
        o2.frequency.setValueAtTime(650, t2);
        o2.frequency.exponentialRampToValueAtTime(880, t2 + 0.08);
        g2.gain.setValueAtTime(0.08, t2);
        g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.12);
        o2.connect(g2);
        g2.connect(this.ctx.destination);
        o2.start(t2);
        o2.stop(t2 + 0.12);
      } catch {
        // audio quirks
      }
    }, 90);
  }

  // Crisp, satisfying fruit bite / crunch sound
  playChomp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Crisp triangle bite chirp
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.08);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // Cheerful harmonic resonance
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      try {
        const t2 = this.ctx.currentTime;
        const o2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(659.25, t2); // E5
        o2.frequency.exponentialRampToValueAtTime(880, t2 + 0.1); // A5
        g2.gain.setValueAtTime(0.12, t2);
        g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.22);
        o2.connect(g2);
        g2.connect(this.ctx.destination);
        o2.start(t2);
        o2.stop(t2 + 0.22);
      } catch {}
    }, 70);
  }

  // Gentle cricket chirps & birdsong ambience
  startAmbience(timeOfDay = 'day') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ambientRunning) {
      this.stopAmbience();
    }
    this.ambientRunning = true;

    this.ambientInterval = setInterval(() => {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const isNightOrSunset = timeOfDay === 'night' || timeOfDay === 'sunset';

      if (isNightOrSunset || Math.random() < 0.6) {
        // High-pitched gentle cricket chirp pairs
        const freq = 4500 + Math.random() * 400;
        [0, 0.045, 0.09].forEach(offset => {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(isNightOrSunset ? 0.012 : 0.007, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.04);
          } catch {}
        });
      } else {
        // Daytime soft bird chirp
        const baseFreq = 2200 + Math.random() * 300;
        [0, 0.07].forEach((offset, idx) => {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const f = baseFreq + idx * 160;
            osc.frequency.setValueAtTime(f, now + offset);
            osc.frequency.exponentialRampToValueAtTime(f + 220, now + offset + 0.04);
            gain.gain.setValueAtTime(0.012, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.055);
          } catch {}
        });
      }
    }, 2000);
  }

  // Chicken cluck ("בוק בוק!")
  playCluck() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.08].forEach((offset, i) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const f = i === 0 ? 320 : 270;
        osc.frequency.setValueAtTime(f, now + offset);
        osc.frequency.exponentialRampToValueAtTime(f * 0.75, now + offset + 0.07);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.07);
      } catch {}
    });
  }

  // Sparkling egg harvest pop
  playEggCollect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } catch {}
    });
  }

  // Tactile grain scatter onto straw
  playScatterSeeds() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      try {
        const t = now + i * 0.035 + Math.random() * 0.015;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 600, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      } catch {}
    }
  }

  // Loving chicken petting chime
  playChickenPet() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 659.25, 880].forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      } catch {}
    });
  }

  // Tiny sweet baby chick chirp
  playBabyChirp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(2600, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  startEveningAmbience() {
    this.startAmbience('sunset');
  }

  stopAmbience() {
    this.ambientRunning = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  stopEveningAmbience() {
    this.stopAmbience();
  }
}

export const sounds = new CalmingSoundEngine();

