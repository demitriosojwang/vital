import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contractor = await db.contractorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      projects: {
        orderBy: { createdAt: 'desc' },
        include: {
          reviews: { where: { status: 'published' } },
          milestones: { orderBy: { percentage: 'asc' } },
          client: { select: { companyName: true, clientType: true } },
        },
      },
      documents: { orderBy: { uploadDate: 'desc' } },
      receivedReviews: {
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        include: { project: { select: { title: true } } },
      },
      disputes: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!contractor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contractor);
}