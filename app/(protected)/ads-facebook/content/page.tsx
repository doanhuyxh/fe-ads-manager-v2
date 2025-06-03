"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { get_ads_content_in_campain_id } from '../../../../libs/ApiClient/ExternalDataApi'
import { AdsDataDisplay } from '../../../../components/AdsData/ads-data-display'
import { Header } from '../../../../components/AdsData/ads-header'

export default function Page() {
    const [data, setData] = useState<any>([])
    const [campaign_name, setCampaign_name] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const campaignId = searchParams.get('campaign_id') || ""

    const loadData = async () => {
        try {
            let resData = await get_ads_content_in_campain_id(campaignId)
            if (!resData.error) {
                setData(resData)
            } else {
                setError("Không lấy được quảng cáo")
            }
        } catch (err) {
            setError("Không lấy được quảng cáo")
            setData(null)
        }
    }

    useEffect(() => {
        setCampaign_name(localStorage.getItem("campaign_name") || "")
        loadData()
    }, [])

    return (
        <>
            <Header name={`${campaign_name} `} />
            {error ? (
                <div style={{ color: "red", textAlign: "center", marginTop: 20 }}>
                    {error}
                </div>
            ) : (
                data && data.data && <AdsDataDisplay adsData={data} />
            )}
        </>
    )
}
