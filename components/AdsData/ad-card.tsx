"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, Tag, Typography, Spin } from "antd"
import type { AdCreative } from "../../libs/types/FacebookAdsApiResponse"
import { copyToClipboard } from "../../libs/web-api"

const { Paragraph, Text } = Typography

interface AdCardProps {
  ad: AdCreative
}

// Video Renderer Component
function VideoRenderer({
  videoSrc,
  loadingVideo,
  ad,
}: {
  videoSrc: string | null
  loadingVideo: boolean
  ad: AdCreative
}) {
  if (loadingVideo) {
    return (
      <div
        style={{
          width: 320,
          height: 180,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </div>
    )
  }

  if (videoSrc) {
    return (
      <video
        src={videoSrc}
        controls
        style={{
          width: "auto",
          height: 200,
          display: "block",
          margin:'auto'
        }}
      />
    )
  }
  // Video failed to load - show fallback
  return (
    <>
      {ad.thumbnail_url ? (
        <div style={{ width: "100%", position: "relative" }} onClick={()=>{
            copyToClipboard(ad.object_story_spec?.video_data?.image_url || ad.thumbnail_url)
        }}>
          <Image
            src={ad.object_story_spec?.video_data?.image_url || ad.thumbnail_url}
            alt="Thumbnail fallback"
            layout="responsive"
            width={600}
            height={600}
            objectFit="contain"
            unoptimized
          />
        </div>
      ) : (
        <div
          style={{
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#999",
          }}
        >
          Không có ảnh thay thế
        </div>
      )}
      <div style={{ textAlign: "center", color: "#999", padding: 8 }}>Không lấy được video</div>
    </>
  )
}

// Image Renderer Component
function ImageRenderer({ ad }: { ad: AdCreative }) {
  if (ad.image_url || ad.thumbnail_url) {
    return (
      <div style={{ width: "100%", position: "relative" }} onClick={()=>{
            copyToClipboard(ad.image_url || ad.thumbnail_url)
        }}>
        <Image
          src={ad.image_url || ad.thumbnail_url || ""}
          alt={ad.title || "Ad creative"}
          layout="responsive"
          width={600}
          height={600}
          objectFit="contain"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        color: "#999",
      }}
    >
      No image available
    </div>
  )
}

// Media Cover Component
function MediaCover({
  adType,
  ad,
  videoSrc,
  loadingVideo,
}: {
  adType: string
  ad: AdCreative
  videoSrc: string | null
  loadingVideo: boolean
}) {
  const getTagColor = (type: string): string => {
    switch (type) {
      case "Video":
        return "red"
      case "Image":
        return "blue"
      default:
        return "default"
    }
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#f5f5f5", position: "relative" }}>
      {adType === "Video" ? (
        <VideoRenderer videoSrc={videoSrc} loadingVideo={loadingVideo} ad={ad} />
      ) : (
        <ImageRenderer ad={ad} />
      )}

      <div style={{ position: "absolute", top: 8, left: 8 }}>
        <Tag color={getTagColor(adType)}>{adType}</Tag>
      </div>
    </div>
  )
}

// Ad Content Component
function AdContent({ ad, callToAction }: { ad: AdCreative; callToAction: string | null }) {
  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
        {ad.title || "Không lấy được tiêu đề ads"}
      </Typography.Title>

      <Paragraph style={{ marginBottom: 6, color: "#666" }}>
        {ad.body || "Không lấy được nội dung ads"}
      </Paragraph>

      {callToAction && <Tag style={{ marginBottom: 8 }}>{callToAction.replace(/_/g, " ")}</Tag>}

      <div style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          ADS ID: {ad.id}
        </Text>
      </div>
    </>
  )
}

// Main AdCard Component
export function AdCard({ ad }: AdCardProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      if (!ad.video_id) return
      setLoadingVideo(true)
      try {
        const res = await fetch(`/api/external/get-video-fb?video_id=${ad.object_story_spec?.video_data?.video_id || ad.video_id}`)
        const data = await res.json()
        if (data.source) {
          setVideoSrc(data.source)
          setVideoFailed(false)
        } else {
          setVideoFailed(true)
        }
      } catch (err) {
        console.error("Failed to load video", err)
        setVideoFailed(true)
      } finally {
        setLoadingVideo(false)
      }
    }
    fetchVideo()
  }, [ad.video_id])

  const getAdType = (): string => {
  if (ad.video_id) return "Video"
  if (ad.image_url || ad.thumbnail_url) return "Image" // Thêm thumbnail_url
  return "Text"
}

  const getCallToAction = (): string | null => {
    return (
      ad.object_story_spec?.link_data?.call_to_action?.type ||
      ad.object_story_spec?.video_data?.call_to_action?.type ||
      null
    )
  }

  const adType = getAdType()
  const callToAction = getCallToAction()

  return (
    <Card
      hoverable
      style={{ width: "100%", padding: 10 }}
      cover={<MediaCover adType={adType} ad={ad} videoSrc={videoSrc} loadingVideo={loadingVideo} />}
    >
      <AdContent ad={ad} callToAction={callToAction} />
    </Card>
  )
}
