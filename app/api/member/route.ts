//app/api/member

import { NextRequest } from "next/server";
import connectToDB from "../../../libs/mongodb";
import User from "../../../models/user";
import { successResponse, errorResponse } from "../../../libs/utils/response";

export async function GET() {
    try {
        await connectToDB();
        const users = await User.find();
        return successResponse(users, "Lấy danh sách user thành công");
    } catch (error: any) {
        console.error("[GET_USERS_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { _id, email, name, passwordHash, companyIds } = body;
        if (!name || !email) {
            return errorResponse("Tên và email là bắt buộc");
        }
        await connectToDB();
        let user;
        if (_id) {
            const updateData: any = { name, email, companyIds, role: "user" };
            if (passwordHash) {
                updateData.passwordHash = passwordHash;
            }
            user = await User.findByIdAndUpdate(_id, updateData, { new: true });
            return successResponse(user, "Cập nhật thành công");
        } else {
            if (!passwordHash) {
                return errorResponse("Mật khẩu là bắt buộc khi tạo user");
            }
            user = await User.create({ name, email, companyIds, passwordHash, role: "user" });
            return successResponse(user, "Tạo user thành công");
        }
    } catch (error: any) {
        console.error("[POST_USER_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}