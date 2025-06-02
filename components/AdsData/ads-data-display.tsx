"use client"

import { useState } from "react"
import { Row, Col, Typography, Space } from "antd"
import { AdCard } from "./ad-card"
import { AdFilters } from "./ad-filters"
import { AdStats } from "./ad-stats"
import type { AdCreative,FacebookAdsApiResponse } from "../../libs/types/FacebookAdsApiResponse"

const { Title } = Typography

export function AdsDataDisplay({adsData}: {adsData:FacebookAdsApiResponse}) {
  // Flatten all ad creatives from all campaigns
  const allAdCreatives = adsData.data.flatMap((campaign) => campaign.adcreatives.data)

  const [filteredAds, setFilteredAds] = useState<AdCreative[]>(allAdCreatives)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filterAds = (filter: string): void => {
    setActiveFilter(filter)
    if (filter === "all") {
      setFilteredAds(allAdCreatives)
    } else if (filter === "video") {
      setFilteredAds(allAdCreatives.filter((ad) => ad.video_id))
    } else if (filter === "image") {
      setFilteredAds(allAdCreatives.filter((ad) => ad.image_url && !ad.video_id))
    } else if (filter === "link") {
      setFilteredAds(
        allAdCreatives.filter(
          (ad) =>
            ad.link_url ||
            ad.object_story_spec?.link_data?.link ||
            ad.object_story_spec?.video_data?.call_to_action?.value?.link,
        ),
      )
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }} className="my-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Có ({adsData.data.length} trong chiến dịch)
        </Title>
        <AdStats
          totalAds={allAdCreatives.length}
          videoAds={allAdCreatives.filter((ad) => ad.video_id).length}
          imageAds={allAdCreatives.filter((ad) => ad.image_url && !ad.video_id).length}
        />
      </div>

      <AdFilters activeFilter={activeFilter} onFilterChange={filterAds} />

      <Row gutter={[24, 24]}>
        {filteredAds.map((ad, index) => (
          <Col key={ad.id || index} xs={24} sm={8} lg={4}>
            <AdCard ad={ad} />
          </Col>
        ))}
      </Row>
    </Space>
  )
}
