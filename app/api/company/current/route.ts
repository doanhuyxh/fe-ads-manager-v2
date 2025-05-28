//app/api/company/current/route

import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../../libs/mongodb";
import Company from "../../../../models/Company";
import User from "../../../../models/user";
import mongoose, { Types, ObjectId } from "mongoose";
import { successResponse, errorResponse } from "../../../../libs/utils/response";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const companys = await Company.find({}).lean();
        if (!companys || companys.length === 0) {
            return errorResponse("Không tìm thấy công ty");
        }
        let id_account_fb_mongo = "";

        // Nếu header có sẵn id_account_fb_mongo
        const cookieHeader = req.headers.get("cookie") || "";
        const cookiesObject = Object.fromEntries(
            cookieHeader.split(";").map((c) => c.trim().split("="))
        );
        const existingId = cookiesObject["id_account_fb_mongo"] || "";

        if (existingId) {
            id_account_fb_mongo = existingId;
        } else {
            // Nếu không, lấy từ user
            const currentUserId = req.headers.get("x-user-id");
            if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
                return errorResponse("ID người dùng không hợp lệ hoặc thiếu header x-user-id");
            }

            const user = await User.findOne({ _id: new Types.ObjectId(currentUserId) }).lean();
            if (!user) {
                return errorResponse("Không tìm thấy người dùng");
            }

            if (user.companyIds && user.companyIds.length > 0) {
                id_account_fb_mongo = user.companyIds[0].toString();
            } else {
                id_account_fb_mongo = companys[0]._id.toString();
            }
        }

        const url = new URL(req.url);
        const id_change = url.searchParams.get("id");
        if (id_change){
            id_account_fb_mongo = id_change
        }

        const response = NextResponse.json({
            status: true,
            data: companys,
            message: id_account_fb_mongo,
        });

        response.cookies.set({
            name: "id_account_fb_mongo",
            value: id_account_fb_mongo,
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error: any) {
        console.error("[GET_COMPANY_CURRENT_ERROR]", error);
        return errorResponse("Lỗi server", error.message);
    }
}
