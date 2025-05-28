// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../../libs/utils/response";
import connectToDB from "../../../../libs/mongodb";
import User from "../../../../models/user";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Vui lòng nhập đầy đủ thông tin.");
    }

    await connectToDB();
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("Email không tồn tại.");
    }

    const isMatch = password == user.passwordHash;
    if (!isMatch) {
      return errorResponse("Mật khẩu không đúng.");
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        companyId: user.companyIds,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );
    // Trả về response có set cookie
    return new Response(
      JSON.stringify({
        status: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyIds,
          token,
        },
        message: "Đăng nhập thành công",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`, // 7 ngày
        },
      }
    );
  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error);
    return errorResponse("Đăng nhập thất bại", error.message);
  }
}