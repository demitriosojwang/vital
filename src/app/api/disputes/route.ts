import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const disputes = await db.dispute.findMany({
    include: {
      contractor: { select: { companyName: true, ncaNumber: true } },
      project: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(disputes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dispute = await db.dispute.create({
    data: {
      contractorId: body.contractorId,
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      status: 'open',
    },
  });
  return NextResponse.json(dispute, { status: 201 });
}