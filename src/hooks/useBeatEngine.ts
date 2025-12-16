import { useEffect, useRef, useState, useCallback } from "react";
import { SoundSynth } from "../logic/SoundSynth";
import { SessionData, BeatPhase } from "../types/beat";

export const useBeatEngine = (session: SessionData) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentBar, setCurrentBar] = useState(1); // 画面表示用（現在何小節目か）
  const [message, setMessage] = useState(""); // ユーザーへの問いかけ

  // 音楽的変数の管理（再レンダリングでリセットされないようRefで保持）
  const audioContextRef = useRef<SoundSynth | null>(null);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);
  
  // スケジューリング用変数
  const nextNoteTimeRef = useRef(0.0); // 次に音が鳴る絶対時間
  const currentBeatRef = useRef(1); // 現在の拍数 (1, 2, 3, 4)
  const phaseBarCountRef = useRef(0); // 現在のフェーズ内で何小節経過したか
  const phaseIndexRef = useRef(0); // Refでもフェーズ管理（スケジューラー内部用）

  // 設定定数
  const lookahead = 25.0; // 25msごとにチェック
  const scheduleAheadTime = 0.1; // 0.1秒先まで予約する

  // 初期化
  useEffect(() => {
    audioContextRef.current = new SoundSynth();
    return () => stop(); // アンマウント時に停止
  }, []);

  // 次の音符の時間と状態計算
  const nextNote = () => {
    const secondsPerBeat = 60.0 / session.bpm;
    nextNoteTimeRef.current += secondsPerBeat;

    // 拍を進める
    currentBeatRef.current++;

    // 4/4拍子固定（企画書仕様）
    if (currentBeatRef.current > 4) {
      currentBeatRef.current = 1;
      phaseBarCountRef.current++;
      setCurrentBar((prev) => prev + 1);

      // フェーズ更新チェック
      const currentPhase: BeatPhase = session.phases[phaseIndexRef.current];
      if (currentPhase && phaseBarCountRef.current >= currentPhase.duration) {
        // 次のフェーズへ
        phaseIndexRef.current++;
        phaseBarCountRef.current = 0;
        
        // セッション終了判定
        if (phaseIndexRef.current >= session.phases.length) {
            stop();
            return;
        }
        setCurrentPhaseIndex(phaseIndexRef.current);
      }
    }
  };

  // 音の予約とUIへの反映指示
  const scheduleNote = (beatNumber: number, time: number) => {
    // 終了していたら予約しない
    if (phaseIndexRef.current >= session.phases.length) return;

    const currentPhase = session.phases[phaseIndexRef.current];

    // 音を鳴らすかどうかの判定（ここがBeat Actorの核心）
    // フェーズ設定に含まれている拍のみ発音する
    if (currentPhase.beats.includes(beatNumber)) {
      const isAccent = beatNumber === 1;
      audioContextRef.current?.playTone(time, isAccent);
    }
    
    // ※ ここで視覚的な「光」などは実装しない。「音」と「時間」だけの管理。
  };

  // スケジューラー（心臓部）
  const scheduler = useCallback(() => {
    // AudioContextの時間に合わせて予約を入れる
    const ctxTime = audioContextRef.current?.getCurrentTime() || 0;
    
    // 指定範囲(0.1秒先)に入る音符を全て予約
    while (nextNoteTimeRef.current < ctxTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
      nextNote();
    }
  }, [session]);

  const start = () => {
    if (isPlaying) return;

    // AudioContextの再開（ブラウザ制限解除）
    audioContextRef.current?.init();

    // 状態リセット
    setIsPlaying(true);
    setCurrentPhaseIndex(0);
    setCurrentBar(1);
    currentBeatRef.current = 1;
    phaseBarCountRef.current = 0;
    phaseIndexRef.current = 0;
    
    // 開始時間を現在時刻の少し先にセット
    const ctxTime = audioContextRef.current?.getCurrentTime() || 0;
    nextNoteTimeRef.current = ctxTime + 0.1;

    // タイマー始動
    timerIDRef.current = setInterval(scheduler, lookahead);
  };

  const stop = () => {
    setIsPlaying(false);
    if (timerIDRef.current) {
      clearInterval(timerIDRef.current);
      timerIDRef.current = null;
    }
  };

  return {
    isPlaying,
    currentPhaseIndex,
    currentBar,
    start,
    stop
  };
};