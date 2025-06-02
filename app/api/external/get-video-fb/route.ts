// app/api/external/get-video-fb/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Company from "../../../../models/Company";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get("video_id") || "";

    if (!video_id) {
        return NextResponse.json({ error: "Missing video_id" }, { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesObject = Object.fromEntries(
        cookieHeader.split(";").map((c) => c.trim().split("="))
    );
    const id_account_fb_mongo = cookiesObject["id_account_fb_mongo"] || "";

    try {
        const company = await Company.findOne({ _id: new ObjectId(id_account_fb_mongo) });
        if (!company?.get("fbToken")) {
            return NextResponse.json({ error: "Missing Facebook token" }, { status: 401 });
        }

        const token = company.get("fbToken");

        const url = `https://graph.facebook.com/v19.0/${video_id}?fields=permalink_url,source&access_token=${token}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json(
                { error: "Failed to fetch video from Facebook", detail: errText },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Unexpected error", detail: error.message },
            { status: 500 }
        );
    }
}
