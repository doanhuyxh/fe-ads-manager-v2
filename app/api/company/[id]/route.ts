//app/api/company/[id]/route

import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../../libs/mongodb";
import Company from "../../../../models/Company";
import mongoose, { Types } from "mongoose";
import { successResponse, errorResponse } from "../../../../libs/utils/response";

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse("ID không hợp lệ");
    }
    try {
        await connectToDB();

        const company = await Company.findById(id).lean();

        if (!company) {
            return errorResponse("Không tìm thấy công ty");
        }
        return successResponse(company, "Lấy thông tin công ty thành công");

    } catch (error: any) {
        console.error("[GET_COMPANY_BY_ID_ERROR]", error);
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

        const result = await Company.deleteOne({ _id: new Types.ObjectId(id) });

        if (result.deletedCount === 0) {
            return errorResponse("Không tìm thấy công ty");
        }

        return successResponse(null, "Xóa công ty thành công");

    } catch (error: any) {
        console.error("[GET_COMPANY_BY_ID_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}
