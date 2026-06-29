import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const projects = await db.project.findMany({
    include: {
      contractor: {
        select: { id: true, companyName: true, compositeScore: true, ncaNumber: true },
      },
      client: { select: { companyName: true } },
      reviews: { where: { status: 'published' } },
      milestones: { orderBy: { percentage: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(projects);
}