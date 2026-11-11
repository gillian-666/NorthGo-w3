import type { LegalSlug } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  metaDescription: string;
  updated: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

function build(
  slug: LegalSlug,
  titles: Record<Locale, string>,
  descriptions: Record<Locale, string>,
  sections: Record<Locale, LegalPage["sections"]>,
): Record<Locale, LegalPage> {
  const updated = "2024-11-11";
  return {
    en: {
      slug,
      title: titles.en,
      metaDescription: descriptions.en,
      updated,
      sections: sections.en,
    },
    "zh-tw": {
      slug,
      title: titles["zh-tw"],
      metaDescription: descriptions["zh-tw"],
      updated,
      sections: sections["zh-tw"],
    },
    ja: {
      slug,
      title: titles.ja,
      metaDescription: descriptions.ja,
      updated,
      sections: sections.ja,
    },
    vi: {
      slug,
      title: titles.vi,
      metaDescription: descriptions.vi,
      updated,
      sections: sections.vi,
    },
  };
}

const privacy = build(
  "privacy-policy",
  {
    en: "Privacy Policy",
    "zh-tw": "隱私權政策",
    ja: "プライバシーポリシー",
    vi: "Chính sách bảo mật",
  },
  {
    en: "How Northgo collects, uses, and protects personal information on this website.",
    "zh-tw": "Northgo 如何蒐集、使用與保護本網站的個人資料。",
    ja: "本サイトにおける個人情報の取扱いについて。",
    vi: "Cách Northgo thu thập, sử dụng và bảo vệ thông tin cá nhân trên website.",
  },
  {
    en: [
      {
        heading: "Who we are",
        paragraphs: [
          "Northgo Inc. operates www.northgo.com. For privacy questions contact info.tpe@northgo.com.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "When you submit an enquiry form we collect the details you provide (such as name, company, email, phone, and message).",
          "We may collect standard technical logs (IP address, browser type, pages visited) needed to operate and secure the site.",
        ],
      },
      {
        heading: "How we use information",
        paragraphs: [
          "We use enquiry data to respond to your request and provide logistics services. We do not sell personal data.",
        ],
      },
      {
        heading: "Retention and security",
        paragraphs: [
          "We retain enquiry records only as long as needed for business and legal purposes, and apply reasonable safeguards against unauthorised access.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Depending on applicable law, you may request access, correction, or deletion of personal data by contacting us.",
        ],
      },
    ],
    "zh-tw": [
      {
        heading: "我們是誰",
        paragraphs: [
          "Northgo Inc. 營運 www.northgo.com。隱私相關問題請聯絡 info.tpe@northgo.com。",
        ],
      },
      {
        heading: "我們蒐集的資訊",
        paragraphs: [
          "當您送出詢價表單時，我們會蒐集您提供的資料（如姓名、公司、Email、電話與訊息）。",
          "為營運與資安需要，可能蒐集標準技術紀錄（IP、瀏覽器類型、瀏覽頁面）。",
        ],
      },
      {
        heading: "資訊用途",
        paragraphs: [
          "詢價資料僅用於回覆您的需求並提供物流服務。我們不會出售個人資料。",
        ],
      },
      {
        heading: "保存與安全",
        paragraphs: [
          "詢價紀錄僅在業務與法律所需期間保存，並採取合理措施防止未授權存取。",
        ],
      },
      {
        heading: "您的權利",
        paragraphs: [
          "依適用法律，您可向我們申請查閱、更正或刪除個人資料。",
        ],
      },
    ],
    ja: [
      {
        heading: "事業者",
        paragraphs: [
          "Northgo Inc. が www.northgo.com を運営します。プライバシーに関するお問い合わせは info.tpe@northgo.com まで。",
        ],
      },
      {
        heading: "収集する情報",
        paragraphs: [
          "お問い合わせフォーム送信時に、氏名・会社・メール・電話・メッセージ等をご提供内容として取得します。",
          "サイト運営とセキュリティのため、IP・ブラウザ種別・閲覧ページ等の技術ログを取得する場合があります。",
        ],
      },
      {
        heading: "利用目的",
        paragraphs: [
          "お問い合わせ対応および物流サービスの提供に利用します。個人データを販売しません。",
        ],
      },
      {
        heading: "保管と安全",
        paragraphs: [
          "業務・法令上必要な期間のみ保管し、不正アクセス防止のための合理的措置を講じます。",
        ],
      },
      {
        heading: "権利",
        paragraphs: [
          "適用法に基づき、開示・訂正・削除等を請求できる場合があります。",
        ],
      },
    ],
    vi: [
      {
        heading: "Chúng tôi là ai",
        paragraphs: [
          "Northgo Inc. vận hành www.northgo.com. Liên hệ bảo mật: info.tpe@northgo.com.",
        ],
      },
      {
        heading: "Thông tin thu thập",
        paragraphs: [
          "Khi gửi form liên hệ, chúng tôi thu thập thông tin bạn cung cấp (họ tên, công ty, email, điện thoại, nội dung).",
          "Có thể thu nhật ký kỹ thuật tiêu chuẩn (IP, trình duyệt, trang truy cập) để vận hành và bảo mật.",
        ],
      },
      {
        heading: "Mục đích sử dụng",
        paragraphs: [
          "Dùng để phản hồi yêu cầu và cung cấp dịch vụ logistics. Chúng tôi không bán dữ liệu cá nhân.",
        ],
      },
      {
        heading: "Lưu trữ và bảo mật",
        paragraphs: [
          "Chỉ lưu trong thời gian cần thiết cho kinh doanh và pháp lý, với biện pháp bảo vệ hợp lý.",
        ],
      },
      {
        heading: "Quyền của bạn",
        paragraphs: [
          "Theo luật áp dụng, bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân.",
        ],
      },
    ],
  },
);

