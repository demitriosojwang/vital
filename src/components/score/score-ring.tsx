'use client';

import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'oklch(0.45 0.12 145)';
  if (score >= 60) return 'oklch(0.55 0.15 85)';
  if (score >= 40) return 'oklch(0.65 0.15 70)';
  if (score >= 20) return 'oklch(0.55 0.15 25)';
  return 'oklch(0.577 0.245 27.325)';
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-fair';
  if (score >= 20) return 'score-poor';
  return 'score-bad';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Critical';
}

export { getScoreColor, getScoreClass, getScoreLabel };

export function ScoreRing({ score, size = 120, strokeWidth = 8, showLabel = true, className }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.93 0.005 155)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold', getScoreClass(score))} style={{ fontSize: size * 0.28 }}>
          {score}
        </span>
        {showLabel && (
          <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}
