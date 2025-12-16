export type TimeSignature = "4/4"; // 将来的な拡張（3/4, 6/8）を見越して型定義

export type PhaseType = "intro" | "decay" | "silent" | "return";

export interface BeatPhase {
  type: PhaseType;
  beats: number[]; // 鳴らす拍の番号 (例: [1, 2, 3, 4] や [2, 3, 4])
  duration: number; // 小節数
}

export interface SessionData {
  bpm: number;
  timeSignature: TimeSignature;
  phases: BeatPhase[];
}

export type PlayState = "idle" | "playing" | "finished";