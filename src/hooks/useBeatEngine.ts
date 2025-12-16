import { useEffect, useRef, useState, useCallback } from "react";
import { SoundSynth } from "../logic/SoundSynth";
import { SessionData, BeatPhase } from "../types/beat";

export const useBeatEngine = (session: SessionData) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentBar, setCurrentBar] = useState(1);
  
  // 追加: 画面表示用の拍数 (1, 2, 3, 4)
  const [displayBeat, setDisplayBeat] = useState(1);

  const audioContextRef = useRef<SoundSynth | null>(null);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef(0.0);
  const currentBeatRef = useRef(1);
  const phaseBarCountRef = useRef(0);
  const phaseIndexRef = useRef(0);

  const lookahead = 25.0;
  const scheduleAheadTime = 0.1;

  useEffect(() => {
    audioContextRef.current = new SoundSynth();
    return () => stop();
  }, []);

  const scheduleNote = (beatNumber: number, time: number) => {
    if (phaseIndexRef.current >= session.phases.length) return;
    const currentPhase = session.phases[phaseIndexRef.current];

    currentPhase.beats.forEach((targetBeat: number) => {
      const integerPart = Math.floor(targetBeat);
      const decimalPart = targetBeat - integerPart;

      if (integerPart === beatNumber) {
        const secondsPerBeat = 60.0 / session.bpm;
        const noteTime = time + (secondsPerBeat * decimalPart);
        
        if (decimalPart === 0) {
           const isAccent = beatNumber === 1;
           audioContextRef.current?.playClick(noteTime, isAccent);
        } else {
           audioContextRef.current?.playFumikiri(noteTime);
        }
      }
    });
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / session.bpm;
    nextNoteTimeRef.current += secondsPerBeat;

    currentBeatRef.current++;

    if (currentBeatRef.current > 4) {
      currentBeatRef.current = 1;
      phaseBarCountRef.current++;
      setCurrentBar((prev) => prev + 1);

      const currentPhase: BeatPhase = session.phases[phaseIndexRef.current];
      if (currentPhase && phaseBarCountRef.current >= currentPhase.duration) {
        phaseIndexRef.current++;
        phaseBarCountRef.current = 0;
        
        if (phaseIndexRef.current >= session.phases.length) {
            stop();
            return;
        }
        setCurrentPhaseIndex(phaseIndexRef.current);
      }
    }
    
    // UI更新（少し早めに更新されるが、ガイドとしては許容範囲）
    setDisplayBeat(currentBeatRef.current);
  };

  const scheduler = useCallback(() => {
    const ctxTime = audioContextRef.current?.getCurrentTime() || 0;
    while (nextNoteTimeRef.current < ctxTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
      nextNote();
    }
  }, [session]);

  const start = () => {
    if (isPlaying) return;
    audioContextRef.current?.init();

    setIsPlaying(true);
    setCurrentPhaseIndex(0);
    setCurrentBar(1);
    currentBeatRef.current = 1;
    // 初期表示もセット
    setDisplayBeat(1);
    
    phaseBarCountRef.current = 0;
    phaseIndexRef.current = 0;
    
    const ctxTime = audioContextRef.current?.getCurrentTime() || 0;
    nextNoteTimeRef.current = ctxTime + 0.1;

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
    displayBeat, // 追加: これをUIに渡す
    start,
    stop
  };
};