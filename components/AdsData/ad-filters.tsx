"use client"

import { Button, Space } from "antd"
import { AppstoreOutlined, VideoCameraOutlined, PictureOutlined, LinkOutlined } from "@ant-design/icons"

interface AdFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function AdFilters({ activeFilter, onFilterChange }: AdFiltersProps) {
  return (
    <Space wrap>
      <Button
        type={activeFilter === "all" ? "primary" : "default"}
        icon={<AppstoreOutlined />}
        onClick={() => onFilterChange("all")}
      >
        All Ads
      </Button>
      <Button
        type={activeFilter === "video" ? "primary" : "default"}
        icon={<VideoCameraOutlined />}
        onClick={() => onFilterChange("video")}
      >
        Video Ads
      </Button>
      <Button
        type={activeFilter === "image" ? "primary" : "default"}
        icon={<PictureOutlined />}
        onClick={() => onFilterChange("image")}
      >
        Image Ads
      </Button>
      <Button
        type={activeFilter === "link" ? "primary" : "default"}
        icon={<LinkOutlined />}
        onClick={() => onFilterChange("link")}
      >
        Link Ads
      </Button>
    </Space>
  )
}
