export class SoundSynth {
  private ctx: AudioContext | null = null;

  constructor() {}

  public init() {
    if (!this.ctx) {
      // Safari (iPhone) 用のベンダープレフィックス対応
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }

    // iOS対策: コンテキストがサスペンド（一時停止）していたら再開させる
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // ★ここが最重要：iOSのオーディオロックを解除する儀式
    this.unlockAudio();
  }

  // 無音を一瞬だけ再生して、iOSに「ユーザーの意志で再生した」と認識させる
  private unlockAudio() {
    if (!this.ctx) return;
    
    // 1サンプルだけの空のバッファを作成
    const buffer = this.ctx.createBuffer(1, 1, 22050);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    
    source.connect(this.ctx.destination);
    
    // 即座に再生
    if (source.start) {
      source.start(0);
    } else if ((source as any).noteOn) {
      // 古いiOS対応
      (source as any).noteOn(0);
    }
  }

  public getCurrentTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // 踏切音
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

    // スマホのスピーカーでも聞こえるよう音量を確保 (0.1)
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.5);
    osc2.stop(time + 0.5);
  }

  // クリック音
  public playClick(time: number, isAccent: boolean) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = "sawtooth";
    osc.frequency.value = isAccent ? 1500 : 1000;

    // クリック音もしっかり聞こえる音量に (0.3)
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.start(time);
    osc.stop(time + 0.03);
  }
}