import { PhaseType } from "../types/beat";

export const getPhaseMessage = (phaseIndex: number, type: PhaseType): string[] => {
  switch (phaseIndex) {
    case 0: // Trap
      return [
        "この音に、リズムを合わせてください", 
        "カン……　カン……"
      ];
    case 1: // Guide
      return [
        "では、足音（ガイド）を足します", 
        "実は、カンは「裏」でした",
        "（ウン）カン　（ウン）カン"
      ];
    case 2: // Core
      return [
        "ガイドを消します", 
        "「裏」のまま維持できますか？",
        "自分の中に「1」を作ってください"
      ];
    case 3: // Return
      return [
        "拍は、あなたのものです"
      ];
    default:
      return [""];
  }
};