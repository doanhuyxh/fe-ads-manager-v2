//app/api/report-user-fb

import { NextRequest } from "next/server";
import connectToDB from "../../../libs/mongodb";
import ReportUserFb from "../../../models/ReportUserFb";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET() {
    try {
        await connectToDB();
        const reports = await ReportUserFb.find();
        return successResponse(reports, "Lấy danh sách report thành công");
    } catch (error: any) {
        console.error("[GET_USERS_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { _id, name, keyword, column } = body;
        await connectToDB();
        if (_id) {
            const updateData: any = { name, keyword, column};
            let report = await ReportUserFb.findByIdAndUpdate(_id, updateData, { new: true });
            return successResponse(report, "Cập nhật thành công");
        } else {        
            let report = await ReportUserFb.create({ name, keyword, column});
            return successResponse(report, "Tạo report thành công");
        }
    } catch (error: any) {
        console.error("[POST_USER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}