import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const lpos = await db.localPurchaseOrder.findMany({
    orderBy: { issuedDate: 'desc' },
    include: {
      contractor: { select: { companyName: true, ncaNumber: true } },
      project: { select: { title: true } },
    },
  });
  return NextResponse.json(lpos);
}