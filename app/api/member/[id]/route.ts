//app/api/member/[id]
import { NextRequest } from "next/server";
import connectDB from "../../../../libs/mongodb";
import TemplateZalo from "../../../../models/TemplateZalo";
import { successResponse, errorResponse } from "../../../../libs/utils/response";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("ID không hợp lệ");
    }

    await connectDB();
    const template = await TemplateZalo.findById(id);

    if (!template) {
      return errorResponse("Không tìm thấy mẫu tin nhắn");
    }

    return successResponse(template, "Lấy mẫu tin nhắn thành công");
  } catch (error: any) {
    console.error("GET /template-zalo/[id] error:", error);
    return errorResponse("Lỗi khi lấy mẫu tin nhắn");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("ID không hợp lệ");
    }

    await connectDB();
    const deleted = await TemplateZalo.findByIdAndDelete(id);

    if (!deleted) {
      return errorResponse("Không tìm thấy mẫu tin nhắn để xóa");
    }

    return successResponse(null, "Xóa mẫu tin nhắn thành công");
  } catch (error: any) {
    console.error("DELETE /template-zalo/[id] error:", error);
    return errorResponse("Lỗi khi xóa mẫu tin nhắn");
  }
}
