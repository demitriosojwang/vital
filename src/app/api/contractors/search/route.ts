import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const county = req.nextUrl.searchParams.get('county') || '';
  const type = req.nextUrl.searchParams.get('type') || '';
  const minScore = parseInt(req.nextUrl.searchParams.get('minScore') || '0');
  const agpo = req.nextUrl.searchParams.get('agpo') || '';

  const where: Record<string, unknown> = { isBlacklisted: false };
  if (q) where.OR = [
    { companyName: { contains: q } },
    { ncaNumber: { contains: q } },
  ];
  if (county) where.county = county;
  if (type) where.ncaCategory = type;
  if (minScore > 0) where.compositeScore = { gte: minScore };
  if (agpo === 'yes') where.agpoNumber = { not: null };
  if (agpo === 'women') where.agpoCategory = 'Women';
  if (agpo === 'youth') where.agpoCategory = 'Youth';
  if (agpo === 'pwd') where.agpoCategory = 'PWD';

  const contractors = await db.contractorProfile.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { projects: true, receivedReviews: true, disputes: true } },
    },
    orderBy: { compositeScore: 'desc' },
  });

  const counties = await db.contractorProfile.findMany({
    where: { isBlacklisted: false },
    distinct: ['county'],
    select: { county: true },
  });

  return NextResponse.json({
    contractors,
    counties: counties.map((c) => c.county).filter(Boolean),
  });
}