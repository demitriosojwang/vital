import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const minScore = parseInt(searchParams.get('minScore') || '0', 10);
    const sort = searchParams.get('sort') || 'score_desc';

    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { companyName: { contains: query } },
        { user: { name: { contains: query } } },
      ];
    }

    if (type && type !== '__all__') {
      where.clientType = type;
    }

    if (minScore > 0) {
      where.compositeScore = { gte: minScore };
    }

    const orderBy: Record<string, string> =
      sort === 'value_desc'
        ? { totalProjectValue: 'desc' }
        : sort === 'reviews_desc'
        ? { clientReviews: { _count: 'desc' } }
        : { compositeScore: 'desc' };

    const clients = await db.clientProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { projects: true, clientReviews: true } },
      },
      orderBy,
    });

    // Get distinct client types for filter
    const types = await db.clientProfile.findMany({
      select: { clientType: true },
      distinct: ['clientType'],
    });

    return NextResponse.json({
      clients,
      clientTypes: types.map((t) => t.clientType),
    });
  } catch (error) {
    console.error('Client search error:', error);
    return NextResponse.json({ clients: [], clientTypes: [] }, { status: 500 });
  }
}