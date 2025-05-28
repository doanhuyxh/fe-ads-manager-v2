//app/api/auth/logout

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = cookies();
    const cookieList = (await cookieStore).getAll();

    const response = NextResponse.json({
        status: true,
        message: "Đăng xuất thành công",
        data: null,
    });

    for (const cookie of cookieList) {
        response.cookies.set(cookie.name, "", {
            path: "/",
            maxAge: 0,
        });
    }

    return response;
}