const terms = build(
  "terms",
  {
    en: "Terms of Service",
    "zh-tw": "服務條款",
    ja: "利用規約",
    vi: "Điều khoản dịch vụ",
  },
  {
    en: "Terms governing use of the Northgo website.",
    "zh-tw": "使用 Northgo 網站的相關條款。",
    ja: "Northgo ウェブサイト利用に関する規約。",
    vi: "Điều khoản sử dụng website Northgo.",
  },
  {
    en: [
      {
        heading: "Acceptance",
        paragraphs: [
          "By using this website you agree to these terms. If you do not agree, please discontinue use.",
        ],
      },
      {
        heading: "Website content",
        paragraphs: [
          "Information on this site is provided for general guidance about Northgo services and may change without notice. It does not constitute a binding offer unless confirmed in a separate agreement.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of Taiwan (Republic of China), without regard to conflict-of-law principles.",
        ],
      },
    ],
    "zh-tw": [
      {
        heading: "同意",
        paragraphs: [
          "使用本網站即表示您同意本條款；若不同意，請停止使用。",
        ],
      },
      {
        heading: "網站內容",
        paragraphs: [
          "本站資訊僅供了解 Northgo 服務之一般說明，可能不經通知變更；除非另有書面協議，不構成具拘束力之要約。",
        ],
      },
      {
        heading: "準據法",
        paragraphs: [
          "本條款以中華民國（台灣）法律為準據法。",
        ],
      },
    ],
    ja: [
      {
        heading: "同意",
        paragraphs: [
          "本サイトの利用により本規約に同意したものとみなします。同意しない場合は利用を中止してください。",
        ],
      },
      {
        heading: "コンテンツ",
        paragraphs: [
          "掲載情報は Northgo サービスの一般的な案内であり、予告なく変更されることがあります。別途契約がない限り拘束力のある申込みではありません。",
        ],
      },
      {
        heading: "準拠法",
        paragraphs: [
          "本規約は台湾（中華民国）法に準拠します。",
        ],
      },
    ],
    vi: [
      {
        heading: "Chấp nhận",
        paragraphs: [
          "Việc sử dụng website đồng nghĩa bạn đồng ý các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng.",
        ],
      },
      {
        heading: "Nội dung website",
        paragraphs: [
          "Thông tin mang tính hướng dẫn chung về dịch vụ Northgo và có thể thay đổi. Không tạo thành đề nghị ràng buộc trừ khi có thỏa thuận riêng.",
        ],
      },
      {
        heading: "Luật điều chỉnh",
        paragraphs: [
          "Các điều khoản này chịu sự điều chỉnh của pháp luật Đài Loan (Trung Hoa Dân Quốc).",
        ],
      },
    ],
  },
);

