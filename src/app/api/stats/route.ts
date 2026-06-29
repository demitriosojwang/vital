import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [totalContractors, verifiedContractors, totalProjects, activeProjects, totalReviews, openDisputes, totalValue] =
    await Promise.all([
      db.contractorProfile.count(),
      db.contractorProfile.count({ where: { isVerified: true } }),
      db.project.count(),
      db.project.count({ where: { status: 'active' } }),
      db.review.count({ where: { status: 'published' } }),
      db.dispute.count({ where: { status: { in: ['open', 'under_review'] } } }),
      db.contractorProfile.aggregate({ _sum: { totalProjectValue: true } }),
    ]);

  return NextResponse.json({
    totalContractors,
    verifiedContractors,
    totalProjects,
    activeProjects,
    totalReviews,
    openDisputes,
    totalProjectValue: totalValue._sum.totalProjectValue || 0,
  });
}