import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const docs = await db.contractorDocument.findMany({
    include: {
      contractor: { select: { companyName: true, ncaNumber: true } },
    },
    orderBy: { uploadDate: "desc" },
  });
  return NextResponse.json(docs);
}

