import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const contractors = await db.contractorProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { projects: true, receivedReviews: true, disputes: true } },
    },
    orderBy: { compositeScore: 'desc' },
  });
  return NextResponse.json(contractors);
}