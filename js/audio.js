/**
 * Web Audio API Synthesizer for Cyber Defender Academy
 * Generates Click, Success, Warning, Alert, and Ambient Cyber Drone without external files.
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.bgmEnabled = false;
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.12, delay = 0) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  click() {
    this.playTone(680, 'triangle', 0.06, 0.08);
  }

  success() {
    this.playTone(523.25, 'sine', 0.12, 0.12, 0);
    this.playTone(659.25, 'sine', 0.12, 0.12, 0.09);
    this.playTone(783.99, 'triangle', 0.22, 0.14, 0.18);
  }

  warning() {
    this.playTone(340, 'sawtooth', 0.16, 0.09, 0);
    this.playTone(280, 'sawtooth', 0.2, 0.09, 0.14);
  }

  alert() {
    this.playTone(880, 'square', 0.1, 0.09, 0);
    this.playTone(620, 'square', 0.1, 0.09, 0.12);
    this.playTone(880, 'square', 0.14, 0.09, 0.24);
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    if (this.sfxEnabled) this.click();
    return this.sfxEnabled;
  }

  toggleBGM() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.init();
      const notes = [110, 130.81, 146.83, 164.81, 130.81, 98];
      let step = 0;
      this.bgmInterval = setInterval(() => {
        if (!this.bgmEnabled || !this.ctx) return;
        const freq = notes[step % notes.length];
        this.playAmbientPulse(freq);
        step++;
      }, 1400);
    } else if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    return this.bgmEnabled;
  }

  playAmbientPulse(freq) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.35);
  }
}
