import type { Locale } from "@/i18n/routing";

export type AboutContent = {
  metaDescription: string;
  title: string;
  lead: string;
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string;
  valuesTitle: string;
  valuesIntro: string;
  values: Array<{ title: string; body: string }>;
  storyTitle: string;
  story: string[];
  changedTitle: string;
  changed: string;
  sameTitle: string;
  same: string;
  closingTitle: string;
  closing: string;
};

const content: Record<Locale, AboutContent> = {
  en: {
    metaDescription:
      "Northgo vision, mission, values, and story—from Max Seair Logistics (1988) to Northgo (2024).",
    title: "Welcome to Northgo",
    lead: "With over three decades of experience, we deliver reliable logistics that simplify complex supply chains and create value at every stage.",
    visionTitle: "Our Vision",
    vision: "To be the most trusted name in logistics.",
    missionTitle: "Our Mission",
    mission: "Making logistics effortless.",
    valuesTitle: "Our Values",
    valuesIntro:
      'We believe that "doing the right thing is far greater than doing things right."',
    values: [
      {
        title: "Customer-Centric Approach",
        body: "Persist in doing the right thing and creating value for customers in every decision and service.",
      },
      {
        title: "Integrity and Transparency",
        body: "Trust is earned through honesty and consistency—clients stay informed and confident.",
      },
      {
        title: "Innovation and Excellence",
        body: "We evolve continuously to stay ahead of industry trends with practical, competitive solutions.",
      },
      {
        title: "Sustainability and Responsibility",
        body: "We reduce environmental impact and support responsible long-term growth for communities we serve.",
      },
    ],
    storyTitle: "Our Story",
    story: [
      "Founded in 1988 in Taipei as Max Seair Logistics Inc., we grew into a trusted partner known for reliability and a customer-first approach.",
      "On November 11, 2024, we rebranded as Northgo—signaling a forward-looking commitment while keeping the same dedicated team and standards.",
    ],
    changedTitle: "What has changed?",
    changed:
      "The name on the door. Northgo represents innovation, progress, and better service in a changing logistics landscape.",
    sameTitle: "What remains the same?",
    same: "Our dedication to clients—the same expertise, high standards, and commitment we have upheld for over three decades.",
    closingTitle: "Northgo, sailing into the future with you.",
    closing:
      "The future of logistics holds challenges and opportunities. As Northgo, we are ready to build success with you—one seamless solution at a time.",
  },
  "zh-tw": {
    metaDescription:
      "Northgo 的願景、使命、價值觀與沿革——從 1988 Max Seair 到 2024 Northgo。",
    title: "歡迎認識 Northgo",
    lead: "憑藉三十餘年經驗，我們以可靠且創新的物流，簡化複雜供應鏈，並在每個階段創造價值。",
    visionTitle: "我們的願景",
    vision: "成為物流領域最受信賴的名字。",
    missionTitle: "我們的使命",
    mission: "讓物流變得輕鬆。",
    valuesTitle: "我們的價值觀",
    valuesIntro: "我們相信「做對的事，遠比把事情做對更重要」。",
    values: [
      {
        title: "以客戶為中心",
        body: "堅持做對的事，在每個決策與服務中為客戶創造價值。",
      },
      {
        title: "誠信與透明",
        body: "信任來自誠實與一致性，讓客戶始終掌握資訊、充滿信心。",
      },
      {
        title: "創新與卓越",
        body: "持續進化，以務實方案領先產業趨勢並保持競爭力。",
      },
      {
        title: "永續與責任",
        body: "降低環境影響，並為所服務的社群追求長期負責任的成長。",
      },
    ],
    storyTitle: "我們的故事",
    story: [
      "1988 年於台北創立 Max Seair Logistics Inc.，以可靠與客戶優先建立信任。",
      "2024 年 11 月 11 日，我們正式更名為 Northgo——展望未來，同時堅守同一支團隊與標準。",
    ],
    changedTitle: "改變了什麼？",
    changed:
      "門上的名字。Northgo 代表創新、進步，以及在變化的物流環境中更好地服務客戶。",
    sameTitle: "什麼沒變？",
    same: "對客戶的承諾——三十多年來不變的專業、高標準與熱忱。",
    closingTitle: "Northgo，與您航向未來。",
    closing:
      "物流的未來充滿挑戰與機會。作為 Northgo，我們準備好與您一起，以每一個順暢的解決方案成就成功。",
  },
  ja: {
    metaDescription:
      "Northgo のビジョン・ミッション・価値観と沿革（1988 Max Seair → 2024 Northgo）。",
    title: "Northgo へようこそ",
    lead: "30年以上の経験で、複雑なサプライチェーンを簡素化し、各段階で価値を届ける物流を提供します。",
    visionTitle: "ビジョン",
    vision: "物流でもっとも信頼される存在になること。",
    missionTitle: "ミッション",
    mission: "Making logistics effortless.（物流をシンプルに）",
    valuesTitle: "価値観",
    valuesIntro: "「正しく物事を進めることより、正しいことをすること」を大切にします。",
    values: [
      {
        title: "顧客中心",
        body: "正しいことを貫き、すべての意思決定とサービスで顧客価値を創出します。",
      },
      {
        title: "誠実と透明性",
        body: "誠実さと一貫性で信頼を築き、常に情報を共有します。",
      },
      {
        title: "革新と卓越",
        body: "業界トレンドに先駆け、競争力のある実用的な解決策を追求します。",
      },
      {
        title: "持続可能性と責任",
        body: "環境負荷を下げ、地域社会にとって責任ある成長を目指します。",
      },
    ],
    storyTitle: "私たちの物語",
    story: [
      "1988年、台北で Max Seair Logistics Inc. として創業。信頼と顧客第一で成長しました。",
      "2024年11月11日、Northgo へリブランディング。同じチームと基準を保ちつつ、未来志向を示します。",
    ],
    changedTitle: "変わったこと",
    changed:
      "看板の名前です。Northgo は革新・進歩、そして変化する物流環境でのより良いサービスを表します。",
    sameTitle: "変わらないこと",
    same: "お客様へのdedication—30年以上守ってきた専門性、高い基準、そして情熱です。",
    closingTitle: "Northgo、未来へともに出航。",
    closing:
      "物流の未来には課題と機会があります。Northgo として、シームレスな解決策を一つずつ積み重ねます。",
  },
  vi: {
    metaDescription:
      "Tầm nhìn, sứ mệnh, giá trị và câu chuyện Northgo—từ Max Seair (1988) đến Northgo (2024).",
    title: "Chào mừng đến Northgo",
    lead: "Hơn ba thập kỷ kinh nghiệm giúp chúng tôi đơn giản hóa chuỗi cung ứng phức tạp và tạo giá trị ở mọi giai đoạn.",
    visionTitle: "Tầm nhìn",
    vision: "Trở thành cái tên đáng tin cậy nhất trong logistics.",
    missionTitle: "Sứ mệnh",
    mission: "Making logistics effortless — làm logistics trở nên dễ dàng.",
    valuesTitle: "Giá trị",
    valuesIntro:
      'Chúng tôi tin rằng "làm điều đúng quan trọng hơn làm đúng quy trình".',
    values: [
      {
        title: "Lấy khách hàng làm trung tâm",
        body: "Kiên trì làm điều đúng và tạo giá trị cho khách hàng trong mọi quyết định.",
      },
      {
        title: "Chính trực và minh bạch",
        body: "Niềm tin đến từ sự trung thực và nhất quán—khách hàng luôn được thông tin.",
      },
      {
        title: "Đổi mới và xuất sắc",
        body: "Không ngừng tiến hóa để dẫn trước xu hướng với giải pháp thực tế, cạnh tranh.",
      },
      {
        title: "Bền vững và trách nhiệm",
        body: "Giảm tác động môi trường và thúc đẩy tăng trưởng có trách nhiệm lâu dài.",
      },
    ],
    storyTitle: "Câu chuyện của chúng tôi",
    story: [
      "Thành lập tại Đài Bắc năm 1988 với tên Max Seair Logistics Inc., chúng tôi xây dựng uy tín nhờ độ tin cậy và ưu tiên khách hàng.",
      "Ngày 11/11/2024, chúng tôi đổi thương hiệu thành Northgo—hướng tới tương lai với cùng đội ngũ và tiêu chuẩn.",
    ],
    changedTitle: "Điều gì đã đổi?",
    changed:
      "Tên trên cửa. Northgo đại diện cho đổi mới, tiến bộ và phục vụ tốt hơn trong bối cảnh logistics thay đổi.",
    sameTitle: "Điều gì giữ nguyên?",
    same: "Cam kết với khách hàng—chuyên môn, tiêu chuẩn cao và nhiệt huyết hơn ba thập kỷ.",
    closingTitle: "Northgo, cùng bạn ra khơi tương lai.",
    closing:
      "Tương lai logistics đầy thử thách và cơ hội. Là Northgo, chúng tôi sẵn sàng xây dựng thành công cùng bạn.",
  },
};

function resolveLocale(locale: string): Locale {
  const normalized = locale.toLowerCase().replace("_", "-");
  if (normalized === "zh-tw" || normalized === "zh-hant" || normalized === "zh") {
    return "zh-tw";
  }
  if (normalized === "ja" || normalized === "jp") return "ja";
  if (normalized === "vi") return "vi";
  return "en";
}

export function getAbout(locale: string): AboutContent {
  return content[resolveLocale(locale)];
}
