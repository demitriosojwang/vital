import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await db.clientProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        projects: {
          include: {
            contractor: {
              select: {
                companyName: true,
                compositeScore: true,
                isVerified: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        clientReviews: {
          include: {
            project: { select: { title: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Client detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}