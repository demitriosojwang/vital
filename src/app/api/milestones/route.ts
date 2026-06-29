import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId');
  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 });
  }
  const milestones = await db.milestone.findMany({
    where: { projectId },
    orderBy: { percentage: 'asc' },
  });
  return NextResponse.json(milestones);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const milestone = await db.milestone.update({
    where: { id: body.id },
    data: {
      status: body.status,
      completedDate: body.status === 'completed' ? new Date() : null,
    },
  });
  return NextResponse.json(milestone);
}