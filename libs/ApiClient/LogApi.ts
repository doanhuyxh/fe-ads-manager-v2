import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import LogRespone from "../types/LogRespone";

export async function getLog(page: number, limit: number, search: string): Promise<ApiResponse<LogRespone>> {
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

export async function saveLog(level: string, message: string) {
    try {
        const time = new Date();
        const formattedTime = time.getFullYear() +
            '-' + String(time.getMonth() + 1).padStart(2, '0') +
            '-' + String(time.getDate()).padStart(2, '0') +
            ' ' + String(time.getHours()).padStart(2, '0') +
            ':' + String(time.getMinutes()).padStart(2, '0');
            
        const response = await fetcher<ApiResponse<LogRespone>>(`/api/logs`, {
            method: "POST",
            body: JSON.stringify({
                level,
                message,
                time: formattedTime
            })
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

