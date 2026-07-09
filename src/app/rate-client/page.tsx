'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  MessageSquare, CreditCard, FileText, MapPin, Scale, Wrench,
  Send, CheckCircle2, Info,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Rating dimensions                                                  */
/* ------------------------------------------------------------------ */

const DIMENSIONS = [
  {
    key: 'paymentRating',
    label: 'Payment Timeliness',
    weight: '30%',
    icon: CreditCard,
    low: 'Payments consistently 45+ days late',
    mid: 'Payments within 30-45 days, occasional delays',
    high: 'Payments within 14 days, very reliable',
  },
  {
    key: 'scopeCreepRating',
    label: 'Scope Creep Control',
    weight: '20%',
    icon: FileText,
    low: 'Constant scope additions without proper variation',
    mid: 'Some scope changes, usually formalized',
    high: 'Strict adherence to original scope, rare changes',
  },
  {
    key: 'siteAccessRating',
    label: 'Site Accessibility',
    weight: '15%',
    icon: MapPin,
    low: 'Restricted access, poor coordination, no logistics support',
    mid: 'Adequate access with some limitations',
    high: 'Excellent access, clear logistics, full coordination',
  },
  {
    key: 'disputeFairRating',
    label: 'Fairness in Dispute Resolution',
    weight: '20%',
    icon: Scale,
    low: 'Biased process, contractor always loses',
    mid: 'Generally fair but slow resolution',
    high: 'Transparent, balanced, quick resolution',
  },
  {
    key: 'variationRating',
    label: 'Variation Order Handling',
    weight: '15%',
    icon: Wrench,
    low: 'Verbal instructions, no documentation, delayed approval',
    mid: 'Variation orders processed but slow',
    high: 'Formal, timely, well-documented variation process',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Sample project data (would come from API)                          */
/* ------------------------------------------------------------------ */

const SAMPLE_PROJECTS = [
  { id: '1', title: 'Kiambu County Roads Rehabilitation' },
  { id: '2', title: 'Parklands Apartment Block (4 floors)' },
  { id: '3', title: 'Thika Road Drainage Works' },
  { id: '4', title: 'Westlands Storm Drain Rehabilitation' },
  { id: '5', title: 'Limuru Road Widening Project' },
  { id: '6', title: 'Rongai Residential Complex' },
  { id: '7', title: 'Kilimani Commercial Tower (12 floors)' },
  { id: '8', title: 'Nairobi County Health Clinic Network' },
  { id: '9', title: 'Kisumu Water Supply Extension Phase 2' },
];

const SAMPLE_CLIENTS = [
  { id: 'c1', name: 'Kiambu County Government', type: 'county' },
  { id: 'c2', name: 'Unity Homes Ltd', type: 'developer' },
  { id: 'c3', name: 'Nairobi County Government', type: 'county' },
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function RateClientPage() {
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [clientId, setClientId] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({
    paymentRating: 50,
    scopeCreepRating: 50,
    siteAccessRating: 50,
    disputeFairRating: 50,
    variationRating: 50,
  });
  const [comment, setComment] = useState('');

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // In production this would POST to /api/client-reviews
    console.log({ projectId, clientId, ratings, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold">Review Submitted</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your client review has been submitted and is pending verification.
              Once verified, it will be published on the client&apos;s profile and
              contribute to their composite score. Anonymous reviews are protected
              — your identity is never shared with the client.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => { setSubmitted(false); setComment(''); setRatings({ paymentRating: 50, scopeCreepRating: 50, siteAccessRating: 50, disputeFairRating: 50, variationRating: 50 }); }}>
                Rate Another Client
              </Button>
              <Button asChild>
                <a href="/clients">View Clients</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-white/15 text-white hover:bg-white/20 border-0 px-3 py-1 text-sm">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Contractor Feedback
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Rate a Client
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Completed a project? Rate the client on how they performed. Your review
            helps other contractors make informed decisions about who to work with.
            Reviews are anonymous — the client will see your company name but your
            individual identity is protected.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project & Client selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project & Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">Select Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Choose the project you completed…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_PROJECTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select the client for this project…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_CLIENTS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rating Dimensions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Rate the Client
            </h2>
            <p className="text-sm text-muted-foreground">
              Rate each dimension from 0 (worst) to 100 (best). Your ratings will be
              weighted and contribute to the client&apos;s composite score.
            </p>

            {DIMENSIONS.map((dim) => (
              <Card key={dim.key}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0 mt-0.5">
                        <dim.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{dim.label}</h3>
                          <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                            {dim.weight}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {dim.mid}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-primary">{ratings[dim.key]}</div>
                      <div className="text-[10px] text-muted-foreground">/ 100</div>
                    </div>
                  </div>

                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[ratings[dim.key]]}
                    onValueChange={([v]) => handleRatingChange(dim.key, v)}
                    className="w-full"
                  />

                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span className="text-red-500">{dim.low}</span>
                    <span className="text-green-600">{dim.high}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overall Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Share your experience working with this client. What went well? What could improve? Be specific and factual — your review helps other contractors."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Your review will be published under your company name. Individual reviewer
                  identities are never disclosed. False or defamatory reviews may be removed.
                  All reviews contribute to the client&apos;s composite score.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild>
              <a href="/clients">Cancel</a>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!projectId || !clientId}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}