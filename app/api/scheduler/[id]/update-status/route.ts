import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../../../libs/mongodb";
import Scheduler from "../../../../../models/Schedule";
import { errorResponse, successResponse } from "../../../../../libs/utils/response";



export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse("ID không hợp lệ");
  }

  try {
    await connectToDB();

    const scheduler = await Scheduler.findById(id);
    if (!scheduler) {
      return errorResponse("Không tìm thấy thông báo");
    }

    // Toggle trạng thái
    scheduler.status = scheduler.status === "active" ? "inactive" : "active";

    const updated = await scheduler.save();

    return successResponse(updated, "Cập nhật trạng thái thành công");
  } catch (error: any) {
    console.error("[UPDATE_SCHEDULER_STATUS_ERROR]", error);
    return errorResponse("Lỗi server", error.message);
  }
}

