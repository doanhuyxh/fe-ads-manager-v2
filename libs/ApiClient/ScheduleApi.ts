import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import ScheduleData from "../types/Schedule";

export async function getSchedule(): Promise<ApiResponse<ScheduleData[]>> {
    try {
        const response = await fetcher<ApiResponse<ScheduleData[]>>("/api/scheduler", {
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
export async function saveSchedule(params: ScheduleData): Promise<ApiResponse<ScheduleData>> {
    try {
        const response = await fetcher<ApiResponse<ScheduleData>>("/api/scheduler", {
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

export async function deleteSchedule(id: string) {
    try {
        const response = await fetcher<ApiResponse<any>>(`/api/scheduler/${id}`, {
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


export async function updateSchedule(id: string) {
    try {
        const response = await fetcher<ApiResponse<any>>(`/api/scheduler/${id}/update-status`, {
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

