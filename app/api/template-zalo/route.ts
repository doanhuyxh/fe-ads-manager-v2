// app/api/template-zalo/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import TemplateZalo from "../../../models/TemplateZalo";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET() {
    try {
        await connectDB();
        const templates = await TemplateZalo.find();
        return successResponse(templates, "Lấy mẫu tin nhắn Zalo thành công");
    } catch (error: any) {
        console.error("GET /template-zalo error:", error);
        return errorResponse("Không thể lấy dữ liệu", 500);
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const { _id, name, content } = body;

        if (!name || !content) {
            return errorResponse("Thiếu trường 'name' hoặc 'content'", 400);
        }
        let result;
        if (_id) {
            result = await TemplateZalo.findByIdAndUpdate(
                _id,
                { name, content },
                { new: true, upsert: true } // upsert = true sẽ tạo mới nếu không tồn tại
            );
        } else {
            // Nếu không có _id, tạo mới bình thường
            result = await TemplateZalo.create({ name, content });
        }

        return successResponse(result, _id ? "Cập nhật mẫu tin nhắn thành công" : "Tạo mẫu tin nhắn Zalo thành công");
    } catch (error: any) {
        console.error("POST /template-zalo error:", error);
        return errorResponse("Không thể tạo hoặc cập nhật mẫu tin nhắn");
    }
}
