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
import { ScoreRing, getScoreClass, getScoreLabel } from '@/components/score/score-ring';
import { ScoreBar } from '@/components/score/score-bar';
import {
  ArrowLeft, Building2, MapPin, Shield, CheckCircle2, Star, Clock,
  FileText, AlertTriangle, CreditCard, ExternalLink, User, Mail, Phone,
  Globe, Calendar, TrendingUp, XCircle, Flag, FileCheck,
} from 'lucide-react';

interface Project {
  id: string; title: string; projectType: string; county: string;
  contractValue: number; startDate: string | null; endDate: string | null;
  actualEnd: string | null; status: string; description: string | null;
  client: { companyName: string | null; clientType: string } | null;
}

interface Review {
  id: string; projectId: string; reviewerName: string;
  onTimeRating: number; qualityRating: number; subPayRating: number;
  responsiveRating: number; overallComment: string | null;
  status: string; contractorReply: string | null;
  createdAt: string; project: { title: string } | null;
}

interface Dispute {
  id: string; title: string; description: string; status: string;
  createdAt: string; resolution: string | null;
}

interface Document {
  id: string; docType: string; docName: string; status: string;
  uploadDate: string; expiryDate: string | null;
}

interface LPO {
  id: string; lpoNumber: string; issuingOrg: string;
  scopeOfWorks: string | null; lpoValue: number;
  issuedDate: string | null; validUntil: string | null;
  projectId: string | null; status: string; utilizationPct: number;
  notes: string | null;
}

