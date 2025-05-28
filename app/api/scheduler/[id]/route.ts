//app/api/scheduler/[id]

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../../libs/mongodb";
import Scheduler from "../../../../models/Schedule";
import { errorResponse, successResponse } from "../../../../libs/utils/response";

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse("ID không hợp lệ");
    }

    try {
        await connectToDB();
        const scheduler = await Scheduler.findById(id).lean();

        if (!scheduler) {
            return errorResponse("Không tìm thấy thông báo");
        }

        return successResponse(scheduler, "Lấy thông tin thông báo thành công");
    } catch (error: any) {
        console.error("[GET_SCHEDULER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}


export async function DELETE(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse("ID không hợp lệ");
    }
    try {
        await connectToDB();
        const deleted = await Scheduler.findByIdAndDelete(id);

        if (!deleted) {
            return errorResponse("Không tìm thấy thông báo để xoá");
        }
        return successResponse(deleted, "Xoá thông báo thành công");
    } catch (error: any) {
        console.error("[DELETE_SCHEDULER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}
