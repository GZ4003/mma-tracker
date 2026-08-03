"use client";

import { useMmaMode } from "@/hooks/useMmaMode";
import PageHeader from "@/components/PageHeader";
import ChallengeCard from "@/components/ChallengeCard";

export default function Challenges() {
  const mma = useMmaMode();

  if (!mma.isLoaded || !mma.isSetupComplete) {
    return null;
  }

  const challenges = mma.getCurrentChallenges();
  const monthName = new Date().toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Desafíos"
        subtitle={`Completa los desafíos de ${monthName} para mantenerte motivado`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.length === 0 ? (
          <p className="text-mma-muted col-span-full">
            Sin desafíos disponibles. ¡Vuelve más tarde!
          </p>
        ) : (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onComplete={mma.completeChallenge}
            />
          ))
        )}
      </div>
    </div>
  );
}
