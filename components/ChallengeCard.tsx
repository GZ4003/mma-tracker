import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Challenge } from "@/types";

interface ChallengeCardProps {
  challenge: Challenge & { progress: number };
  onComplete: (id: string) => void;
}

export default function ChallengeCard({
  challenge,
  onComplete,
}: ChallengeCardProps) {
  const progressPercent = Math.min(
    (challenge.progress / challenge.target) * 100,
    100
  );
  const isComplete = challenge.progress >= challenge.target || challenge.completed;

  return (
    <Card className="bg-mma-surface border-mma-muted/30 p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display text-lg text-mma-yellow tracking-wide">
              {challenge.title}
            </h3>
            <p className="text-xs text-mma-muted mt-1">
              {challenge.description}
            </p>
          </div>
          {isComplete && (
            <div className="flex items-center gap-2 ml-2">
              <Check size={20} className="text-mma-yellow" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-mma-muted">
            <span>{challenge.progress}</span>
            <span>/ {challenge.target} {challenge.unit}</span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2 bg-mma-bg"
          />
        </div>

        {/* Action Button */}
        {!challenge.completed && !isComplete && (
          <Button
            onClick={() => onComplete(challenge.id)}
            className="w-full bg-mma-orange/20 text-mma-orange hover:bg-mma-orange/30 border border-mma-orange/30 text-sm"
            variant="default"
          >
            Marcar Completado
          </Button>
        )}

        {isComplete && (
          <div className="text-center">
            <p className="text-xs text-mma-yellow font-medium">✓ COMPLETADO</p>
            {challenge.completedAt && (
              <p className="text-xs text-mma-muted mt-1">
                {new Date(challenge.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
