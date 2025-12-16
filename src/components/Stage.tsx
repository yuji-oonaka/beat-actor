import { PhaseType } from "@/types/beat";
import { getPhaseMessage } from "@/logic/ScriptManager";

interface StageProps {
  isPlaying: boolean;
  phaseIndex: number;
  phaseType: PhaseType;
  displayBeat: number;
  onStart: () => void;
  onStop: () => void;
}

export const Stage = ({
  isPlaying,
  phaseIndex,
  phaseType,
  displayBeat,
  onStart,
  onStop,
}: StageProps) => {
  const messages = getPhaseMessage(phaseIndex, phaseType);

  // ガイド数字を出すのは Phase 2 (Guide) と Phase 4 (Return) のみ
  // Phase 1 (Mesh) は音だけで馴染ませる
  const showGuide = isPlaying && (phaseIndex === 2 || phaseIndex === 4);

  // ... (以下、変更なし) ...

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-widest text-white/90">
            BEAT ACTOR
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">
            CLICK NOTATION IS DEAD
          </p>
        </div>
        <button
          onClick={onStart}
          className="px-12 py-4 border border-white/20 hover:border-white/80 hover:bg-white/5 transition-all duration-500 tracking-[0.2em] text-sm uppercase"
        >
          Session Start
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* ビジュアルガイド */}
      <div className="h-40 flex items-center justify-center">
        {showGuide ? (
          <div
            key={displayBeat}
            className="text-9xl font-bold text-white/90 animate-fade-in"
          >
            {displayBeat}
          </div>
        ) : (
          <div className="w-1 h-1 bg-white/20 rounded-full" />
        )}
      </div>

      {/* メッセージ表示エリア */}
      <div className="h-32 flex flex-col items-center justify-center space-y-4 text-center mt-12">
        {messages.map((msg, i) => (
          <p
            key={`${phaseIndex}-${i}`}
            className="text-lg font-light tracking-widest text-white/80 animate-pulse-slow"
          >
            {msg}
          </p>
        ))}
      </div>

      <button
        onClick={onStop}
        className="absolute bottom-8 text-xs text-gray-700 hover:text-gray-500 transition-colors uppercase tracking-widest"
      >
        Abort
      </button>
    </div>
  );
};
