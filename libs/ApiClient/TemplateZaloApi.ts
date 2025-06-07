import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import TemplateZaloData from "../types/TemplateZalo";

export async function getTemplateZalo(): Promise<ApiResponse<TemplateZaloData[]>> {
    try {
        const response = await fetcher<ApiResponse<TemplateZaloData[]>>("/api/template-zalo", {
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
export async function saveTemplateZalo(params: TemplateZaloData): Promise<ApiResponse<TemplateZaloData>> {
    try {
        const response = await fetcher<ApiResponse<TemplateZaloData>>("/api/template-zalo", {
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

export async function deleteTemplateZalo(id: string) {
    try {
        const response = await fetcher<ApiResponse<any>>(`/api/template-zalo/${id}`, {
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

