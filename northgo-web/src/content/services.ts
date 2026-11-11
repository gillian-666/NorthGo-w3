import type { ServiceSlug } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export type ServiceSection = {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
};

export type ServiceContent = {
  slug: ServiceSlug;
  title: string;
  metaDescription: string;
  hero: string;
  intro: string;
  sections: ServiceSection[];
};

const en: Record<ServiceSlug, ServiceContent> = {
  "freight-logistics": {
    slug: "freight-logistics",
    title: "Freight Logistics",
    metaDescription:
      "End-to-end freight forwarding by ocean, air, and land with customs clearance support.",
    hero: "With over 30 years of experience, we offer end-to-end logistics solutions covering road, rail, sea, and air.",
    intro:
      "Our specialists design optimized routes and transport plans so every shipment moves securely, efficiently, and on schedule—locally or globally.",
    sections: [
      {
        id: "ocean",
        title: "Ocean Freight",
        body: "From import to export, Northgo delivers secure sea freight with FCL and LCL options, major carrier access, and origin/destination support.",
        bullets: [
          "FCL with end-to-end transparency",
          "LCL network scale across our customer community",
          "Direct contracts across major alliances",
          "Personalised help on cost, route, and transit time",
        ],
      },
      {
        id: "air",
        title: "Air Freight",
        body: "Best-in-class air freight with granular visibility and end-to-end coordination for time-critical cargo.",
      },
      {
        id: "land",
        title: "Land Transport",
        body: "Integrated trucking partners and tracking tools keep cargo moving safely from port or airport to final destination.",
      },
      {
        id: "customs",
        title: "Customs Clearance",
        body: "Our customs team helps validate classifications and keep cross-border shipments compliant and moving.",
      },
    ],
  },
  "project-logistics": {
    slug: "project-logistics",
    title: "Project Logistics",
    metaDescription:
      "Heavy-lift and project cargo logistics from planning and engineering to door-to-door delivery.",
    hero: "Comprehensive services for turnkey projects—from massive equipment to the smallest components.",
    intro:
      "Complex projects demand exacting coordination. We manage oversized, heavy, and high-value cargo with global reach and local expertise.",
    sections: [
      {
        id: "engineering",
        title: "Engineering Solutions",
        body: "In-house engineering for complex and large-scale moves, method statements, and technical documentation.",
      },
      {
        id: "scope",
        title: "Our Services",
        body: "From inception to delivery we oversee every aspect for timely, cost-effective completion.",
        bullets: [
          "Chartering and freight management",
          "Lifting services and heavy-lift transport",
          "Route survey and feasibility studies",
          "Door-to-door multimodal transportation",
          "Customs clearance and consultation",
          "Real-time visibility and project management",
        ],
      },
    ],
  },
  "warehouse-logistics": {
    slug: "warehouse-logistics",
    title: "Warehouse Logistics",
    metaDescription:
      "Secure warehousing at Taichung Port with WMS, value-added services, and offshore wind logistics.",
    hero: "Secure, efficient, and customised storage solutions across diverse industries.",
    intro:
      "Our Taichung Port facilities sit on major transport routes—ideal for general cargo and specialised offshore project storage.",
    sections: [
      {
        id: "facilities",
        title: "Strategically located facilities",
        body: "Easy access to shipping routes and highways reduces transit time and strengthens supply-chain connectivity.",
      },
      {
        id: "wms",
        title: "Advanced inventory management",
        body: "WMS provides real-time visibility, accurate stock control, optimised space use, and efficient order processing.",
      },
      {
        id: "vas",
        title: "Value-added services",
        body: "Pick and pack, kitting, labeling, cargo inspection, repackaging, plus container leasing and sales including DNV-certified units.",
      },
      {
        id: "offshore",
        title: "Offshore logistics expertise",
        body: "Specialised support for offshore wind and maritime equipment storage, handling, and onward transport.",
      },
    ],
  },
  "shipping-agency": {
    slug: "shipping-agency",
    title: "Shipping Agency",
    metaDescription:
      "Full-range shipping agency services for smooth and efficient port operations.",
    hero: "Full-range agency services that keep port calls efficient—from berthing to crew support.",
    intro:
      "We coordinate vessel operations with local port knowledge so owners and charterers can focus on the voyage.",
    sections: [
      {
        id: "port",
        title: "Port operations",
        body: "Berthing arrangements, documentation, and on-the-ground coordination for reliable turnarounds.",
      },
      {
        id: "crew",
        title: "Crew and husbandry",
        body: "Crew changes, provisions, and husbandry support tailored to each call.",
      },
      {
        id: "owners",
        title: "Owner representation",
        body: "Protecting owner and charterer interests with transparent communication throughout the port stay.",
      },
    ],
  },
};

