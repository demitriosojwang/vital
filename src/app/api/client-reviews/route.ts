import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET() {
  try {
    const reviews = await db.clientReview.findMany({
      where: { status: 'published' },
      include: {
        client: { select: { companyName: true, clientType: true } },
        project: { select: { title: true } },
        reviewer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Client reviews error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const review = await db.clientReview.create({
      data: {
        projectId: body.projectId,
        clientId: body.clientId,
        reviewerId: body.reviewerId,
        reviewerName: body.reviewerName,
        paymentRating: body.paymentRating,
        scopeCreepRating: body.scopeCreepRating,
        siteAccessRating: body.siteAccessRating,
        disputeFairRating: body.disputeFairRating,
        variationRating: body.variationRating,
        overallComment: body.overallComment || null,
        status: 'pending',
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create client review error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}