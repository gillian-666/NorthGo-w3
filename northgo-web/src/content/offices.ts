export type Office = {
  id: string;
  hq?: boolean;
  regions: Array<"taiwan" | "japan" | "sea" | "americas" | "apac">;
  lat: number;
  lng: number;
  tel: string;
  fax?: string;
  email: string;
  names: Record<string, string>;
  addresses: Record<string, string>;
};

export const offices: Office[] = [
  {
    id: "tpe",
    hq: true,
    regions: ["taiwan", "apac"],
    lat: 25.0579,
    lng: 121.5441,
    tel: "+886-2-2531-8677",
    fax: "+886-2-2531-8577",
    email: "info.tpe@northgo.com",
    names: {
      en: "Taipei Office (Head Office)",
      "zh-tw": "台北總部",
      ja: "台北オフィス（本社）",
      vi: "Văn phòng Đài Bắc (Trụ sở)",
    },
    addresses: {
      en: "7F., No. 10, Sec. 3, Minsheng E. Rd., Taipei City 104511, Taiwan",
      "zh-tw": "台北市中山區民生東路三段 10 號 7 樓",
      ja: "台湾・台北市中山区民生東路三段10号7階",
      vi: "Tầng 7, số 10, đường Minsheng Đông đoạn 3, Đài Bắc, Đài Loan",
    },
  },
  {
    id: "txg",
    regions: ["taiwan", "apac"],
    lat: 24.2165,
    lng: 120.5538,
    tel: "+886-4-2326-2580",
    fax: "+886-4-2326-0308",
    email: "info.txg@northgo.com",
    names: {
      en: "Taichung Office",
      "zh-tw": "台中辦公室",
      ja: "台中オフィス",
      vi: "Văn phòng Đài Trung",
    },
    addresses: {
      en: "No. 4, Zhongheng 11th Rd., Taichung City 435058, Taiwan",
      "zh-tw": "台中市海線中橫十一路 4 號",
      ja: "台湾・台中市中横十一路4号",
      vi: "Số 4, đường Zhongheng 11, Đài Trung, Đài Loan",
    },
  },
  {
    id: "khh",
    regions: ["taiwan", "apac"],
    lat: 22.6195,
    lng: 120.2818,
    tel: "+886-7-335-0730",
    fax: "+886-7-336-4536",
    email: "info.khh@northgo.com",
    names: {
      en: "Kaohsiung Office",
      "zh-tw": "高雄辦公室",
      ja: "高雄オフィス",
      vi: "Văn phòng Cao Hùng",
    },
    addresses: {
      en: "19F-2, No.31 Hai-Pien Rd., Kaohsiung City 802609, Taiwan",
      "zh-tw": "高雄市前鎮區海邊路 31 號 19 樓之 2",
      ja: "台湾・高雄市海邊路31号19階之2",
      vi: "Tầng 19-2, số 31 đường Hải Biên, Cao Hùng, Đài Loan",
    },
  },
  {
    id: "lax",
    regions: ["americas"],
    lat: 34.0626,
    lng: -118.1229,
    tel: "+1-714-853-1088",
    email: "info.lax@northgo.com",
    names: {
      en: "Los Angeles Office",
      "zh-tw": "洛杉磯辦公室",
      ja: "ロサンゼルスオフィス",
      vi: "Văn phòng Los Angeles",
    },
    addresses: {
      en: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
      "zh-tw": "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
      ja: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
      vi: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
    },
  },
  {
    id: "hcmc",
    regions: ["sea", "apac"],
    lat: 10.7944,
    lng: 106.7194,
    tel: "+84-28-9995-7368",
    email: "info.hcmc@northgo.com",
    names: {
      en: "Ho Chi Minh Office",
      "zh-tw": "胡志明市辦公室",
      ja: "ホーチミンオフィス",
      vi: "Văn phòng TP. Hồ Chí Minh",
    },
    addresses: {
      en: "5th Floor, No. 92D Nguyen Huu Canh Street, Ward 22, Binh Thanh District, Ho Chi Minh City, Vietnam",
      "zh-tw": "越南胡志明市平盛郡第 22 坊阮友景街 92D 號 5 樓",
      ja: "ベトナム・ホーチミン市ビンタン区第22坊グエンフーカン通り92D 5階",
      vi: "Tầng 5, số 92D Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
  },
  {
    id: "tyo",
    regions: ["japan", "apac"],
    lat: 35.6764,
    lng: 139.7755,
    tel: "+81-3-6260-3944",
    fax: "+81-3-6260-3945",
    email: "info.tyo@northgo.com",
    names: {
      en: "Tokyo Office",
      "zh-tw": "東京辦公室",
      ja: "東京オフィス",
      vi: "Văn phòng Tokyo",
    },
    addresses: {
      en: "104-0041 6FL., Gran+Ginza-East 1-5-1 Shintomi, Chuo-Ku, Tokyo City, Japan",
      "zh-tw": "日本東京都中央區新富 1-5-1 Gran+Ginza-East 6 樓",
      ja: "〒104-0041 東京都中央区新富1-5-1 Gran+Ginza-East 6階",
      vi: "Tầng 6, Gran+Ginza-East, 1-5-1 Shintomi, Chuo-Ku, Tokyo, Nhật Bản",
    },
  },
  {
    id: "osa",
    regions: ["japan", "apac"],
    lat: 34.6991,
    lng: 135.4962,
    tel: "+81-6-6676-8395",
    fax: "+81-6-6676-8397",
    email: "info.osa@northgo.com",
    names: {
      en: "Osaka Office",
      "zh-tw": "大阪辦公室",
      ja: "大阪オフィス",
      vi: "Văn phòng Osaka",
    },
    addresses: {
      en: "530-0002 3FL., -B MF Sakura-Bashi Build, 2-6-23 Sonezaki Shinchi, kita-ku, Osaka City, Japan",
      "zh-tw": "日本大阪府大阪市北區曾根崎新地 2-6-23 MF 櫻橋大樓 B 棟 3 樓",
      ja: "〒530-0002 大阪府大阪市北区曾根崎新地2-6-23 MF桜橋ビルB棟3階",
      vi: "Tầng 3, MF Sakura-Bashi Build B, 2-6-23 Sonezaki Shinchi, Kita-ku, Osaka, Nhật Bản",
    },
  },
];