const zhTw: Record<ServiceSlug, ServiceContent> = {
  "freight-logistics": {
    slug: "freight-logistics",
    title: "貨運物流",
    metaDescription: "涵蓋海運、空運、陸運與報關的端到端貨運代理服務。",
    hero: "憑藉超過 30 年經驗，我們提供涵蓋公路、鐵路、海運與空運的端到端物流解決方案。",
    intro: "專業團隊為每票貨物規劃最佳路徑與運輸方案，確保安全、效率與準時——無論本地或全球。",
    sections: [
      {
        id: "ocean",
        title: "海運",
        body: "進出口海運服務涵蓋整櫃與併櫃、主要航商艙位，以及起訖地在地支援。",
        bullets: [
          "整櫃（FCL）端到端可視化",
          "併櫃（LCL）網路規模效益",
          "主要聯盟直接約價",
          "依成本、航線與航程提供客製建議",
        ],
      },
      {
        id: "air",
        title: "空運",
        body: "針對時效敏感貨物，提供高可見度與端到端協調的空運體驗。",
      },
      {
        id: "land",
        title: "陸運",
        body: "整合卡車夥伴與追蹤工具，確保貨物從港口或機場安全送達最終目的地。",
      },
      {
        id: "customs",
        title: "報關",
        body: "報關團隊協助確認稅則分類，讓跨境貨物合規且順暢通行。",
      },
    ],
  },
  "project-logistics": {
    slug: "project-logistics",
    title: "專案物流",
    metaDescription: "超大件與專案貨物物流，從規劃、工程到門到門交付。",
    hero: "為交鑰匙專案提供完整服務——從大型設備到最小元件。",
    intro: "複雜專案需要精準協調。我們以全球網絡與在地專業，處理超大件、重件與高價值貨物。",
    sections: [
      {
        id: "engineering",
        title: "工程解決方案",
        body: "內部工程團隊可為大型複雜運輸擬定方法說明與技術文件。",
      },
      {
        id: "scope",
        title: "服務範圍",
        body: "從專案啟動到交付，全面掌握時程與成本。",
        bullets: [
          "租船與貨運管理",
          "吊裝與重件運輸",
          "路線勘測與可行性研究",
          "門到門多式聯運",
          "報關與諮詢",
          "即時可視與專案管理",
        ],
      },
    ],
  },
  "warehouse-logistics": {
    slug: "warehouse-logistics",
    title: "倉儲物流",
    metaDescription: "台中港倉儲、WMS、加值服務與離岸風電物流。",
    hero: "為多元產業提供安全、高效且可客製的倉儲方案。",
    intro: "台中港倉儲坐落主要運輸節點，適合一般貨物與離岸專案設備儲存。",
    sections: [
      {
        id: "facilities",
        title: "戰略位置",
        body: "便捷連接航線與公路，縮短運送時間並強化供應鏈連通性。",
      },
      {
        id: "wms",
        title: "進階庫存管理",
        body: "WMS 提供即時可視、精準庫存、空間優化與高效訂單處理。",
      },
      {
        id: "vas",
        title: "加值服務",
        body: "揀貨包裝、組套、貼標、查驗重包，以及貨櫃租售（含 DNV 認證貨櫃）。",
      },
      {
        id: "offshore",
        title: "離岸物流專長",
        body: "支援離岸風電與海事設備的倉儲、吊裝與後續運輸。",
      },
    ],
  },
  "shipping-agency": {
    slug: "shipping-agency",
    title: "船務代理",
    metaDescription: "完整船務代理服務，確保港口作業順暢高效。",
    hero: "從靠泊到船員支援，提供完整代理服務，讓靠港作業更有效率。",
    intro: "我們結合在地港口知識協調船舶作業，讓船東與租家專注航程本身。",
    sections: [
      {
        id: "port",
        title: "港口作業",
        body: "靠泊安排、文件處理與現場協調，確保可靠周轉。",
      },
      {
        id: "crew",
        title: "船員與後勤",
        body: "依每航次需求提供船員更換、補給與後勤支援。",
      },
      {
        id: "owners",
        title: "船東代表",
        body: "以透明溝通保障船東與租家在港期間的權益。",
      },
    ],
  },
};

