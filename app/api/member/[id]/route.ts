//app/api/member/[id]

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../../libs/mongodb";
import User from "../../../../models/user";
import { errorResponse, successResponse } from "../../../../libs/utils/response";

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse("ID không hợp lệ");
    }

    try {
        await connectToDB();
        const user = await User.findById(id).lean();

        if (!user) {
            return errorResponse("Không tìm thấy user");
        }

        return successResponse(user, "Lấy thông tin user thành công");
    } catch (error: any) {
        console.error("[GET_USER_ERROR]", error);
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
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return errorResponse("Không tìm thấy user để xoá");
        }
        return successResponse(deleted, "Xoá user thành công");
    } catch (error: any) {
        console.error("[DELETE_USER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}
