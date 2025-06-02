// Định nghĩa kiểu cho "object_story_spec"
export interface ObjectStorySpec {
  page_id: string
  instagram_user_id?: string
  video_data?: {
    video_id: string
    title: string
    message: string
    call_to_action?: {
      type: string
      value: {
        app_destination?: string
        link?: string
      }
    }
    image_url?: string
    image_hash?: string
    page_welcome_message?: string
  }
  link_data?: {
    link: string
    message: string
    name: string
    image_hash: string
    call_to_action?: {
      type: string
      value?: {
        app_destination?: string
      }
    }
    page_welcome_message?: string
    caption?: string
    child_attachments?: Array<{
      link: string
      image_hash: string
      name: string
      call_to_action?: {
        type: string
      }
    }>
    multi_share_end_card?: boolean
    multi_share_optimized?: boolean
    image_crops?: {
      [key: string]: number[][]
    }
    use_flexible_image_aspect_ratio?: boolean
  }
}

// Định nghĩa kiểu cho một ad creative
export interface AdCreative {
  id: string
  body?: string
  title?: string
  thumbnail_url?: string
  video_id?: string
  link_url?: string
  image_url?: string
  object_story_spec?: ObjectStorySpec
}

// Định nghĩa kiểu cho phần adcreatives
export interface AdCreatives {
  data: AdCreative[]
}

// Định nghĩa kiểu cho một quảng cáo
export interface FacebookAd {
  id: string
  name: string
  adcreatives: AdCreatives
}

// Định nghĩa kiểu cho dữ liệu trả về từ API
export interface FacebookAdsApiResponse {
  data: FacebookAd[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
  }
}