interface Contractor {
  id: string; companyName: string; ncaNumber: string | null;
  ncaCategory: string | null; businessPin: string | null;
  physicalAddress: string | null; county: string | null;
  description: string | null; website: string | null;
  isVerified: boolean; isPremium: boolean;
  compositeScore: number; onTimeScore: number; qualityScore: number;
  subPayScore: number; responsiveScore: number; disputeScore: number;
  totalProjectValue: number; crbStatus: string; itaxCompliant: boolean;
  isBlacklisted: boolean; blacklistReason: string | null;
  agpoNumber: string | null; agpoCategory: string | null;
  agpoVerified: boolean; agpoExpiry: string | null;
  user: { name: string; email: string; phone: string | null };
  projects: Project[];
  receivedReviews: Review[];
  disputes: Dispute[];
  documents: Document[];
  lpos: LPO[];
}

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
    open: { cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Open' },
    under_review: { cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Under Review' },
    resolved: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Resolved' },
    verified: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Verified' },
    pending: { cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
    expired: { cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Expired' },
  };
  const v = variants[status] || { cls: 'bg-gray-100 text-gray-800', label: status };
  return <Badge className={v.cls} variant="secondary">{v.label}</Badge>;
}

function DocTypeLabel(type: string) {
  const map: Record<string, string> = {
    nca_licence: 'NCA Licence', insurance: 'Insurance', tax_compliance: 'Tax Compliance',
    personnel_list: 'Personnel List', crb_report: 'CRB Report', financial_statements: 'Financial Statements',
  };
  return map[type] || type;
}

function ProjectTypeLabel(type: string) {
  const map: Record<string, string> = {
    roads: 'Roads & Infrastructure', building: 'Building & Construction',
    drainage: 'Drainage', water: 'Water Supply', electrical: 'Electrical',
  };
  return map[type] || type;
}

export default function ContractorDetailPage() {
  const params = useParams();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contractors/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setContractor(data); setLoading(false); })
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

  if (!contractor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Contractor Not Found</h2>
        <Link href="/contractors"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to Search</Button></Link>
      </div>
    );
  }

  const avgRating = contractor.receivedReviews.length > 0
    ? Math.round(contractor.receivedReviews.reduce((a, r) => a + (r.onTimeRating + r.qualityRating + r.subPayRating + r.responsiveRating) / 4, 0) / contractor.receivedReviews.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Back Link */}
      <Link href="/contractors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Search
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shrink-0">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{contractor.companyName}</h1>
            {contractor.isVerified && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </Badge>
            )}
            {contractor.isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 gap-1">
                <Star className="h-3 w-3" /> Premium
              </Badge>
            )}
            {contractor.crbStatus === 'Clear' ? (
              <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400">CRB Clear</Badge>
            ) : (
              <Badge variant="outline" className="text-red-700 border-red-300 dark:text-red-400">CRB Adverse</Badge>
            )}
            {contractor.itaxCompliant && (
              <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400">iTax Compliant</Badge>
            )}
            {contractor.agpoNumber && (
              <Badge variant="outline" className="text-blue-700 border-blue-300 dark:text-blue-400 gap-1">
                <Flag className="h-3 w-3" />
                AGPO {contractor.agpoCategory && `(${contractor.agpoCategory})`}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {contractor.ncaNumber && <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />{contractor.ncaNumber}</span>}
            {contractor.ncaCategory && <span>NCA {contractor.ncaCategory}</span>}
            {contractor.county && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{contractor.county}</span>}
            {contractor.businessPin && <span>PIN: {contractor.businessPin}</span>}
          </div>
          {contractor.description && <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{contractor.description}</p>}
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Scores */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Composite Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <ScoreRing score={contractor.compositeScore} size={140} strokeWidth={10} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScoreBar score={contractor.onTimeScore} label="On-Time Delivery" />
              <ScoreBar score={contractor.qualityScore} label="Quality / Workmanship" />
              <ScoreBar score={contractor.subPayScore} label="Sub-Contractor Payment" />
              <ScoreBar score={contractor.responsiveScore} label="Responsiveness" />
              <ScoreBar score={contractor.disputeScore} label="Dispute History" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> M-Pesa Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white" size="sm">
                <FileText className="h-4 w-4 mr-2" />Request Prequal Report — KES 2,500
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />Pay Escrow Deposit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects">Projects ({contractor.projects.length})</TabsTrigger>
              <TabsTrigger value="lpos">LPOs ({contractor.lpos.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({contractor.receivedReviews.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents ({contractor.documents.length})</TabsTrigger>
              <TabsTrigger value="disputes">Disputes ({contractor.disputes.length})</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardContent className="p-0">
                  {contractor.projects.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No projects on record.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden sm:table-cell">Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden lg:table-cell">End Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contractor.projects.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{p.title}</div>
                              {p.client?.companyName && <div className="text-xs text-muted-foreground">{p.client.companyName}</div>}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm">{ProjectTypeLabel(p.projectType)}</TableCell>
                            <TableCell className="hidden sm:table-cell text-sm font-medium">{formatKES(p.contractValue)}</TableCell>
                            <TableCell><StatusBadge status={p.status} /></TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(p.actualEnd || p.endDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                Total Project Value: <span className="font-semibold text-foreground">{formatKES(contractor.totalProjectValue)}</span>
              </div>
            </TabsContent>

            {/* LPOs Tab */}
            <TabsContent value="lpos">
              {contractor.lpos.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground">No Local Purchase Orders on record.</CardContent></Card>
              ) : (
                <>
                  <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 flex gap-2 text-sm text-blue-800 dark:text-blue-300">
                    <FileCheck className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Local Purchase Orders (LPOs) are official orders issued by clients authorizing the contractor to proceed with works. Each LPO is tracked from issuance through utilization.</span>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>LPO Number</TableHead>
                            <TableHead>Issuing Organization</TableHead>
                            <TableHead className="hidden md:table-cell">Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Utilization</TableHead>
                            <TableHead className="hidden lg:table-cell">Valid Until</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contractor.lpos.map((lpo) => (
                            <TableRow key={lpo.id}>
                              <TableCell className="font-mono text-sm font-medium">{lpo.lpoNumber}</TableCell>
                              <TableCell className="text-sm">{lpo.issuingOrg}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm font-medium">{formatKES(lpo.lpoValue)}</TableCell>
                              <TableCell>
                                <StatusBadge status={lpo.status} />
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${lpo.utilizationPct >= 90 ? 'bg-green-500' : lpo.utilizationPct >= 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                      style={{ width: `${lpo.utilizationPct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground">{lpo.utilizationPct}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(lpo.validUntil)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-4">
                {contractor.receivedReviews.length === 0 ? (
                  <Card><CardContent className="p-8 text-center text-muted-foreground">No published reviews yet.</CardContent></Card>
                ) : (
                  contractor.receivedReviews.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{r.reviewerName}</div>
                              <div className="text-xs text-muted-foreground">
                                {r.project?.title} &middot; {formatDate(r.createdAt)}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className={getScoreClass(avgRating)}>
                            Avg {avgRating}/100
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: 'On-Time', val: r.onTimeRating },
                            { label: 'Quality', val: r.qualityRating },
                            { label: 'Sub-Pay', val: r.subPayRating },
                            { label: 'Responsive', val: r.responsiveRating },
                          ].map((d) => (
                            <div key={d.label} className="text-center p-2 rounded-lg bg-muted/50">
                              <div className={`text-lg font-bold ${getScoreClass(d.val)}`}>{d.val}</div>
                              <div className="text-[11px] text-muted-foreground">{d.label}</div>
                            </div>
                          ))}
                        </div>
                        {r.overallComment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{r.overallComment}</p>
                        )}
                        {r.contractorReply && (
                          <div className="mt-2 p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
                            <div className="text-xs font-medium text-primary mb-1">Contractor Reply</div>
                            <p className="text-sm text-muted-foreground">{r.contractorReply}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardContent className="p-0">
                  {contractor.documents.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No documents uploaded.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contractor.documents.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium text-sm">{d.docName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{DocTypeLabel(d.docType)}</TableCell>
                            <TableCell><StatusBadge status={d.status} /></TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{formatDate(d.expiryDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Disputes Tab */}
            <TabsContent value="disputes">
              <div className="space-y-4">
                {contractor.disputes.length === 0 ? (
                  <Card><CardContent className="p-8 text-center text-muted-foreground">No disputes on record.</CardContent></Card>
                ) : (
                  contractor.disputes.map((d) => (
                    <Card key={d.id} className="border-l-4 border-l-red-400">
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{d.title}</h3>
                          <StatusBadge status={d.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">{d.description}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Filed {formatDate(d.createdAt)}
                        </div>
                        {d.resolution && (
                          <div className="mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
                            <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Resolution</div>
                            <p className="text-sm">{d.resolution}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}