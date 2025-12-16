"use client";

import { useBeatEngine } from "@/hooks/useBeatEngine";
import { tutorialSession } from "@/data/tutorialSession";
import { Stage } from "@/components/Stage";

export default function Home() {
  const session = tutorialSession;

  // displayBeat を受け取る
  const { isPlaying, currentPhaseIndex, displayBeat, start, stop } =
    useBeatEngine(session);

  const currentPhaseType = session.phases[currentPhaseIndex]?.type || "intro";

  return (
    <main className="w-full h-screen bg-black text-white overflow-hidden">
      <Stage
        isPlaying={isPlaying}
        phaseIndex={currentPhaseIndex}
        phaseType={currentPhaseType}
        displayBeat={displayBeat} // Stageに渡す
        onStart={start}
        onStop={stop}
      />
    </main>
  );
}
