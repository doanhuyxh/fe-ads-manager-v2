import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import ReportUserFb from "../types/ReportUserFb";

export async function save_report_fb(data: ReportUserFb): Promise<ApiResponse<ReportUserFb>> {
    try {
        const response = await fetcher<ApiResponse<ReportUserFb>>("/api/report-user-fb", {
            method: "POST",
            body:data
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

export async function get_report_fb(): Promise<ApiResponse<ReportUserFb[]>> {
    try {
        const response = await fetcher<ApiResponse<ReportUserFb[]>>("/api/report-user-fb", {
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

export async function delete_report_fb(id:string) {
    try {
        const response = await fetcher<ApiResponse<ReportUserFb[]>>(`/api/report-user-fb/${id}`, {
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