const cookie = build(
  "cookie-policy",
  {
    en: "Cookie Policy",
    "zh-tw": "Cookie 政策",
    ja: "Cookie ポリシー",
    vi: "Chính sách Cookie",
  },
  {
    en: "How Northgo uses cookies and similar technologies.",
    "zh-tw": "Northgo 如何使用 Cookie 與類似技術。",
    ja: "Cookie 等の利用について。",
    vi: "Cách Northgo sử dụng cookie và công nghệ tương tự.",
  },
  {
    en: [
      {
        heading: "What we use",
        paragraphs: [
          "We use essential cookies required for security, locale preference, and basic site function.",
          "If analytics tools are enabled, they may set cookies to understand aggregated traffic. Optional analytics cookies are used only when configured.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can control cookies through your browser settings. Blocking essential cookies may affect site functionality.",
        ],
      },
    ],
    "zh-tw": [
      {
        heading: "我們使用什麼",
        paragraphs: [
          "我們使用營運網站所需的必要 Cookie（安全、語系偏好與基本功能）。",
          "若啟用分析工具，可能設置 Cookie 以了解彙總流量；僅在有設定時使用。",
        ],
      },
      {
        heading: "管理 Cookie",
        paragraphs: [
          "您可透過瀏覽器設定管理 Cookie；封鎖必要 Cookie 可能影響網站功能。",
        ],
      },
    ],
    ja: [
      {
        heading: "利用する Cookie",
        paragraphs: [
          "セキュリティ、言語設定、基本機能のための必須 Cookie を使用します。",
          "分析ツールを有効にした場合、集計トラフィック把握のための Cookie が設定されることがあります。",
        ],
      },
      {
        heading: "管理方法",
        paragraphs: [
          "ブラウザ設定で Cookie を管理できます。必須 Cookie を遮断すると機能に影響する場合があります。",
        ],
      },
    ],
    vi: [
      {
        heading: "Chúng tôi dùng gì",
        paragraphs: [
          "Chúng tôi dùng cookie cần thiết cho bảo mật, tùy chọn ngôn ngữ và chức năng cơ bản.",
          "Nếu bật phân tích, có thể có cookie để nắm lưu lượng tổng hợp—chỉ khi được cấu hình.",
        ],
      },
      {
        heading: "Quản lý cookie",
        paragraphs: [
          "Bạn có thể kiểm soát cookie trong trình duyệt. Chặn cookie cần thiết có thể ảnh hưởng chức năng.",
        ],
      },
    ],
  },
);

const disclaimer = build(
  "disclaimer",
  {
    en: "Legal Disclaimer",
    "zh-tw": "免責聲明",
    ja: "免責事項",
    vi: "Tuyên bố miễn trừ",
  },
  {
    en: "Limitations of liability regarding Northgo website content.",
    "zh-tw": "關於 Northgo 網站內容之責任限制。",
    ja: "本サイト掲載情報に関する免責。",
    vi: "Giới hạn trách nhiệm đối với nội dung website Northgo.",
  },
  {
    en: [
      {
        heading: "No warranties",
        paragraphs: [
          "Website content is provided as-is without warranties of completeness or fitness for a particular purpose.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, Northgo is not liable for damages arising from use of or reliance on this website.",
        ],
      },
    ],
    "zh-tw": [
      {
        heading: "不提供保證",
        paragraphs: [
          "本站內容依現況提供，不保證完整性或特定目的之適用性。",
        ],
      },
      {
        heading: "責任限制",
        paragraphs: [
          "在法律允許之最大範圍內，Northgo 不對因使用或依賴本網站而生之損害負責。",
        ],
      },
    ],
    ja: [
      {
        heading: "保証の否認",
        paragraphs: [
          "掲載情報は現状有姿で提供され、完全性や特定目的適合性を保証しません。",
        ],
      },
      {
        heading: "責任の制限",
        paragraphs: [
          "法令で認められる最大限において、本サイトの利用または依拠により生じた損害について Northgo は責任を負いません。",
        ],
      },
    ],
    vi: [
      {
        heading: "Không bảo đảm",
        paragraphs: [
          "Nội dung được cung cấp nguyên trạng, không bảo đảm đầy đủ hoặc phù hợp mục đích cụ thể.",
        ],
      },
      {
        heading: "Giới hạn trách nhiệm",
        paragraphs: [
          "Trong phạm vi pháp luật cho phép, Northgo không chịu trách nhiệm thiệt hại phát sinh từ việc sử dụng hoặc dựa vào website này.",
        ],
      },
    ],
  },
);

const all = {
  "privacy-policy": privacy,
  terms,
  "cookie-policy": cookie,
  disclaimer,
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

export function getLegal(locale: string, slug: LegalSlug): LegalPage {
  return all[slug][resolveLocale(locale)];
}
