"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, Tag, Spin } from "antd"
import type { AdCreative } from "../../libs/types/FacebookAdsApiResponse"
import { copyToClipboard } from "../../libs/web-api"
import callToActionLabels from "../../libs/utils/action_fb"

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
      <div className="w-full h-[200px] flex justify-center items-center bg-gray-100">
        <Spin />
      </div>
    )
  }

  if (videoSrc) {
    return (
      <video
        src={videoSrc}
        controls
        className="w-full max-h-[300px] mx-auto rounded-md"
      />
    )
  }

  return (
    <div
      className="relative w-full cursor-pointer"
      onClick={() => {
        copyToClipboard(ad.object_story_spec?.video_data?.image_url || ad.thumbnail_url)
      }}
    >
      {ad.thumbnail_url ? (
        <Image
          src={ad.object_story_spec?.video_data?.image_url || ad.thumbnail_url}
          alt="Thumbnail fallback"
          layout="responsive"
          width={600}
          height={600}
          objectFit="contain"
          unoptimized
          className="rounded-md"
        />
      ) : (
        <div className="h-[200px] flex justify-center items-center text-gray-400 bg-gray-100">
          Không có ảnh thay thế
        </div>
      )}
      <p className="text-center text-sm text-gray-400 py-2">Không lấy được video</p>
    </div>
  )
}

// Image Renderer Component
function ImageRenderer({ ad }: { ad: AdCreative }) {
  if (ad.image_url || ad.thumbnail_url) {
    return (
      <div
        className="relative w-full cursor-pointer"
        onClick={() => {
          copyToClipboard(ad.image_url || ad.thumbnail_url)
        }}
      >
        <Image
          src={ad.image_url || ad.thumbnail_url || ""}
          alt={ad.title || "Ad creative"}
          layout="responsive"
          width={600}
          height={600}
          objectFit="contain"
          unoptimized
          className="rounded-md"
        />
      </div>
    )
  }

  return (
    <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-100">
      Không có ảnh
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
    <div className="relative w-full bg-gray-50 rounded-md overflow-hidden">
      {adType === "Video" ? (
        <VideoRenderer videoSrc={videoSrc} loadingVideo={loadingVideo} ad={ad} />
      ) : (
        <ImageRenderer ad={ad} />
      )}

      <div className="absolute top-2 left-2 z-10">
        <Tag color={getTagColor(adType)}>{adType}</Tag>
      </div>
    </div>
  )
}

//Ad Body
function AdBody({ body }: { body: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;

  if (!body) {
    return <p className="text-sm text-gray-700">Không lấy được nội dung ads</p>;
  }

  const shouldTruncate = body.length > maxLength;
  const displayedText = expanded || !shouldTruncate ? body : body.slice(0, maxLength) + "...";

  return (
    <div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{displayedText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="!text-blue-600 hover:underline text-sm mt-1 cursor-pointer"
        >
          {expanded ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

// Ad Content Component
function AdContent({ ad, callToAction }: { ad: AdCreative; callToAction: string | null }) {
  return (
    <div className="mt-4 space-y-2 flex flex-col gap-2">
      <h2 className="text-base font-semibold text-gray-900">
        {ad.title || "Không lấy được tiêu đề ads"}
      </h2>

      <AdBody body={ad.body ||''} />

      {callToAction && (
        <Tag className="text-xs">  {callToActionLabels[callToAction] || callToAction.replace(/_/g, " ")}</Tag>
      )}

      <p className="text-[12px] text-gray-400">ADS ID: {ad.id}</p>
    </div>
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
    if (ad.image_url || ad.thumbnail_url) return "Image"
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
    <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 mb-4">
      <MediaCover adType={adType} ad={ad} videoSrc={videoSrc} loadingVideo={loadingVideo} />
      <AdContent ad={ad} callToAction={callToAction} />
    </div>
  )
}
