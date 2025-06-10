import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../libs/mongodb";
import LogModel from "../../../models/Log";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")

  const skip = (page - 1) * limit;

  await connectToDB()
  const filter = search
    ? { message: { $regex: search, $options: "i" } } // không phân biệt hoa thường
    : {};
  const [logs, total] = await Promise.all([
    LogModel.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
    LogModel.countDocuments(filter),
  ]);

  return successResponse({
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }, '')
}


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { time, message, level } = body;

  if (!time || !message || !level) {
    return errorResponse("missing data");
  }

  const log = await LogModel.create({ time, message });
  return successResponse(log, '');
}