const ja: Record<ServiceSlug, ServiceContent> = {
  "freight-logistics": {
    slug: "freight-logistics",
    title: "フレイト物流",
    metaDescription: "海上・航空・陸上輸送と通関を含むエンドツーエンドのフォワーディング。",
    hero: "30年以上の経験に基づき、道路・鉄道・海上・航空をカバーする一気通貫の物流を提供します。",
    intro: "最適なルートと輸送計画を設計し、国内外の貨物を安全・効率・定時で運びます。",
    sections: [
      {
        id: "ocean",
        title: "海上輸送",
        body: "輸出入の海上輸送で FCL／LCL、主要船社アクセス、現地支援を提供します。",
        bullets: [
          "FCL の可視化",
          "LCL ネットワークのスケールメリット",
          "主要アライアンスとの直接契約",
          "コスト・ルート・リードタイムの最適化支援",
        ],
      },
      {
        id: "air",
        title: "航空輸送",
        body: "時間厳守の貨物向けに高い可視性と一気通貫の調整を提供します。",
      },
      {
        id: "land",
        title: "陸上輸送",
        body: "提携トラックと追跡ツールで、港・空港から最終目的地まで安全に接続します。",
      },
      {
        id: "customs",
        title: "通関",
        body: "品目分類の確認など、越境貨物のコンプライアンスと円滑な移動を支援します。",
      },
    ],
  },
  "project-logistics": {
    slug: "project-logistics",
    title: "プロジェクト物流",
    metaDescription: "重量物・プロジェクト貨物の計画からドアツードア納品まで。",
    hero: "ターンキー案件向けに、大型機材から細部部品まで包括的に対応します。",
    intro: "複雑な案件には精密な調整が必要です。超大型・重量・高価値貨物をグローバルと現地の知見で運ぶ。",
    sections: [
      {
        id: "engineering",
        title: "エンジニアリング",
        body: "社内エンジニアが大規模案件向けの工法説明と技術文書を作成します。",
      },
      {
        id: "scope",
        title: "サービス範囲",
        body: "着手から納品まで、スケジュールとコストを一貫管理します。",
        bullets: [
          "用船・フレイト管理",
          "吊り上げ・重量物輸送",
          "ルート調査とフィージビリティ",
          "ドアツードア複合輸送",
          "通関とコンサルティング",
          "リアルタイム可視化とプロジェクト管理",
        ],
      },
    ],
  },
  "warehouse-logistics": {
    slug: "warehouse-logistics",
    title: "倉庫物流",
    metaDescription: "台中港の倉庫、WMS、付加価値サービス、洋上風力物流。",
    hero: "多様な業種に向けた安全で柔軟な保管ソリューション。",
    intro: "台中港の倉庫は主要輸送ルートに位置し、一般貨物から洋上プロジェクト機材まで対応します。",
    sections: [
      {
        id: "facilities",
        title: "戦略的ロケーション",
        body: "航路・高速道路へのアクセスでリードタイムを短縮し、サプライチェーンをつなぎます。",
      },
      {
        id: "wms",
        title: "高度な在庫管理",
        body: "WMS によりリアルタイム可視化、正確な在庫、空間最適化、効率的な受注処理を実現。",
      },
      {
        id: "vas",
        title: "付加価値サービス",
        body: "ピック＆パック、キッティング、ラベリング、検品・再梱包、コンテナリース／販売（DNV 認証含む）。",
      },
      {
        id: "offshore",
        title: "洋上物流の専門性",
        body: "洋上風力・海事機材の保管・荷役・二次輸送を支援します。",
      },
    ],
  },
  "shipping-agency": {
    slug: "shipping-agency",
    title: "シップエージェント",
    metaDescription: "円滑で効率的な港湾オペレーションのための代理店サービス。",
    hero: "接岸からクルーサポートまで、寄港を効率化する総合代理店サービス。",
    intro: "現地港湾の知見で運航を調整し、船主・用船者は航海に集中できます。",
    sections: [
      {
        id: "port",
        title: "港湾オペレーション",
        body: "接岸手配、書類対応、現場調整で安定したターンアラウンドを実現。",
      },
      {
        id: "crew",
        title: "クルー／ハスバンドリー",
        body: "乗組員交代、補給、ハスバンドリーを寄港ごとに最適化。",
      },
      {
        id: "owners",
        title: "船主代理",
        body: "透明なコミュニケーションで寄港期間中の船主・用船者の利益を守ります。",
      },
    ],
  },
};

