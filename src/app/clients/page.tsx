'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { ScoreRing } from '@/components/score/score-ring';
import {
  Search,
  Filter,
  Building2,
  SlidersHorizontal,
  X,
  Briefcase,
  AlertTriangle,
  MessageSquare,
  TrendingDown,
  Eye,
  Landmark,
  HandshakeIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ClientCount {
  projects: number;
  clientReviews: number;
}

interface Client {
  id: string;
  companyName: string | null;
  clientType: string;
  compositeScore: number;
  paymentScore: number;
  totalProjectValue: number;
  isBlacklisted: boolean;
  user: { name: string; email: string };
  _count: ClientCount;
}

interface SearchResponse {
  clients: Client[];
  clientTypes: string[];
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

const CLIENT_TYPE_ICONS: Record<string, typeof Landmark> = {
  county: Landmark,
  developer: Building2,
  ngo: HandshakeIcon,
  parastatal: Landmark,
};

function formatKES(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount.toLocaleString()}`;
}

function getTypeIcon(type: string) {
  return CLIENT_TYPE_ICONS[type] || Building2;
}

function getTypeBadgeStyle(type: string): string {
  switch (type) {
    case 'county':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'developer':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'ngo':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    case 'parastatal':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700';
  }
}

/* ------------------------------------------------------------------ */
/*  Filter Sidebar                                                     */
/* ------------------------------------------------------------------ */

function FilterSidebar({
  clientTypes,
  filters,
  onChange,
  onReset,
}: {
  clientTypes: string[];
  filters: { query: string; type: string; minScore: number };
  onChange: (f: typeof filters) => void;
  onReset: () => void;
}) {
  const hasActiveFilters = filters.query || filters.type || filters.minScore > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search Clients</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Client name…"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Client Type</label>
        <Select
          value={filters.type}
          onValueChange={(v) => onChange({ ...filters, type: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            {clientTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {CLIENT_TYPE_LABELS[t] || t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Min Client Score</label>
          <span className="text-sm font-semibold text-primary">{filters.minScore}</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[filters.minScore]}
          onValueChange={([v]) => onChange({ ...filters, minScore: v })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
          <X className="size-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Client Card                                                        */
/* ------------------------------------------------------------------ */

function ClientCard({ client }: { client: Client }) {
  const TypeIcon = getTypeIcon(client.clientType);
  const isBlacklisted = client.isBlacklisted;

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className={`group relative h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer ${isBlacklisted ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : ''}`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4">
            {/* Score Ring */}
            <div className="shrink-0">
              <ScoreRing score={client.compositeScore} size={80} strokeWidth={6} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-1.5 flex-wrap">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {client.companyName || client.user.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-[11px] ${getTypeBadgeStyle(client.clientType)}`}
                >
                  <TypeIcon className="size-3" />
                  {CLIENT_TYPE_LABELS[client.clientType] || client.clientType}
                </Badge>
                {isBlacklisted && (
                  <Badge variant="destructive" className="shrink-0 text-[11px]">
                    <AlertTriangle className="size-3" />
                    Flagged
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <TrendingDown className="size-3.5" />
                  Payment: {client.paymentScore}/100
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5" />
                  {client._count.projects} project{client._count.projects !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Warning indicators */}
              {client.compositeScore < 50 && (
                <div className="mt-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    Low client score — contractors may demand premium terms
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Briefcase className="size-3" />
                <span className="text-[11px]">Projects</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {client._count.projects}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Eye className="size-3" />
                <span className="text-[11px]">Value</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {formatKES(client.totalProjectValue)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <MessageSquare className="size-3" />
                <span className="text-[11px]">Reviews</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {client._count.clientReviews}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton / Empty                                                   */
/* ------------------------------------------------------------------ */

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4">
          <Skeleton className="size-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-3 gap-2">
          <Skeleton className="h-8 mx-auto w-16" />
          <Skeleton className="h-8 mx-auto w-20" />
          <Skeleton className="h-8 mx-auto w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No clients found</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        Try adjusting your search or filters to find clients.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [filters, setFilters] = useState({
    query: '',
    type: '',
    minScore: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.type) params.set('type', filters.type);
      if (filters.minScore > 0) params.set('minScore', String(filters.minScore));

      const res = await fetch(`/api/clients/search?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: SearchResponse = await res.json();
      setClients(data.clients);
      if (data.clientTypes.length > 0 && clientTypes.length === 0) {
        setClientTypes(data.clientTypes);
      }
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [filters.query, filters.type, filters.minScore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetch('/api/clients/search')
      .then((r) => r.json())
      .then((data: SearchResponse) => {
        if (data.clientTypes.length > 0) setClientTypes(data.clientTypes);
      })
      .catch(() => {});
  }, []);

  const handleReset = () => {
    setFilters({ query: '', type: '', minScore: 0 });
  };

  const activeFilterCount = [
    filters.query,
    filters.type,
    filters.minScore > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-white/15 text-white hover:bg-white/20 border-0 px-3 py-1 text-sm">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              NEW — Contractor-First Transparency
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Vet Clients Before You Sign
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Every procuring entity gets a score. See how clients pay, how they handle
            variation orders, and whether contractors recommend them. Stop signing blind contracts.
          </p>

          {/* Info banner */}
          <div className="mt-6 p-4 rounded-lg bg-white/10 border border-white/15 max-w-2xl">
            <h3 className="font-semibold text-sm mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="size-4" />
              How Client Scoring Works
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              After completing a project, contractors rate the client across 5 dimensions:
              payment timeliness (30%), scope creep frequency (20%), site accessibility (15%),
              fairness in dispute resolution (20%), and variation order handling (15%).
              Clients with low scores pay a premium to attract good contractors — or simply
              can&apos;t attract them at all.
            </p>
          </div>

          {/* Header search */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-white/60" />
              <Input
                placeholder="Search by client name…"
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:bg-white/15 focus-visible:border-white/40"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters({ ...filters, query: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="size-4 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <Badge className="ml-auto text-[10px] px-1.5">{activeFilterCount}</Badge>
                )}
              </div>
              <FilterSidebar
                clientTypes={clientTypes}
                filters={filters}
                onChange={setFilters}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Mobile filter */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg h-14 w-14 p-0">
                  <span className="relative">
                    <Filter className="size-5" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2.5 size-4.5 bg-kenya-gold text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader className="mt-8">
                  <SheetTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-primary" />
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <FilterSidebar
                    clientTypes={clientTypes}
                    filters={filters}
                    onChange={(f) => setFilters(f)}
                    onReset={() => {
                      handleReset();
                      setSheetOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <section className="flex-1 min-w-0" aria-label="Search results">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  'Searching…'
                ) : (
                  <>
                    <span className="font-medium text-foreground">{clients.length}</span>{' '}
                    client{clients.length !== 1 ? 's' : ''} found
                  </>
                )}
              </p>
              <Link href="/rate-client">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageSquare className="size-3.5" />
                  <span className="hidden sm:inline">Rate a Client</span>
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : clients.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {clients.map((c) => (
                  <ClientCard key={c.id} client={c} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}