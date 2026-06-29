import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const reviews = await db.review.findMany({
    where: { status: 'published' },
    include: {
      contractor: { select: { companyName: true, ncaNumber: true } },
      project: { select: { title: true, projectType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const review = await db.review.create({
    data: {
      projectId: body.projectId,
      contractorId: body.contractorId,
      reviewerId: body.reviewerId || 'demo-user',
      reviewerName: body.reviewerName,
      onTimeRating: body.onTimeRating,
      qualityRating: body.qualityRating,
      subPayRating: body.subPayRating,
      responsiveRating: body.responsiveRating,
      overallComment: body.overallComment,
      status: 'pending',
    },
  });
  return NextResponse.json(review, { status: 201 });
}