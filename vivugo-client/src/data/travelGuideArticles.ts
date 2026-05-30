export const travelGuideTopics = [
  'Bài viết mới',
  'Địa điểm',
  'Khám phá & Trải nghiệm',
  'Văn hoá & Lễ hội',
  'Đặc sản',
  'Tips',
  'Toplist',
  'SDGs',
  'VHDN'
] as const

export type TravelGuideTopic = (typeof travelGuideTopics)[number]

type ParagraphBlock = {
  type: 'paragraph'
  text: string
}

type HeadingBlock = {
  type: 'heading'
  text: string
}

type ListBlock = {
  type: 'list'
  items: string[]
}

type ImageBlock = {
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export type TravelGuideBlock = ParagraphBlock | HeadingBlock | ListBlock | ImageBlock

type DestinationRelation = {
  kind: 'destination'
  keyword: string
  ctaTitle: string
}

type TrendingRelation = {
  kind: 'trending'
  ctaTitle: string
}

type NoneRelation = {
  kind: 'none'
}

export type TravelGuideRelation = DestinationRelation | TrendingRelation | NoneRelation

export type TravelGuideArticle = {
  slug: string
  title: string
  summary: string
  topic: TravelGuideTopic
  coverImage: string
  publishedAt: string
  breadcrumbs: string[]
  blocks: TravelGuideBlock[]
  relation: TravelGuideRelation
}

export const travelGuideArticles: TravelGuideArticle[] = [
  {
    slug: 'ho-guom-net-dep-ha-noi',
    title: 'Hồ Gươm và phố cổ Hà Nội: lịch trình 1 ngày đi bộ nhẹ nhàng',
    summary: 'Gợi ý lịch đi từ sáng đến tối để vừa tham quan, vừa trải nghiệm ẩm thực đặc sắc của Hà Nội.',
    topic: 'Địa điểm',
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '30/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'Địa điểm nổi tiếng'],
    relation: {
      kind: 'destination',
      keyword: 'hà nội',
      ctaTitle: 'Tour Hà Nội liên quan'
    },
    blocks: [
      {
        type: 'paragraph',
        text: 'Nếu bạn chỉ có một ngày ở Hà Nội, khu vực Hồ Gươm và phố cổ là lựa chọn dễ đi và giàu trải nghiệm nhất. Không gian tập trung nhiều điểm văn hóa, ẩm thực và phố đi bộ.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1400&q=80',
        alt: 'Hồ Gươm buổi sáng',
        caption: 'Hồ Gươm là điểm khởi đầu phù hợp cho lịch trình nửa ngày đầu.'
      },
      {
        type: 'heading',
        text: 'Khung giờ gợi ý'
      },
      {
        type: 'list',
        items: [
          '07:00 - 09:00: đi bộ quanh Hồ Gươm, ghé đền Ngọc Sơn.',
          '09:30 - 11:30: thăm Văn Miếu hoặc Hoàng thành Thăng Long.',
          '12:00 - 14:00: ăn trưa đặc sản như bún chả, phở hoặc bún thang.',
          '15:00 - 17:30: dạo phố cổ, cà phê, mua quà.',
          'Tối: thưởng thức ẩm thực đường phố và phố đi bộ cuối tuần.'
        ]
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1577906714658-18d0fc2f9f3e?auto=format&fit=crop&w=1400&q=80',
        alt: 'Phố cổ Hà Nội',
        caption: 'Phố cổ phù hợp cho trải nghiệm ẩm thực và văn hóa địa phương.'
      }
    ]
  },
  {
    slug: 'kinh-nghiem-trang-an-ninh-binh',
    title: 'Kinh nghiệm đi Tràng An - Ninh Bình 2N1Đ cho nhóm bạn',
    summary: 'Chi tiết lịch trình, giờ đi thuyền và các điểm check-in phù hợp cuối tuần.',
    topic: 'Khám phá & Trải nghiệm',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '29/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'Khám phá & Trải nghiệm'],
    relation: {
      kind: 'destination',
      keyword: 'ninh bình',
      ctaTitle: 'Tour Ninh Bình đang mở bán'
    },
    blocks: [
      {
        type: 'paragraph',
        text: 'Ninh Bình có lợi thế gần Hà Nội, dễ đi bằng xe trong ngày hoặc 2N1Đ. Tràng An, Hang Múa và Bái Đính là bộ ba phù hợp cho nhóm bạn trẻ.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1400&q=80',
        alt: 'Tràng An Ninh Bình',
        caption: 'Cảnh quan sông núi là điểm nhấn lớn nhất của Ninh Bình.'
      },
      {
        type: 'heading',
        text: 'Mẹo đi thực tế'
      },
      {
        type: 'list',
        items: [
          'Đi sớm trước 9h để tránh nắng và đỡ đông.',
          'Chuẩn bị giày đế bám nếu leo Hang Múa.',
          'Ưu tiên đặt tour trọn gói nếu đi nhóm 4-6 người để tối ưu chi phí.'
        ]
      }
    ]
  },
  {
    slug: 'san-uu-dai-tour-5-den-50',
    title: 'Săn ưu đãi tour 5% - 50%: thời điểm đặt và điều kiện áp dụng',
    summary: 'Tổng hợp các nguyên tắc giúp bạn chọn đúng deal, tránh phát sinh không cần thiết.',
    topic: 'Tips',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '30/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'Tips'],
    relation: {
      kind: 'trending',
      ctaTitle: 'Xem các tour hot hiện nay'
    },
    blocks: [
      {
        type: 'paragraph',
        text: 'Deal cao không phải lúc nào cũng là rẻ nhất. Điều quan trọng là so sánh tổng giá trị dịch vụ đi kèm: khách sạn, bữa ăn, vé tham quan và điều kiện hoàn/hủy.'
      },
      {
        type: 'heading',
        text: '3 bước kiểm tra trước khi chốt'
      },
      {
        type: 'list',
        items: [
          'Đọc kỹ điều kiện khởi hành, số chỗ tối thiểu và phụ thu.',
          'So sánh giá sau giảm với giá tiêu chuẩn của cùng hành trình.',
          'Ưu tiên tour có lịch trình rõ theo ngày và có hỗ trợ 24/7.'
        ]
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1400&q=80',
        alt: 'Lập kế hoạch du lịch',
        caption: 'Lập kế hoạch sớm giúp tăng cơ hội chọn được deal tốt.'
      }
    ]
  },
  {
    slug: 'du-lich-xanh-giam-rac-thai',
    title: 'Du lịch xanh: 7 thói quen nhỏ giúp giảm rác thải khi đi tour',
    summary: 'Các thói quen dễ áp dụng để chuyến đi thân thiện môi trường hơn.',
    topic: 'SDGs',
    coverImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '27/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'SDGs'],
    relation: { kind: 'none' },
    blocks: [
      {
        type: 'paragraph',
        text: 'Du lịch xanh không nhất thiết phải phức tạp. Chỉ cần thay đổi một vài thói quen hằng ngày, lượng rác phát sinh trong toàn bộ chuyến đi đã giảm đáng kể.'
      },
      {
        type: 'list',
        items: [
          'Mang bình nước cá nhân và túi vải gấp gọn.',
          'Hạn chế đồ dùng một lần trong khách sạn.',
          'Ưu tiên sản phẩm địa phương thay vì đồ đóng gói quá mức.'
        ]
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1400&q=80',
        alt: 'Du lịch xanh',
        caption: 'Mỗi lựa chọn nhỏ đều góp phần giảm tác động môi trường.'
      }
    ]
  },
  {
    slug: 'am-thuc-ha-long-2n1d',
    title: 'Ăn gì ở Hạ Long trong 2N1Đ: hải sản, quán địa phương và khung giờ nên đi',
    summary: 'Gợi ý món đặc trưng, khu ăn uống và thời điểm hợp lý để tránh đông.',
    topic: 'Đặc sản',
    coverImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '26/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'Đặc sản'],
    relation: {
      kind: 'destination',
      keyword: 'hạ long',
      ctaTitle: 'Tour Hạ Long phù hợp'
    },
    blocks: [
      {
        type: 'paragraph',
        text: 'Hạ Long không chỉ có du thuyền và cảnh biển. Ẩm thực địa phương là phần trải nghiệm đáng thử nếu bạn đi theo hành trình 2 ngày 1 đêm.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1400&q=80',
        alt: 'Hải sản Hạ Long',
        caption: 'Hải sản tươi là ưu tiên của nhiều nhóm khách khi đến Hạ Long.'
      }
    ]
  },
  {
    slug: 'top-10-tour-ban-chay-thang',
    title: 'Top 10 tour đang được đặt nhiều nhất tháng này',
    summary: 'Danh sách tour nổi bật theo nhu cầu thực tế và mức quan tâm của khách hàng.',
    topic: 'Toplist',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    publishedAt: '28/05/2026',
    breadcrumbs: ['Cẩm nang du lịch', 'Toplist'],
    relation: { kind: 'trending', ctaTitle: 'Xem bảng tour trending' },
    blocks: [
      {
        type: 'paragraph',
        text: 'Các tour 2N1Đ vẫn là nhóm được chọn nhiều nhất nhờ cân bằng giữa thời gian và ngân sách. Nhóm biển đảo và văn hóa địa phương tăng tốt ở mùa cao điểm.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80',
        alt: 'Top tour nổi bật',
        caption: 'Xu hướng đặt tour tập trung vào lịch trình ngắn và linh hoạt.'
      }
    ]
  }
]

export const travelGuideArticleMap = new Map(travelGuideArticles.map((article) => [article.slug, article]))