const vi: Record<ServiceSlug, ServiceContent> = {
  "freight-logistics": {
    slug: "freight-logistics",
    title: "Vận tải hàng hóa",
    metaDescription:
      "Dịch vụ giao nhận đầu cuối đường biển, hàng không, bộ và thông quan.",
    hero: "Với hơn 30 năm kinh nghiệm, chúng tôi cung cấp giải pháp logistics đầu cuối cho đường bộ, đường sắt, biển và hàng không.",
    intro:
      "Chuyên gia thiết kế tuyến và kế hoạch vận chuyển tối ưu để mọi lô hàng đi an toàn, hiệu quả và đúng hạn—trong nước hoặc quốc tế.",
    sections: [
      {
        id: "ocean",
        title: "Đường biển",
        body: "Dịch vụ xuất nhập khẩu đường biển với FCL/LCL, hãng tàu lớn và hỗ trợ tại gốc/đích.",
        bullets: [
          "FCL minh bạch đầu cuối",
          "Mạng LCL tận dụng quy mô cộng đồng khách hàng",
          "Hợp đồng trực tiếp với các liên minh lớn",
          "Tư vấn tối ưu chi phí, tuyến và thời gian",
        ],
      },
      {
        id: "air",
        title: "Đường hàng không",
        body: "Trải nghiệm air freight cao cấp với tầm nhìn chi tiết cho hàng gấp.",
      },
      {
        id: "land",
        title: "Đường bộ",
        body: "Đối tác xe tải và công cụ theo dõi kết nối an toàn từ cảng/sân bay đến điểm cuối.",
      },
      {
        id: "customs",
        title: "Thông quan",
        body: "Đội ngũ hải quan hỗ trợ phân loại và giữ lô hàng tuân thủ, thông suốt.",
      },
    ],
  },
  "project-logistics": {
    slug: "project-logistics",
    title: "Logistics dự án",
    metaDescription:
      "Logistics hàng siêu trường/siêu trọng từ lập kế hoạch đến giao door-to-door.",
    hero: "Dịch vụ toàn diện cho dự án chìa khóa trao tay—từ thiết bị lớn đến linh kiện nhỏ.",
    intro:
      "Dự án phức tạp cần phối hợp chính xác. Chúng tôi vận chuyển hàng siêu lớn, nặng và giá trị cao với mạng toàn cầu và chuyên môn địa phương.",
    sections: [
      {
        id: "engineering",
        title: "Giải pháp kỹ thuật",
        body: "Đội kỹ thuật nội bộ lập phương án và tài liệu kỹ thuật cho vận chuyển quy mô lớn.",
      },
      {
        id: "scope",
        title: "Phạm vi dịch vụ",
        body: "Từ khởi động đến bàn giao, kiểm soát tiến độ và chi phí.",
        bullets: [
          "Quản lý thuê tàu và cước",
          "Nâng hạ và vận chuyển hàng nặng",
          "Khảo sát tuyến và khả thi",
          "Vận tải đa phương thức cửa đến cửa",
          "Thông quan và tư vấn",
          "Tầm nhìn thời gian thực và quản lý dự án",
        ],
      },
    ],
  },
  "warehouse-logistics": {
    slug: "warehouse-logistics",
    title: "Kho bãi",
    metaDescription:
      "Kho cảng Đài Trung với WMS, dịch vụ gia tăng và logistics điện gió ngoài khơi.",
    hero: "Giải pháp lưu trữ an toàn, hiệu quả và tùy chỉnh cho nhiều ngành.",
    intro:
      "Kho tại cảng Đài Trung nằm trên các tuyến vận tải chính—phù hợp hàng thông thường và thiết bị dự án ngoài khơi.",
    sections: [
      {
        id: "facilities",
        title: "Vị trí chiến lược",
        body: "Kết nối tuyến biển và đường bộ giúp rút ngắn thời gian và tăng liên thông chuỗi cung ứng.",
      },
      {
        id: "wms",
        title: "Quản lý tồn kho nâng cao",
        body: "WMS mang lại tầm nhìn thời gian thực, tồn kho chính xác, tối ưu không gian và xử lý đơn hiệu quả.",
      },
      {
        id: "vas",
        title: "Dịch vụ gia tăng",
        body: "Pick & pack, kitting, dán nhãn, kiểm hàng/đóng gói lại, thuê/bán container (gồm DNV).",
      },
      {
        id: "offshore",
        title: "Chuyên môn logistics ngoài khơi",
        body: "Hỗ trợ lưu trữ, xếp dỡ và vận chuyển thiết bị điện gió ngoài khơi và hàng hải.",
      },
    ],
  },
  "shipping-agency": {
    slug: "shipping-agency",
    title: "Đại lý hàng hải",
    metaDescription:
      "Dịch vụ đại lý tàu đầy đủ để hoạt động cảng suôn sẻ và hiệu quả.",
    hero: "Dịch vụ đại lý toàn diện từ cập cầu đến hỗ trợ thuyền viên.",
    intro:
      "Chúng tôi phối hợp vận hành tàu với hiểu biết cảng địa phương để chủ tàu/người thuê tập trung vào hành trình.",
    sections: [
      {
        id: "port",
        title: "Vận hành cảng",
        body: "Sắp xếp cập cầu, chứng từ và điều phối hiện trường cho vòng quay ổn định.",
      },
      {
        id: "crew",
        title: "Thuyền viên và hậu cần",
        body: "Đổi thuyền viên, tiếp tế và husbandry theo từng chuyến cập.",
      },
      {
        id: "owners",
        title: "Đại diện chủ tàu",
        body: "Bảo vệ lợi ích chủ tàu/người thuê bằng giao tiếp minh bạch trong thời gian tại cảng.",
      },
    ],
  },
};

const byLocale: Record<Locale, Record<ServiceSlug, ServiceContent>> = {
  en,
  "zh-tw": zhTw,
  ja,
  vi,
};

const serviceOrder: ServiceSlug[] = [
  "freight-logistics",
  "project-logistics",
  "warehouse-logistics",
  "shipping-agency",
];

function resolveLocale(locale: string): Locale {
  const normalized = locale.toLowerCase().replace("_", "-");
  if (normalized === "zh-tw" || normalized === "zh-hant" || normalized === "zh") {
    return "zh-tw";
  }
  if (normalized === "ja" || normalized === "jp") return "ja";
  if (normalized === "vi") return "vi";
  if (normalized === "en") return "en";
  return "en";
}

export function getService(locale: string, slug: ServiceSlug): ServiceContent {
  return byLocale[resolveLocale(locale)][slug];
}

export function getAllServices(locale: string): ServiceContent[] {
  const table = byLocale[resolveLocale(locale)];
  return serviceOrder.map((slug) => table[slug]);
}