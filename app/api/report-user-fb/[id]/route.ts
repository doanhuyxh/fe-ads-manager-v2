//app/api/report-user-fb/[id]

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../../libs/mongodb";
import ReportUserFb from "../../../../models/ReportUserFb";
import { successResponse, errorResponse } from "../../../../libs/utils/response";

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    try {
        await connectToDB();
        const resport = await ReportUserFb.findById(id).lean();
        return successResponse(resport, "Lấy danh sách resport thành công");
    } catch (error: any) {
        console.error("[GET_USERS_ERROR]", error);
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
        const deleted = await ReportUserFb.findByIdAndDelete(id);

        if (!deleted) {
            return errorResponse("Không tìm thấy report để xoá");
        }
        return successResponse(deleted, "Xoá user thành công");
    } catch (error: any) {
        console.error("[DELETE_USER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}
