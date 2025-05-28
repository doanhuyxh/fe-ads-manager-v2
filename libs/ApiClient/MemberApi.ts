import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import UserData from "../types/UserData";

export async function getMember(): Promise<ApiResponse<UserData[]>> {
    try {
        const response = await fetcher<ApiResponse<UserData[]>>("/api/member", {
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
export async function saveMember(params: UserData): Promise<ApiResponse<UserData>> {
    try {
        const response = await fetcher<ApiResponse<UserData>>("/api/member", {
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

export async function deleteMember(id: string) {
    try {
        const response = await fetcher<ApiResponse<any>>(`/api/member/${id}`, {
            method: "DELETE",
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

