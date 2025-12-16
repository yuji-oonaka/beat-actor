import { PhaseType } from "../types/beat";

export const getPhaseMessage = (phaseIndex: number, type: PhaseType): string[] => {
  switch (phaseIndex) {
    case 0: // Trap
      return [
        "この音に、リズムを合わせてください", 
        "カン……　カン……"
      ];
    case 1: // Mesh (NEW)
      return [
        "隙間を埋めていきます", 
        "チ・カ・チ・カ……"
      ];
    case 2: // Guide
      return [
        "「チ」が表、「カ」が裏です", 
        "足音（表）を感じて……",
        "（チ）カン　（チ）カン"
      ];
    case 3: // Core
      return [
        "ガイドを消します", 
        "「チ」を心の中で鳴らし続けて",
        "自分の中に「1」を作ってください"
      ];
    case 4: // Return
      return [
        "拍は、あなたのものです"
      ];
    default:
      return [""];
  }
};