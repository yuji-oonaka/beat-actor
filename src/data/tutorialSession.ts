import { SessionData } from "../types/beat";

export const tutorialSession: SessionData = {
  bpm: 100, // 初心者でも乗りやすいテンポ
  timeSignature: "4/4",
  phases: [
    // Phase 1: 導入（全部鳴る）
    // 「今から正解の音は消えます」
    { 
      type: "intro", 
      beats: [1, 2, 3, 4], 
      duration: 4 
    },
    // Phase 2: 減衰（1が消える）
    // 「それでも拍を演じ続けられますか？」
    { 
      type: "decay", 
      beats: [2, 3, 4], 
      duration: 4 
    },
    // Phase 3: さらに減衰（1と3が消える = 裏拍のみ）
    { 
      type: "decay", 
      beats: [2, 4], 
      duration: 4 
    },
    // Phase 4: 無音（完全な静寂）
    // 「拍は、あなたの中にありました」
    { 
      type: "silent", 
      beats: [], 
      duration: 8 
    },
    // Phase 5: 復帰（答え合わせではなく、現実に戻る）
    { 
      type: "return", 
      beats: [1, 2, 3, 4], 
      duration: 4 
    },
  ],
};