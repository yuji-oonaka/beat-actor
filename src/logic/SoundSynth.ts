export class SoundSynth {
  private ctx: AudioContext | null = null;

  constructor() {}

  public init() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getCurrentTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // 踏切音：裏拍（音量を下げ、少しこもらせる）
  public playFumikiri(time: number) {
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.type = "square";
    osc2.type = "square";

    osc1.frequency.value = 700;
    osc2.frequency.value = 1000;

    // 音量: 0.1 -> 0.03 (かなり控えめに)
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.5);
    osc2.stop(time + 0.5);
  }

  // クリック音：表拍（音量を上げ、鋭くする）
  public playClick(time: number, isAccent: boolean) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // 波形を「sawtooth（ノコギリ波）」にして鋭さを出す
    osc.type = "sawtooth";
    
    // ピッチを高くして突き刺す音に
    osc.frequency.value = isAccent ? 1500 : 1000;

    // 音量: 0.05 -> 0.2 (大幅アップ)
    // 鋭く立ち上がり、すぐに切れる（歯切れよく）
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.start(time);
    osc.stop(time + 0.03);
  }
}