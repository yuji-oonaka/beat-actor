import { SessionData } from "../types/beat";

export const tutorialSession: SessionData = {
  bpm: 90, 
  timeSignature: "4/4",
  phases: [
    // Phase 1: 錯覚 (Trap)
    // 踏切音(裏)だけ鳴らす。ユーザーはこれを表だと思い込む。
    { 
      type: "intro", 
      beats: [1.5, 2.5, 3.5, 4.5], // 全て裏拍
      duration: 8 
    },
    
    // Phase 2: 発見 (Guide)
    // ガイド(表)を足す。「カッ(1)…カン(&)…」
    // ここでズレを認識させる。
    { 
      type: "decay", 
      beats: [1, 2, 3, 4, 1.5, 2.5, 3.5, 4.5], 
      duration: 8 
    },

    // Phase 3: 自立 (Core)
    // ガイドを消す。再び踏切音だけ残る。
    // 無音の「1」を感じて「(ウン)カン」と取れるか。
    { 
      type: "silent", 
      beats: [1.5, 2.5, 3.5, 4.5], 
      duration: 16 
    },
    
    // Phase 4: 確認 (Return)
    // 答え合わせ
    { 
      type: "return", 
      beats: [1, 2, 3, 4, 1.5, 2.5, 3.5, 4.5], 
      duration: 4 
    },
  ],
};