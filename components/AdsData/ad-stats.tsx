"use client"

import { Statistic, Card, Row, Col } from "antd"
import { AppstoreOutlined, VideoCameraOutlined, PictureOutlined } from "@ant-design/icons"
import { JSX } from "react"

interface AdStatsProps {
  totalAds: number
  videoAds: number
  imageAds: number
}

export function AdStats({ totalAds, videoAds, imageAds }: AdStatsProps) {
  const cardStyle: React.CSSProperties = {
    borderRadius: 12,
    padding:10,
    textAlign: "center",
    background: "#f9f9f9",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  }

  const renderValue = (icon: JSX.Element, value: number) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {icon}
      <span>{value}</span>
    </div>
  )

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card style={cardStyle} size="small">
          <Statistic
            title="Total"
            value={totalAds}
            valueRender={() =>
              renderValue(<AppstoreOutlined style={{ fontSize: 24, color: "#666" }} />, totalAds)
            }
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={cardStyle} size="small">
          <Statistic
            title="Video"
            value={videoAds}
            valueRender={() =>
              renderValue(<VideoCameraOutlined style={{ fontSize: 24, color: "#f5222d"}} />, videoAds)
            }
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={cardStyle} size="small">
          <Statistic
            title="Image"
            value={imageAds}
            valueRender={() =>
              renderValue(<PictureOutlined style={{ fontSize: 24, color: "#1890ff" }} />, imageAds)
            }
          />
        </Card>
      </Col>
    </Row>
  )
}
