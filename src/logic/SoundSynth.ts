/**
 * ブラウザ標準のWeb Audio APIを使用した純粋な発音クラス。
 * 外部ファイル読み込みによる遅延を完全に排除します。
 */
export class SoundSynth {
  private ctx: AudioContext | null = null;

  constructor() {
    // ユーザーアクションがあるまでAudioContextは作らない（ブラウザ制限対策）
  }

  // AudioContextの初期化（再生ボタンを押した瞬間に呼ぶ）
  public init() {
    if (!this.ctx) {
      // Safari対応も含めた定型文
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    // サスペンド状態なら再開させる
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * 音を鳴らす
   * @param time 発音予定時刻 (AudioContext.currentTime)
   * @param isAccent 強拍（1拍目）かどうか
   */
  public playTone(time: number, isAccent: boolean) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // 音色の設定（サイン波だと優しすぎるため、矩形波で少し刺激を入れる）
    osc.type = "square";

    // ピッチと音量の設定
    // 思想: "装飾のない、事実としての音"
    if (isAccent) {
      osc.frequency.value = 880; // A5 (高め)
      gain.gain.setValueAtTime(0.1, time);
    } else {
      osc.frequency.value = 440; // A4 (標準)
      gain.gain.setValueAtTime(0.05, time); // 弱拍は少し音量を下げる
    }

    // エンベロープ（音の減衰）: カッ！と鳴ってすぐ消える
    osc.start(time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.stop(time + 0.05);
  }

  // 現在のオーディオ時間を取得（スケジューリング用）
  public getCurrentTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }
}