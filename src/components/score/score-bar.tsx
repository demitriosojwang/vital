'use client';

import { cn } from '@/lib/utils';
import { getScoreColor, getScoreLabel } from './score-ring';

interface ScoreBarProps {
  score: number;
  label: string;
  className?: string;
  showValue?: boolean;
}

export function ScoreBar({ score, label, className, showValue = true }: ScoreBarProps) {
  const color = getScoreColor(score);
  const label_text = getScoreLabel(score);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        {showValue && (
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ color }}>{score}/100</span>
            <span className="text-xs text-muted-foreground">{label_text}</span>
          </div>
        )}
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
