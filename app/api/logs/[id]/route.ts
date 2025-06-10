import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../../libs/mongodb";
import LogModel from "../../../../models/Log";

interface Params {
  params: { id: string };
}

// GET: /api/logs/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const log = await LogModel.findById(params.id);
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(log);
}


// DELETE: /api/logs/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  const deleted = await LogModel.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
