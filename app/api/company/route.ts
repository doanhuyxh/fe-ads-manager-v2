//app/api/company/route

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../libs/mongodb";
import Company from "../../../models/Company";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET(req: NextRequest) {

    try {
        await connectToDB();
        const companies = await Company.find().lean();
        return successResponse(companies, "Lấy thông tin công ty thành công");
    } catch (error: any) {
        console.error("[GET_COMPANY_ERROR]", error);
        return errorResponse("Lấy dữ liệu thất bại", [])
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, fbToken, idPage, _id } = body;

        if (!name) {
            return errorResponse("Tên công ty là bắt buộc");
        }
        await connectToDB();
        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            const updated = await Company.findByIdAndUpdate(
                _id,
                { name, fbToken, idPage },
                { new: true }
            );
            if (updated) {
                return successResponse(updated, "Cập nhật công ty thành công");
            }
        }
        const newCompany = await Company.create({ name, fbToken, idPage });
        return successResponse(newCompany, "Tạo công ty mới thành công");
    } catch (error: any) {
        console.error("[POST_COMPANY_ERROR]", error);
        return errorResponse("Thất bại", error.message);
    }
}