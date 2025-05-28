import { fetcher } from "../fetch";
import ApiResponse from "../types/ApiResponse";
import Company from "../types/Company";

export async function getCompany(): Promise<ApiResponse<Company[]>> {
    try {
        const response = await fetcher<ApiResponse<Company[]>>("/api/company", {
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


export async function saveCompnay(item: Company): Promise<ApiResponse<Company>> {
    try {   
        const response = await fetcher<ApiResponse<Company>>("/api/company", {
            method: "POST",
            body: item
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

export async function deleteCompany(id: string) {
    try {
        const response = await fetcher<ApiResponse<Company>>(`/api/company/${id}`, {
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

export async function getCurrentCompany() : Promise<ApiResponse<Company[]>> {
    try {
        const response = await fetcher<ApiResponse<Company[]>>(`/api/company/current`, {
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

export async function changeCurrentCompany(id:string) : Promise<ApiResponse<Company[]>> {
    try {
        const response = await fetcher<ApiResponse<Company[]>>(`/api/company/current?id=${id}`, {
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
