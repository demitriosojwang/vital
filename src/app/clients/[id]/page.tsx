'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScoreRing, getScoreClass } from '@/components/score/score-ring';
import { ScoreBar } from '@/components/score/score-bar';
import {
  ArrowLeft, Building2, MapPin, Star, Clock, CreditCard, User,
  TrendingDown, AlertTriangle, MessageSquare, Eye, Landmark,
  HandshakeIcon, FileText, Briefcase, Scale, Wrench,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Project {
  id: string; title: string; projectType: string; county: string;
  contractValue: number; startDate: string | null; endDate: string | null;
  actualEnd: string | null; status: string; description: string | null;
  contractor: { companyName: string; compositeScore: number; isVerified: boolean };
}

interface ClientReview {
  id: string; projectId: string; reviewerName: string;
  paymentRating: number; scopeCreepRating: number; siteAccessRating: number;
  disputeFairRating: number; variationRating: number;
  overallComment: string | null; status: string; clientReply: string | null;
  createdAt: string; project: { title: string } | null;
}

interface Client {
  id: string; companyName: string | null; clientType: string;
  compositeScore: number; paymentScore: number; scopeCreepScore: number;
  siteAccessScore: number; disputeFairScore: number; variationScore: number;
  totalProjectValue: number; isBlacklisted: boolean; blacklistReason: string | null;
  user: { name: string; email: string; phone: string | null };
  projects: Project[];
  clientReviews: ClientReview[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CLIENT_TYPE_LABELS: Record<string, string> = {
  county: 'County Government',
  developer: 'Property Developer',
  ngo: 'NGO / Development Partner',
  parastatal: 'Parastatal / State Corp',
  individual: 'Individual',
  corporate: 'Corporate',
};

function formatKES(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount}`;
}

function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { cls: string; label: string }> = {
    completed: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Completed' },
    active: { cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Active' },
    disputed: { cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Disputed' },
    published: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Published' },
    pending: { cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
  };
  const v = variants[status] || { cls: 'bg-gray-100 text-gray-800', label: status };
  return <Badge className={v.cls} variant="secondary">{v.label}</Badge>;
}

function getTypeBadgeStyle(type: string): string {
  switch (type) {
    case 'county':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'developer':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'ngo':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

/* ------------------------------------------------------------------ */
/*  Client Score Dimensions                                            */
/* ------------------------------------------------------------------ */

const CLIENT_DIMENSIONS = [
  { key: 'paymentScore', label: 'Payment Timeliness', weight: '30%', icon: CreditCard, desc: 'How consistently the client pays on time' },
  { key: 'scopeCreepScore', label: 'Scope Creep Control', weight: '20%', icon: FileText, desc: 'How often the client adds scope without proper variation' },
  { key: 'disputeFairScore', label: 'Dispute Fairness', weight: '20%', icon: Scale, desc: 'Fairness and balance in resolving project disputes' },
  { key: 'siteAccessScore', label: 'Site Accessibility', weight: '15%', icon: MapPin, desc: 'Quality of site access, logistics support, and coordination' },
  { key: 'variationScore', label: 'Variation Order Handling', weight: '15%', icon: Wrench, desc: 'How properly variation orders are documented and processed' },
] as const;

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ClientDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setClient(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4"><Skeleton className="h-64 w-full" /><Skeleton className="h-80 w-full" /></div>
          <div className="lg:col-span-2 space-y-4"><Skeleton className="h-96 w-full" /><Skeleton className="h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
        <Link href="/clients"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Clients</Button></Link>
      </div>
    );
  }

  const avgReviewCount = client.clientReviews.length;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Back */}
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 shrink-0">
          {client.clientType === 'county' ? (
            <Landmark className="h-8 w-8 text-purple-700 dark:text-purple-400" />
          ) : client.clientType === 'developer' ? (
            <Building2 className="h-8 w-8 text-blue-700 dark:text-blue-400" />
          ) : (
            <HandshakeIcon className="h-8 w-8 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {client.companyName || client.user.name}
            </h1>
            <Badge variant="outline" className={getTypeBadgeStyle(client.clientType)}>
              {CLIENT_TYPE_LABELS[client.clientType] || client.clientType}
            </Badge>
            {client.isBlacklisted && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> Flagged
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{client.user.name}</span>
            <span>{client.user.email}</span>
          </div>
          {client.blacklistReason && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                <strong>Flag reason:</strong> {client.blacklistReason}
              </p>
            </div>
          )}

          {/* Low score warning */}
          {client.compositeScore < 50 && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 max-w-2xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                <strong>Low client score:</strong> This client has a composite score below 50.
                Contractors should consider requiring advance payments, shorter payment cycles, or
                contract clauses that protect against delayed payments and excessive scope changes.
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Scores */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4" /> Client Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <ScoreRing score={client.compositeScore} size={140} strokeWidth={10} />
              <p className="text-xs text-muted-foreground mt-3 text-center max-w-[200px]">
                Based on {avgReviewCount} contractor review{avgReviewCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CLIENT_DIMENSIONS.map((dim) => (
                <ScoreBar
                  key={dim.key}
                  score={client[dim.key]}
                  label={`${dim.label} (${dim.weight})`}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Project Value</span>
                <span className="font-semibold">{formatKES(client.totalProjectValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-semibold">{client.projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contractor Reviews</span>
                <span className="font-semibold">{avgReviewCount}</span>
              </div>
            </CardContent>
          </Card>

          <Link href="/rate-client">
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Rate This Client
            </Button>
          </Link>
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">
                Contractor Reviews ({client.clientReviews.length})
              </TabsTrigger>
              <TabsTrigger value="projects">
                Projects ({client.projects.length})
              </TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              {client.clientReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No contractor reviews yet. Be the first to rate this client.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Methodology note */}
                  <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <strong>Scoring methodology:</strong> Contractors rate clients after project completion.
                    Payment Timeliness (30%), Scope Creep Control (20%), Dispute Fairness (20%),
                    Site Accessibility (15%), Variation Order Handling (15%).
                  </div>

                  {client.clientReviews.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                              <Building2 className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{r.reviewerName}</div>
                              <div className="text-xs text-muted-foreground">
                                {r.project?.title} &middot; {formatDate(r.createdAt)}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {[
                            { label: 'Payment', val: r.paymentRating, icon: CreditCard },
                            { label: 'Scope', val: r.scopeCreepRating, icon: FileText },
                            { label: 'Site Access', val: r.siteAccessRating, icon: MapPin },
                            { label: 'Dispute Fair', val: r.disputeFairRating, icon: Scale },
                            { label: 'Variation', val: r.variationRating, icon: Wrench },
                          ].map((d) => (
                            <div key={d.label} className="text-center p-2 rounded-lg bg-muted/50">
                              <d.icon className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                              <div className={`text-lg font-bold ${getScoreClass(d.val)}`}>{d.val}</div>
                              <div className="text-[10px] text-muted-foreground">{d.label}</div>
                            </div>
                          ))}
                        </div>

                        {r.overallComment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{r.overallComment}</p>
                        )}

                        {r.clientReply && (
                          <div className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border-l-2 border-blue-400">
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Client Reply</div>
                            <p className="text-sm text-muted-foreground">{r.clientReply}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardContent className="p-0">
                  {client.projects.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No projects on record.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead className="hidden md:table-cell">Contractor</TableHead>
                          <TableHead className="hidden sm:table-cell">Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden lg:table-cell">End Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {client.projects.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{p.title}</div>
                              {p.county && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="size-3" />{p.county}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm flex items-center gap-1.5">
                                {p.contractor.companyName}
                                {p.contractor.isVerified && (
                                  <span className="size-3.5 text-green-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Score: {p.contractor.compositeScore}/100
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm font-medium">
                              {formatKES(p.contractValue)}
                            </TableCell>
                            <TableCell><StatusBadge status={p.status} /></TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {formatDate(p.actualEnd || p.endDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                Total Project Value: <span className="font-semibold text-foreground">{formatKES(client.totalProjectValue)}</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}