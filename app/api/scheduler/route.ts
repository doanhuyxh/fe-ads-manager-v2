//app/api/scheduler/

import { NextRequest } from "next/server";
import connectToDB from "../../../libs/mongodb";
import Schedule from "../../../models/Schedule";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET() {
    try {
        await connectToDB();
        const schedules = await Schedule.find();
        return successResponse(schedules, "Lấy danh sách thông báo thành công");
    } catch (error: any) {
        console.error("[GET_SCHEDULER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { _id, name, time, startDate, keywords, accountId, chatZaloId, status } = body;
        if (!time || !startDate || !keywords || !chatZaloId || !accountId || !name) {
            return errorResponse("vui lòng điền đủ thông tin");
        }
        await connectToDB();
        let schedule;
        if (_id) {
            const updateData: any = { time, startDate, keywords, accountId, chatZaloId, status, name };
            
            schedule = await Schedule.findByIdAndUpdate(_id, updateData, { new: true });
            return successResponse(schedule, "Cập nhật thành công");
        } else {
            schedule = await Schedule.create({ time, startDate, keywords, accountId, chatZaloId, status, name });
            return successResponse(schedule, "Tạo thông báo thành công");
        }
    } catch (error: any) {
        console.error("[POST_SCHEDULER_ERROR]", error);
        return errorResponse(error.message);
    }
}