import { fetcher } from "../fetch";

// get_ads_notify_facebook, save_notification_ads_fb
export async function get_all_fb_fetch_campaign_data_v20(since: string,until: string) {
  try {
    const response = await fetcher<any>(`/api/external/get_all_fb_fetch_campaign_data_v20?until=${until}&since=${since}`);
    return response;
  } catch (error: any) {
    return {
      status: false,
      data: null,
      message: error.message || "Lỗi đăng nhập",
    };
  }
}

export async function get_fb_campaigns_id_and_name() {
  try {
    const response = await fetcher<any>(`/api/external/get_fb_campaigns_id_and_name`);
    return response;
  } catch (error: any) {
    return {
      status: false,
      data: null,
      message: error.message || "Lỗi đăng nhập",
    };
  }
}

export async function changeStatusCampFacebook(campaign_id: any, status: any) {
  try {
    const response = await fetcher<any>(`/api/external/changeStatusCampFacebook?campaign_id=${campaign_id}&status=${status}`);
    return response;
  } catch (error: any) {
    return {
      status: false,
      data: null,
      message: error.message || "Lỗi đăng nhập",
    };
  }
}


export async function get_pos_cake_analytics_sale_server(until: string, since: string, filter: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API}/pos_cake_analytics?until=${until}&since=${since}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter)
    });
    return response;
  } catch (error: any) {
    return {
      "data": [],
      "pagination": null,
      "success": true,
      "summary": {
        "range": -1
      }
    };
  }
}


