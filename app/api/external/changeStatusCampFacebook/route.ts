//app/api/external/changeStatusCampFacebook

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const campaign_id = searchParams.get("campaign_id") || "";
    const status = searchParams.get("status") || "";
    // 👇 Lấy cookie từ request gửi từ trình duyệt
    //const id_account_fb_mongo = req.cookies.get("id_account_fb_mongo")?.value || "";
    const id_account_fb_mongo = "683571cd53d57a325d240074";
    const data = await fetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API}/changeStatusCampFacebook?campaign_id=${campaign_id}&status=${status}`, {
        method: "GET",
        headers: {
            Cookie: `id_account_fb_mongo=${id_account_fb_mongo}`,
        }
    });
    const json_data= await data.json()
    return Response.json(json_data);
}