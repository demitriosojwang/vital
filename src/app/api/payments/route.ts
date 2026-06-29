import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const payments = await db.payment.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const payment = await db.payment.create({
    data: {
      userId: body.userId,
      amount: body.amount,
      type: body.type,
      status: 'pending',
    },
  });
  return NextResponse.json(payment, { status: 201 });
}