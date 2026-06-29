'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  LayoutDashboard, Users, Star, AlertTriangle, FileText, CreditCard,
  CheckCircle2, XCircle, Clock, Eye, Building2, Shield, Ban,
} from 'lucide-react';

interface Stats {
  totalContractors: number; verifiedContractors: number;
  totalProjects: number; activeProjects: number;
  totalReviews: number; openDisputes: number;
  totalProjectValue: number;
}

interface Review {
  id: string; reviewerName: string; status: string; createdAt: string;
  contractor: { companyName: string } | null;
  project: { title: string } | null;
}

interface Dispute {
  id: string; title: string; status: string; createdAt: string;
  contractor: { companyName: string } | null;
}

interface Document {
  id: string; docName: string; docType: string; status: string; uploadDate: string;
  contractor: { companyName: string; ncaNumber: string | null } | null;
}

interface Payment {
  id: string; amount: number; type: string; status: string;
  mpesaRef: string | null; createdAt: string;
}

function formatKES(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount}`;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/reviews').then((r) => r.json()),
      fetch('/api/disputes').then((r) => r.json()),
      fetch('/api/payments').then((r) => r.json()),
    ]).then(([s, r, d, p]) => {
      setStats(s); setReviews(r); setDisputes(d); setPayments(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    );
  }

  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-primary" /> Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Moderate reviews, verify documents, and manage the platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats && [
          { label: 'Total Contractors', value: stats.totalContractors, sub: `${stats.verifiedContractors} verified`, icon: Building2, color: 'text-primary' },
          { label: 'Active Projects', value: stats.activeProjects, sub: `${stats.totalProjects} total`, icon: FileText, color: 'text-blue-600' },
          { label: 'Published Reviews', value: stats.totalReviews, sub: `${pendingReviews.length} pending`, icon: Star, color: 'text-yellow-600' },
          { label: 'Open Disputes', value: stats.openDisputes, sub: `${disputes.length} total`, icon: AlertTriangle, color: 'text-red-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-muted shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
                <div className="text-[10px] text-muted-foreground">{s.sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats && (
        <div className="p-4 rounded-lg bg-muted/50 flex flex-wrap gap-6 text-sm">
          <span>Total Project Value on Platform: <strong>{formatKES(stats.totalProjectValue)}</strong></span>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="reviews">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">Pending Reviews ({pendingReviews.length})</TabsTrigger>
          <TabsTrigger value="disputes">Disputes ({disputes.filter((d) => d.status !== 'resolved').length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        {/* Pending Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reviews Awaiting Moderation</CardTitle>
              <CardDescription>Review and approve or reject submitted contractor reviews.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {pendingReviews.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No pending reviews. All clear!</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead className="hidden md:table-cell">Project</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReviews.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-sm">{r.reviewerName}</TableCell>
                        <TableCell className="text-sm">{r.contractor?.companyName || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.project?.title || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 text-green-600 border-green-300 hover:bg-green-50">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-red-600 border-red-300 hover:bg-red-50">
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Disputes</CardTitle>
              <CardDescription>Manage and resolve open disputes and blacklist requests.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {disputes.filter((d) => d.status !== 'resolved').length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No active disputes.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispute</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.filter((d) => d.status !== 'resolved').map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium text-sm">{d.title}</TableCell>
                        <TableCell className="text-sm">{d.contractor?.companyName || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={
                            d.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }>
                            {d.status === 'under_review' ? 'Under Review' : 'Open'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7">
                              <Eye className="h-3.5 w-3.5 mr-1" /> Review
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-red-600">
                              <Ban className="h-3.5 w-3.5 mr-1" /> Blacklist
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">M-Pesa Payment Transactions</CardTitle>
              <CardDescription>All platform payments including search fees, subscriptions, and reports.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.mpesaRef || p.id.slice(0, 10)}</TableCell>
                      <TableCell className="text-sm capitalize">{p.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-sm font-medium">{formatKES(p.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Verify Contractor Documents</h3>
                  <p className="text-sm text-muted-foreground">Review and approve pending document uploads</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Recalculate Scores</h3>
                  <p className="text-sm text-muted-foreground">Trigger score recalculation for all contractors</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Blacklist</h3>
                  <p className="text-sm text-muted-foreground">Add, remove, or review blacklisted contractors</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Reconciliation</h3>
                  <p className="text-sm text-muted-foreground">Reconcile M-Pesa transactions and resolve pending payments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}