import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import LogRespone from "../types/LogRespone";

export async function getLog(page:number, limit:number, search:string): Promise<ApiResponse<LogRespone>> {
    try {
        const response = await fetcher<ApiResponse<LogRespone>>(`/api/logs?page=${page}&limit=${limit}&search=${search}`, {
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