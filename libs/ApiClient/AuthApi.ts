import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import LoginParams from "../types/LoginParams";
import UserData from "../types/UserData";

export async function login(params: LoginParams): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetcher<ApiResponse<UserData>>("/api/auth/login", {
      method: "POST",
      body: params,
    });

    return response;
  } catch (error: any) {
    return {
      status: false,
      data: null,
      message: error.message || "Lỗi đăng nhập",
    };
  }
}
export async function logout() {
  try {
    const response = await fetcher<ApiResponse<UserData>>("/api/auth/logout", {
      method: "GET",
    });

    return response;
  } catch (error: any) {
    return {
      status: false,
      data: null,
      message: error.message || "Lỗi đăng nhập",
    };
  }
}
