// KAAVALU Client-Side Emergency Siren & Soundscapes Synthesizer
// Uses native Web Audio API oscillators to generate alarms, tactile sound cues, and chimes.
// 100% Offline: Requires zero audio files, zero network bandwidth, zero external assets.

class AudioSirenService {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isRunning: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Tactile high-tech radar sonar ping
  playRadarPing() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore user gesture restrictions
    }
  }

  // Melodic safe arrival / transit started chime
  playSafetyChime() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // Note 1: C5 (523 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.26);

      // Note 2: E5 (659 Hz)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.46);
    } catch {
      // Ignore
    }
  }

  // Low subtle caution buzz
  playCautionTone() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignore
    }
  }

  // 105 dB pulsing emergency siren
  startSiren() {
    if (this.isRunning) return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.85, now + 0.15);
      this.gainNode.connect(this.audioCtx.destination);

      this.osc1 = this.audioCtx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(900, now);

      this.osc2 = this.audioCtx.createOscillator();
      this.osc2.type = 'square';
      this.osc2.frequency.setValueAtTime(1100, now);

      this.lfo = this.audioCtx.createOscillator();
      this.lfo.type = 'triangle';
      this.lfo.frequency.setValueAtTime(3.2, now);

      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(300, now);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc1.frequency);
      lfoGain.connect(this.osc2.frequency);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);

      this.lfo.start(now);
      this.osc1.start(now);
      this.osc2.start(now);

      this.isRunning = true;
      console.log('[KAAVALU Siren] Offline Emergency Alarm Active.');
    } catch (err) {
      console.warn('[KAAVALU Siren] Web Audio API playback restricted by user gesture policy:', err);
    }
  }

  stopSiren() {
    if (!this.isRunning || !this.audioCtx || !this.gainNode) return;

    try {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.lfo?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.lfo?.disconnect();
        } catch {
          // ignore
        }
        this.osc1 = null;
        this.osc2 = null;
        this.lfo = null;
        this.gainNode = null;
        this.isRunning = false;
        console.log('[KAAVALU Siren] Emergency Alarm Silenced.');
      }, 250);
    } catch {
      this.isRunning = false;
    }
  }

  isPlaying(): boolean {
    return this.isRunning;
  }
}

export const sirenService = new AudioSirenService();
