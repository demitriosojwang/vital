'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScoreBar } from '@/components/score/score-bar';
import { ScoreRing, getScoreColor, getScoreLabel } from '@/components/score/score-ring';
import {
  Clock, CheckCircle2, Users, MessageSquare, AlertTriangle,
  TrendingUp, ArrowRight, Info, BarChart3, Shield,
} from 'lucide-react';
import Link from 'next/link';

const dimensions = [
  {
    key: 'onTime',
    label: 'On-Time Delivery',
    weight: 25,
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    desc: 'Measures whether the contractor completed projects within the agreed contract period. Scores are derived from the difference between contracted end date and actual completion date. A contractor who consistently delivers on or before the deadline scores 80-100. Delays of 1-4 weeks reduce the score to 60-79. Longer delays, pattern of extensions, or abandoned projects push scores below 40.',
    example: 'Juma Mbeki Construction completed the Kiambu Roads Rehabilitation 3 days early (score: 75), but the Parklands Apartment was delayed by 6 weeks (score: 55). The weighted average gives an on-time score of 68.',
  },
  {
    key: 'quality',
    label: 'Quality / Workmanship',
    weight: 25,
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    desc: 'Evaluates the physical quality of completed work including structural integrity, finishings, materials used, and compliance with specifications. Quality is rated by the client upon project completion and verified through GPS photo evidence at milestone sign-off points.',
    example: 'Meridian Builders received quality ratings of 95 for the Nairobi Health Clinic Network (modular clinics) and 90 for the Kilimani Commercial Tower structure. Their quality score of 92 reflects consistently high-grade outputs.',
  },
  {
    key: 'subpay',
    label: 'Sub-Contractor Payment',
    weight: 20,
    icon: Users,
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    desc: 'Tracks whether the contractor pays sub-contractors, suppliers, and casual laborers on time. This dimension addresses one of Kenya\'s biggest construction industry problems — delayed or withheld payments to smaller players. Reports can be submitted by sub-contractors directly or flagged during dispute resolution.',
    example: 'Redstone Contractors scored 35/100 on sub-contractor payment after multiple reports of unpaid suppliers and laborers on the Rongai Residential Complex project. This significantly impacts their composite score.',
  },
  {
    key: 'responsive',
    label: 'Responsiveness',
    weight: 15,
    icon: MessageSquare,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    desc: 'Measures communication quality, response times to queries, willingness to address issues on site, and overall professionalism. Clients rate this based on their experience during the project lifecycle — from initial engagement through to handover.',
    example: 'Savanna Civil Works scored 85/100 for responsiveness based on consistent communication, rapid site issue resolution, and proactive progress updates to Nairobi County on the Westlands Drainage project.',
  },
  {
    key: 'dispute',
    label: 'Dispute History',
    weight: 15,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
    desc: 'Counts and weighs disputes filed against the contractor. Each dispute reduces the score proportionally — resolved disputes have a smaller penalty than open/under-review ones. Severity also matters: a specification non-compliance dispute weighs less than fraud or abandonment. Contractors with zero disputes score 90-100.',
    example: 'Juma Mbeki Construction has one open dispute (drainage specification) giving a dispute score of 58. Meridian Builders has no disputes, scoring 82 on this dimension. Blacklisted contractors receive a score of 0.',
  },
];

export default function ScoringPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> How Scoring Works
        </h1>
        <p className="text-muted-foreground mt-1">
          Every contractor on E Contractor receives a composite score from 0-100, calculated from verified project reviews across five weighted dimensions.
        </p>
      </div>

      {/* Formula Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">The Composite Score Formula</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
            <Badge variant="secondary" className="text-xs">On-Time (25%)</Badge>
            <span className="text-muted-foreground">+</span>
            <Badge variant="secondary" className="text-xs">Quality (25%)</Badge>
            <span className="text-muted-foreground">+</span>
            <Badge variant="secondary" className="text-xs">Sub-Pay (20%)</Badge>
            <span className="text-muted-foreground">+</span>
            <Badge variant="secondary" className="text-xs">Responsive (15%)</Badge>
            <span className="text-muted-foreground">+</span>
            <Badge variant="secondary" className="text-xs">Disputes (15%)</Badge>
            <span className="text-muted-foreground">=</span>
            <Badge className="text-xs">Composite Score (0-100)</Badge>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground flex gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Scores are recalculated every 24 hours as new reviews are published. Only <strong>published</strong> reviews (approved by our moderation team) contribute to scores.</span>
          </div>
        </CardContent>
      </Card>

      {/* Score Interpretation */}
      <Card>
        <CardHeader><CardTitle className="text-base">Score Interpretation</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[{ range: '80-100', label: 'Excellent', color: 'bg-emerald-500' }, { range: '60-79', label: 'Good', color: 'bg-yellow-500' }, { range: '40-59', label: 'Fair', color: 'bg-orange-500' }, { range: '20-39', label: 'Poor', color: 'bg-red-400' }, { range: '0-19', label: 'Critical', color: 'bg-red-700' }].map((s) => (
              <div key={s.range} className="text-center p-3 rounded-lg border">
                <div className={`h-3 rounded-full ${s.color} mb-2`} />
                <div className="text-sm font-bold">{s.range}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dimensions Detail */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Five Dimensions</h2>
        {dimensions.map((dim, i) => (
          <Card key={dim.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dim.bg} shrink-0`}>
                  <dim.icon className={`h-5 w-5 ${dim.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{dim.label}</CardTitle>
                  <p className="text-xs text-muted-foreground">Weight: {dim.weight}% of composite score</p>
                </div>
                <Badge variant="outline">{dim.weight}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{dim.desc}</p>
              <Separator />
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Example Calculation
                </div>
                <p className="text-sm text-muted-foreground">{dim.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trajectory Scoring */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Trajectory Scoring</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Beyond the raw composite score, E Contractor also tracks <strong>score trajectory</strong> — whether a contractor is improving or declining over time. This is calculated by comparing the average score of the most recent 3 projects against the average of the previous 3 projects.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Improving', desc: 'Latest 3 avg > previous 3 avg by 5+ points', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
              { label: 'Stable', desc: 'Difference is within +/- 5 points', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
              { label: 'Declining', desc: 'Latest 3 avg < previous 3 avg by 5+ points', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
            ].map((t) => (
              <div key={t.label} className={`p-3 rounded-lg ${t.bg}`}>
                <div className={`font-semibold text-sm ${t.color}`}>{t.label}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Link href="/contractors"><Button className="gap-2">Browse Scored Contractors <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </div>
  );
}