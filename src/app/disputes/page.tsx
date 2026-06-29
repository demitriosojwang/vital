'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle, Shield, Search, Calendar, Building2, FileText,
  Plus, Eye, ChevronRight, Scale, Users, Ban, Clock, CheckCircle2,
} from 'lucide-react';

interface Dispute {
  id: string; title: string; description: string; status: string;
  createdAt: string; resolution: string | null;
  contractor: { companyName: string; ncaNumber: string | null } | null;
  project: { title: string } | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    open: { cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Open' },
    under_review: { cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Under Review' },
    resolved: { cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Resolved' },
  };
  const v = map[status] || { cls: 'bg-gray-100 text-gray-800', label: status };
  return <Badge className={v.cls} variant="secondary">{v.label}</Badge>;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetch('/api/disputes')
      .then((r) => r.json())
      .then((d) => { setDisputes(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = disputes.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.contractor?.companyName.toLowerCase().includes(q) || false;
    }
    return true;
  });

  const openCount = disputes.filter((d) => d.status === 'open').length;
  const reviewCount = disputes.filter((d) => d.status === 'under_review').length;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" /> Dispute & Blacklist Registry
          </h1>
          <p className="text-muted-foreground mt-1">Track, file, and resolve contractor disputes transparently.</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> File a Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>File New Dispute</DialogTitle>
              <DialogDescription>Submit a dispute against a contractor. All disputes are reviewed by our moderation team.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Contractor Name *</Label>
                <Input placeholder="Start typing contractor name..." />
              </div>
              <div className="space-y-2">
                <Label>Project (optional)</Label>
                <Input placeholder="Associated project name" />
              </div>
              <div className="space-y-2">
                <Label>Dispute Title *</Label>
                <Input placeholder="Brief summary of the dispute" />
              </div>
              <div className="space-y-2">
                <Label>Detailed Description *</Label>
                <Textarea placeholder="Provide full details of the dispute including dates, amounts, and any supporting evidence..." rows={5} />
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 text-sm text-yellow-800 dark:text-yellow-300 flex gap-2">
                <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Anonymous filing option is available. Your identity is protected in the public registry.</span>
              </div>
              <Button className="w-full" onClick={() => setOpenDialog(false)}>Submit Dispute</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Disputes', value: disputes.length, icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Open Cases', value: openCount, icon: Clock, color: 'text-yellow-600' },
          { label: 'Under Review', value: reviewCount, icon: Eye, color: 'text-blue-600' },
          { label: 'Resolved', value: disputes.filter((d) => d.status === 'resolved').length, icon: CheckCircle2, color: 'text-green-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-muted shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search disputes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'under_review', 'resolved'].map((f) => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'under_review' ? 'Review' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Dispute List */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">No disputes found</p>
          <p className="text-sm">No disputes match your current filters.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <Card key={d.id} className={`hover:shadow-md transition-shadow ${d.status === 'open' ? 'border-l-4 border-l-yellow-400' : d.status === 'under_review' ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-green-400'}`}>
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{d.title}</h3>
                      <StatusBadge status={d.status} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{d.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {d.contractor && (
                        <Link href={`/contractors/${d.contractor.ncaNumber}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <Building2 className="h-3 w-3" /> {d.contractor.companyName}
                        </Link>
                      )}
                      {d.project && <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {d.project.title}</span>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(d.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    {d.resolution && (
                      <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/10 text-sm text-green-800 dark:text-green-300">
                        <strong>Resolution:</strong> {d.resolution}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blacklist Info Banner */}
      <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
        <CardContent className="p-5 flex items-start gap-3">
          <Ban className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">Blacklist Registry</h3>
            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
              Contractors flagged for serious violations (fraud, abandonment, safety breaches) are added to the blacklist registry.
              Blacklisted contractors are excluded from search results and cannot receive new project awards through the platform.
              All blacklist decisions are reviewable through an appeals process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}