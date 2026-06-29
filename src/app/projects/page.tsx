'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScoreBar } from '@/components/score/score-bar';
import { getScoreClass } from '@/components/score/score-ring';
import {
  FileText, Plus, MapPin, Calendar, Clock, CheckCircle2, Circle,
  Building2, Star, CreditCard, ChevronRight, TrendingUp,
} from 'lucide-react';

interface Project {
  id: string; title: string; projectType: string; county: string;
  contractValue: number; startDate: string | null; endDate: string | null;
  actualEnd: string | null; status: string; description: string | null;
  contractor: { companyName: string; id: string; compositeScore: number; ncaNumber: string | null };
  client: { companyName: string | null } | null;
}

interface Milestone {
  id: string; title: string; percentage: number; dueDate: string | null;
  completedDate: string | null; status: string;
}

function formatKES(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount}`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    completed: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Completed' },
    active: { cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Active' },
    disputed: { cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Disputed' },
  };
  const v = map[status] || { cls: 'bg-gray-100 text-gray-800', label: status };
  return <Badge className={v.cls} variant="secondary">{v.label}</Badge>;
}

function ProjectTypeLabel(type: string) {
  const map: Record<string, string> = {
    roads: 'Roads', building: 'Building', drainage: 'Drainage', water: 'Water Supply', electrical: 'Electrical',
  };
  return map[type] || type;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    onTimeRating: 70, qualityRating: 70, subPayRating: 70, responsiveRating: 70,
    reviewerName: '', overallComment: '',
  });

  useEffect(() => {
    fetch('/api/contractors')
      .then((r) => r.json())
      .then((contractors) => {
        const allProjects: Project[] = [];
        contractors.forEach((c: { projects: Project[]; companyName: string; id: string; compositeScore: number; ncaNumber: string | null }) => {
          c.projects.forEach((p) => {
            allProjects.push({ ...p, contractor: { companyName: c.companyName, id: c.id, compositeScore: c.compositeScore, ncaNumber: c.ncaNumber } });
          });
        });
        setProjects(allProjects.sort((a: Project, b: Project) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openProject = async (p: Project) => {
    setSelectedProject(p);
    try {
      const res = await fetch(`/api/milestones?projectId=${p.id}`);
      const data = await res.json();
      setMilestones(data);
    } catch { setMilestones([]); }
  };

  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  const submitReview = async () => {
    if (!selectedProject || !reviewForm.reviewerName) return;
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          contractorId: selectedProject.contractor.id,
          reviewerName: reviewForm.reviewerName,
          ...reviewForm,
        }),
      });
      setReviewDialog(false);
    } catch { /* handle error */ }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" /> Project Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track project milestones, submit reviews, and monitor progress.</p>
        </div>
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogTrigger asChild>
            <Button disabled={!selectedProject}>
              <Star className="h-4 w-4 mr-2" /> Submit Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Rate Contractor</DialogTitle>
              <DialogDescription>Rate {selectedProject?.contractor.companyName} for project: {selectedProject?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input placeholder="e.g. Jane Wanjiru" value={reviewForm.reviewerName} onChange={(e) => setReviewForm((p) => ({ ...p, reviewerName: e.target.value }))} />
              </div>
              {[{ key: 'onTimeRating', label: 'On-Time Delivery' }, { key: 'qualityRating', label: 'Quality / Workmanship' }, { key: 'subPayRating', label: 'Sub-Contractor Payment' }, { key: 'responsiveRating', label: 'Responsiveness' }].map((dim) => (
                <div key={dim.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{dim.label}</Label>
                    <span className={`font-bold ${getScoreClass(reviewForm[dim.key as keyof typeof reviewForm] as number)}`}>{reviewForm[dim.key as keyof typeof reviewForm]}</span>
                  </div>
                  <Slider
                    min={0} max={100} step={5}
                    value={[reviewForm[dim.key as keyof typeof reviewForm] as number]}
                    onValueChange={([v]) => setReviewForm((p) => ({ ...p, [dim.key]: v }))}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label>Overall Comment</Label>
                <Textarea
                  placeholder="Share your experience working with this contractor..."
                  rows={3}
                  value={reviewForm.overallComment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, overallComment: e.target.value }))}
                />
              </div>
              <Button className="w-full" onClick={submitReview} disabled={!reviewForm.reviewerName}>Submit Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">All Projects</h2>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : (
            projects.map((p) => (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedProject?.id === p.id ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => openProject(p)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {p.contractor.companyName}
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{formatKES(p.contractValue)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.county}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Detail + Milestones */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Project Header */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">{selectedProject.title}</h2>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <Link href={`/contractors/${selectedProject.contractor.id}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <Building2 className="h-3.5 w-3.5" /> {selectedProject.contractor.companyName}
                        </Link>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedProject.county}</span>
                        <span>&middot;</span>
                        <span>{ProjectTypeLabel(selectedProject.projectType)}</span>
                      </div>
                    </div>
                    <StatusBadge status={selectedProject.status} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Contract Value</span><div className="font-semibold">{formatKES(selectedProject.contractValue)}</div></div>
                    <div><span className="text-muted-foreground">Start Date</span><div className="font-medium">{selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) : '-'}</div></div>
                    <div><span className="text-muted-foreground">End Date</span><div className="font-medium">{selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) : '-'}</div></div>
                    <div><span className="text-muted-foreground">Client</span><div className="font-medium">{selectedProject.client?.companyName || '-'}</div></div>
                  </div>
                  {selectedProject.description && <p className="text-sm text-muted-foreground leading-relaxed">{selectedProject.description}</p>}
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Milestone Tracking</span>
                    <span className="text-sm font-normal text-muted-foreground">{progressPercent}% complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progressPercent} className="h-2" />
                  {milestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No milestones defined for this project.</p>
                  ) : (
                    <div className="space-y-3">
                      {milestones.map((m, i) => (
                        <div key={m.id} className="flex items-start gap-3">
                          <div className="flex flex-col items-center mt-0.5">
                            {m.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : m.status === 'in_progress' ? (
                              <div className="h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                              </div>
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            {i < milestones.length - 1 && (
                              <div className={`w-0.5 h-8 ${m.status === 'completed' ? 'bg-green-300' : 'bg-border'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${m.status === 'pending' ? 'text-muted-foreground' : ''}`}>{m.title}</h4>
                              <Badge variant="secondary" className="text-[11px]">{m.percentage}%</Badge>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                              {m.dueDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(m.dueDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</span>}
                              {m.completedDate && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-3 w-3" />Done {new Date(m.completedDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</span>}
                              {m.status === 'in_progress' && <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[11px]">In Progress</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* M-Pesa Escrow */}
              <Card className="bg-[#4CAF50]/5 border-[#4CAF50]/20">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#4CAF50]/20">
                      <CreditCard className="h-5 w-5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">M-Pesa Escrow Payment</h3>
                      <p className="text-xs text-muted-foreground">Secure milestone-based payments via M-Pesa escrow</p>
                    </div>
                  </div>
                  <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white" size="sm">Pay via M-Pesa</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-16 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium mb-1">Select a Project</p>
                <p className="text-sm">Click on a project from the list to view details, milestones, and submit reviews.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}