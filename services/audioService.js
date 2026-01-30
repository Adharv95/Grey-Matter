class AudioService {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(state) {
    this.enabled = state;
  }

  createOscillator(freq, type = 'sine', duration = 0.1) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.createOscillator(800, 'square', 0.05);
  }

  playAlert() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.5);
  }

  playSuccess() {
    if (!this.ctx || !this.enabled) return;
    this.createOscillator(600, 'sine', 0.1);
    setTimeout(() => this.createOscillator(900, 'sine', 0.2), 100);
  }

  playWhir() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(400, now + 1.5);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 1.5);
  }
}

export const audioService = new AudioService();