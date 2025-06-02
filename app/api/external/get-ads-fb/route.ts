import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Company from "../../../../models/Company";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const campaign_id = searchParams.get("campaign_id") || "";

    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesObject = Object.fromEntries(
        cookieHeader.split(";").map((c) => c.trim().split("="))
    );
    const id_account_fb_mongo = cookiesObject["id_account_fb_mongo"] || "";
    const company = await Company.findOne({ _id: new ObjectId(id_account_fb_mongo) });

    if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const fbToken = company.get("fbToken");
    if (!fbToken) {
        return NextResponse.json({ error: "Facebook token not found" }, { status: 400 });
    }

    const baseUrl = `https://graph.facebook.com/v19.0/${campaign_id}/ads`;
    const fields = "name,adcreatives{body,title,link_url,image_url,thumbnail_url,video_id,object_story_spec}";
    
    let allData: any[] = [];
    let afterCursor: string | null = null;

    try {
        do {
            // Build URL with after cursor if exists
            const url = new URL(baseUrl);
            url.searchParams.set("fields", fields);
            url.searchParams.set("access_token", fbToken);
            if (afterCursor) {
                url.searchParams.set("after", afterCursor);
            }

            const res = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errText = await res.text();
                return NextResponse.json(
                    { error: "Failed to fetch from Facebook", detail: errText },
                    { status: res.status }
                );
            }

            const data = await res.json();

            // Gộp dữ liệu ads vào allData
            if (data.data && Array.isArray(data.data)) {
                allData = allData.concat(data.data);
            }

            // Lấy cursor next page nếu có
            afterCursor = data.paging?.cursors?.after || null;

        } while (afterCursor);

        // Trả về tất cả dữ liệu đã lấy
        return NextResponse.json({ data: allData });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Unexpected error", detail: error.message },
            { status: 500 }
        );
    }
}
