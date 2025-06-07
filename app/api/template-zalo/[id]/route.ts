import { NextRequest } from "next/server";
import connectDB from "../../../../libs/mongodb";
import TemplateZalo from "../../../../models/TemplateZalo";
import { successResponse, errorResponse } from "../../../../libs/utils/response";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const template = await TemplateZalo.findById(params.id);

        if (!template) {
            return errorResponse("Không tìm thấy mẫu tin nhắn", null);
        }

        return successResponse(template, "Lấy mẫu tin nhắn thành công");
    } catch (error: any) {
        console.error("GET /template-zalo/[id] error:", error);
        return errorResponse("Lỗi khi lấy mẫu tin nhắn");
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.name || !body.content) {
            return errorResponse("Thiếu trường 'name' hoặc 'content'");
        }

        const updated = await TemplateZalo.findByIdAndUpdate(params.id, body, {
            new: true,
        });

        if (!updated) {
            return errorResponse("Không tìm thấy mẫu tin nhắn cần cập nhật");
        }

        return successResponse(updated, "Cập nhật mẫu tin nhắn thành công");
    } catch (error: any) {
        console.error("PUT /template-zalo/[id] error:", error);
        return errorResponse("Lỗi khi cập nhật mẫu tin nhắn");
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const deleted = await TemplateZalo.findByIdAndDelete(params.id);

        if (!deleted) {
            return errorResponse("Không tìm thấy mẫu tin nhắn để xóa");
        }

        return successResponse(null, "Xóa mẫu tin nhắn thành công");
    } catch (error: any) {
        console.error("DELETE /template-zalo/[id] error:", error);
        return errorResponse("Lỗi khi xóa mẫu tin nhắn");
    }
}
