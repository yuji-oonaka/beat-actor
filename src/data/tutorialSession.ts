import { SessionData } from "../types/beat";

export const tutorialSession: SessionData = {
  bpm: 90,
  timeSignature: "4/4",
  phases: [
    // Phase 0: 錯覚 (Trap)
    // 踏切音(裏)だけ。ユーザーは「カン(1)…カン(2)…」と錯覚する。
    { 
      type: "intro", 
      beats: [1.5, 2.5, 3.5, 4.5], 
      duration: 8 
    },
    
    // Phase 1: 噛み合わせ (Mesh) - NEW!!
    // ここで「切り替え」ではなく「埋める」。
    // 踏切(裏)を残したまま、ガイド(表)を足す。
    // 「チ・カ・チ・カ・チ・カ・チ・カ」と聞こえる。
    { 
      type: "intro", // intro扱いにして画面は静かに
      beats: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5], // 表も裏も全部鳴らす
      duration: 4 // 4小節かけて、ゆっくり馴染ませる
    },

    // Phase 2: 誘導 (Guide)
    // ここで初めて視覚ガイド(数字)を出す。
    // 音は変わらないが、ユーザーの意識を「表」へ固定させる。
    { 
      type: "decay", 
      beats: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5], // 音はMeshと同じ
      duration: 8 
    },

    // Phase 3: 自立 (Core)
    // 満を持してガイド(表)を消す。
    // 残るのは踏切(裏)だけだが、もう脳内に「チ(1)」が残響しているはず。
    { 
      type: "silent", 
      beats: [1.5, 2.5, 3.5, 4.5], 
      duration: 16 
    },
    
    // Phase 4: 確認 (Return)
    { 
      type: "return", 
      beats: [1, 2, 3, 4, 1.5, 2.5, 3.5, 4.5], 
      duration: 4 
    },
  ],
};