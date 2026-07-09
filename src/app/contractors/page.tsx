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
  MapPin,
  Shield,
  Star,
  AlertTriangle,
  SlidersHorizontal,
  X,
  ChevronDown,
  CheckCircle2,
  FileCheck,
  Briefcase,
  TrendingUp,
  Flag,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContractorCount {
  projects: number;
  receivedReviews: number;
  disputes: number;
}

interface Contractor {
  id: string;
  companyName: string;
  ncaNumber: string | null;
  ncaCategory: string | null;
  county: string | null;
  compositeScore: number;
  isVerified: boolean;
  isPremium: boolean;
  crbStatus: string;
  itaxCompliant: boolean;
  agpoNumber: string | null;
  agpoCategory: string | null;
  agpoVerified: boolean;
  totalProjectValue: number;
  _count: ContractorCount;
}

interface SearchResponse {
  contractors: Contractor[];
  counties: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const NCA_CATEGORIES = [
  'NCA 1',
  'NCA 2',
  'NCA 3',
  'NCA 4',
  'NCA 5',
  'NCA 6',
  'NCA 7',
  'NCA 8',
];

function formatKES(amount: number): string {
  if (amount >= 1_000_000_000) return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount.toLocaleString()}`;
}

function buildParams(filters: {
  query: string;
  county: string;
  category: string;
  minScore: number;
  agpo: string;
}): string {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.county) params.set('county', filters.county);
  if (filters.category) params.set('type', filters.category);
  if (filters.minScore > 0) params.set('minScore', String(filters.minScore));
  if (filters.agpo) params.set('agpo', filters.agpo);
  return params.toString();
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FilterSidebar({
  counties,
  filters,
  onChange,
  onReset,
}: {
  counties: string[];
  filters: { query: string; county: string; category: string; minScore: number; agpo: string };
  onChange: (f: typeof filters) => void;
  onReset: () => void;
}) {
  const hasActiveFilters =
    filters.query || filters.county || filters.category || filters.minScore > 0 || filters.agpo;

  return (
    <div className="space-y-6">
      {/* Search by name / NCA number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Name or NCA number…"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* County */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">County</label>
        <Select
          value={filters.county}
          onValueChange={(v) => onChange({ ...filters, county: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All counties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All counties</SelectItem>
            {counties
              .sort((a, b) => a.localeCompare(b))
              .map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* NCA Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          NCA Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(v) =>
            onChange({ ...filters, category: v === '__all__' ? '' : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All categories</SelectItem>
            {NCA_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AGPO Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          AGPO Status
        </label>
        <Select
          value={filters.agpo}
          onValueChange={(v) =>
            onChange({ ...filters, agpo: v === '__all__' ? '' : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All contractors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All contractors</SelectItem>
            <SelectItem value="yes">AGPO Registered (Any)</SelectItem>
            <SelectItem value="youth">AGPO - Youth</SelectItem>
            <SelectItem value="women">AGPO - Women</SelectItem>
            <SelectItem value="pwd">AGPO - PWD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Score Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Min Score
          </label>
          <span className="text-sm font-semibold text-primary">
            {filters.minScore}
          </span>
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

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onReset}
        >
          <X className="size-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contractor Card                                                    */
/* ------------------------------------------------------------------ */

function ContractorCard({ contractor }: { contractor: Contractor }) {
  const {
    id,
    companyName,
    ncaNumber,
    ncaCategory,
    county,
    compositeScore,
    isVerified,
    isPremium,
    crbStatus,
    itaxCompliant,
    agpoNumber,
    agpoCategory,
    totalProjectValue,
    _count,
  } = contractor;

  const isCrbClear = crbStatus === 'Clear';
  const isCrbAdverse = crbStatus === 'Adverse';

  return (
    <Link href={`/contractors/${id}`}>
      <Card className="group relative h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-4 sm:p-5">
          {/* Top row: Score + Info */}
          <div className="flex gap-4">
            {/* Score Ring */}
            <div className="shrink-0">
              <ScoreRing score={compositeScore} size={80} strokeWidth={6} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              {/* Name + badges row */}
              <div className="flex items-start gap-1.5 flex-wrap">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {companyName}
                </h3>
                {isVerified && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 shrink-0"
                  >
                    <CheckCircle2 className="size-3" />
                    Verified
                  </Badge>
                )}
                {isPremium && (
                  <Badge className="gradient-gold text-white border-0 shrink-0">
                    <Star className="size-3" />
                    Premium
                  </Badge>
                )}
              </div>

              {/* NCA + County */}
              <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-muted-foreground flex-wrap">
                {ncaNumber && (
                  <span className="flex items-center gap-1">
                    <Shield className="size-3.5" />
                    {ncaNumber}
                  </span>
                )}
                {ncaCategory && (
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5" />
                    {ncaCategory}
                  </span>
                )}
                {county && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {county}
                  </span>
                )}
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {isCrbClear && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[11px]"
                  >
                    <FileCheck className="size-3" />
                    CRB Clear
                  </Badge>
                )}
                {isCrbAdverse && (
                  <Badge
                    variant="destructive"
                    className="text-[11px]"
                  >
                    <AlertTriangle className="size-3" />
                    CRB Adverse
                  </Badge>
                )}
                {itaxCompliant && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[11px]"
                  >
                    <FileCheck className="size-3" />
                    iTax Compliant
                  </Badge>
                )}
                {agpoNumber && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 text-[11px]"
                  >
                    <Flag className="size-3" />
                    AGPO{agpoCategory ? ` (${agpoCategory})` : ''}
                  </Badge>
                )}
              </div>
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
                {_count.projects}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="size-3" />
                <span className="text-[11px]">Value</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {formatKES(totalProjectValue)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <AlertTriangle className="size-3" />
                <span className="text-[11px]">Disputes</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {_count.disputes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Card                                                      */
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
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
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

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No contractors found</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        Try adjusting your search terms or filters to find contractors.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    query: '',
    county: '',
    category: '',
    minScore: 0,
    agpo: '',
  });

  /* ---- Data fetching ---- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams(filters);
      const res = await fetch(`/api/contractors/search?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: SearchResponse = await res.json();
      setContractors(data.contractors);
      // Only update counties on first load or when they're empty
      if (data.counties.length > 0 && counties.length === 0) {
        setCounties(data.counties);
      }
    } catch {
      setContractors([]);
    } finally {
      setLoading(false);
    }
  }, [filters.query, filters.county, filters.category, filters.minScore, filters.agpo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Also fetch counties on mount (unfiltered)
  useEffect(() => {
    fetch('/api/contractors/search')
      .then((r) => r.json())
      .then((data: SearchResponse) => {
        if (data.counties.length > 0) setCounties(data.counties);
      })
      .catch(() => {});
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({ query: '', county: '', category: '', minScore: 0, agpo: '' });
  };

  // Count active filters for badge
  const activeFilterCount = [
    filters.query,
    filters.county,
    filters.category,
    filters.minScore > 0,
    filters.agpo,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ============ Search Header ============ */}
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Find Contractors
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base max-w-2xl">
            Search Kenya&apos;s vetted construction professionals by name, NCA registration,
            county, or category. Every contractor is scored across five key dimensions.
          </p>

          {/* Header search bar (desktop) */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-primary-foreground/60" />
              <Input
                placeholder="Search by contractor name or NCA number…"
                value={filters.query}
                onChange={(e) =>
                  handleFilterChange({ ...filters, query: e.target.value })
                }
                className="pl-11 h-11 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:bg-white/15 focus-visible:border-white/40"
              />
              {filters.query && (
                <button
                  onClick={() => handleFilterChange({ ...filters, query: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Main Content ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* ---- Desktop Sidebar ---- */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="size-4 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <Badge className="ml-auto text-[10px] px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <FilterSidebar
                counties={counties}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* ---- Mobile filter sheet ---- */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-full shadow-lg h-14 w-14 p-0"
                >
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
                    counties={counties}
                    filters={filters}
                    onChange={(f) => {
                      handleFilterChange(f);
                    }}
                    onReset={() => {
                      handleReset();
                      setSheetOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* ---- Results ---- */}
          <section className="flex-1 min-w-0" aria-label="Search results">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  'Searching…'
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {contractors.length}
                    </span>{' '}
                    contractor{contractors.length !== 1 ? 's' : ''} found
                  </>
                )}
              </p>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : contractors.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {contractors.map((c) => (
                  <ContractorCard key={c.id} contractor={c} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
