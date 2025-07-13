// Regional Economic Data and Minimum Wage Information
// 都道府県別経済データと最低賃金情報

export interface RegionalData {
  prefecture: string;
  minimumWage: number; // 2024年度最低賃金（円/時）
  averageIncome: number; // 平均年収（万円）
  consumptionIndex: number; // 消費指数（全国平均=1.0）
  industryStructure: {
    primary: number; // 第一次産業比率
    secondary: number; // 第二次産業比率
    tertiary: number; // 第三次産業比率
  };
  economicMultiplier: number; // 経済波及効果倍率
  populationDensity: number; // 人口密度
}

export const regionalData: Record<string, RegionalData> = {
  '北海道': {
    prefecture: '北海道',
    minimumWage: 960,
    averageIncome: 440,
    consumptionIndex: 0.92,
    industryStructure: { primary: 3.8, secondary: 18.2, tertiary: 78.0 },
    economicMultiplier: 1.85,
    populationDensity: 69
  },
  '青森県': {
    prefecture: '青森県',
    minimumWage: 898,
    averageIncome: 380,
    consumptionIndex: 0.88,
    industryStructure: { primary: 6.2, secondary: 20.1, tertiary: 73.7 },
    economicMultiplier: 1.72,
    populationDensity: 130
  },
  '岩手県': {
    prefecture: '岩手県',
    minimumWage: 893,
    averageIncome: 390,
    consumptionIndex: 0.89,
    industryStructure: { primary: 5.8, secondary: 25.3, tertiary: 68.9 },
    economicMultiplier: 1.78,
    populationDensity: 84
  },
  '宮城県': {
    prefecture: '宮城県',
    minimumWage: 883,
    averageIncome: 450,
    consumptionIndex: 0.95,
    industryStructure: { primary: 2.1, secondary: 22.4, tertiary: 75.5 },
    economicMultiplier: 1.92,
    populationDensity: 318
  },
  '秋田県': {
    prefecture: '秋田県',
    minimumWage: 897,
    averageIncome: 370,
    consumptionIndex: 0.86,
    industryStructure: { primary: 5.9, secondary: 21.8, tertiary: 72.3 },
    economicMultiplier: 1.68,
    populationDensity: 84
  },
  '山形県': {
    prefecture: '山形県',
    minimumWage: 900,
    averageIncome: 400,
    consumptionIndex: 0.90,
    industryStructure: { primary: 4.8, secondary: 28.7, tertiary: 66.5 },
    economicMultiplier: 1.82,
    populationDensity: 119
  },
  '福島県': {
    prefecture: '福島県',
    minimumWage: 900,
    averageIncome: 420,
    consumptionIndex: 0.91,
    industryStructure: { primary: 4.2, secondary: 26.8, tertiary: 69.0 },
    economicMultiplier: 1.86,
    populationDensity: 137
  },
  '茨城県': {
    prefecture: '茨城県',
    minimumWage: 911,
    averageIncome: 480,
    consumptionIndex: 0.98,
    industryStructure: { primary: 3.8, secondary: 32.1, tertiary: 64.1 },
    economicMultiplier: 1.95,
    populationDensity: 470
  },
  '栃木県': {
    prefecture: '栃木県',
    minimumWage: 913,
    averageIncome: 470,
    consumptionIndex: 0.96,
    industryStructure: { primary: 3.2, secondary: 35.8, tertiary: 61.0 },
    economicMultiplier: 1.98,
    populationDensity: 306
  },
  '群馬県': {
    prefecture: '群馬県',
    minimumWage: 935,
    averageIncome: 460,
    consumptionIndex: 0.94,
    industryStructure: { primary: 2.8, secondary: 34.2, tertiary: 63.0 },
    economicMultiplier: 1.94,
    populationDensity: 310
  },
  '埼玉県': {
    prefecture: '埼玉県',
    minimumWage: 987,
    averageIncome: 520,
    consumptionIndex: 1.05,
    industryStructure: { primary: 0.8, secondary: 26.4, tertiary: 72.8 },
    economicMultiplier: 2.08,
    populationDensity: 1925
  },
  '千葉県': {
    prefecture: '千葉県',
    minimumWage: 984,
    averageIncome: 510,
    consumptionIndex: 1.03,
    industryStructure: { primary: 1.5, secondary: 24.8, tertiary: 73.7 },
    economicMultiplier: 2.05,
    populationDensity: 1218
  },
  '東京都': {
    prefecture: '東京都',
    minimumWage: 1113,
    averageIncome: 620,
    consumptionIndex: 1.15,
    industryStructure: { primary: 0.1, secondary: 8.2, tertiary: 91.7 },
    economicMultiplier: 2.35,
    populationDensity: 6402
  },
  '神奈川県': {
    prefecture: '神奈川県',
    minimumWage: 1112,
    averageIncome: 550,
    consumptionIndex: 1.12,
    industryStructure: { primary: 0.4, secondary: 22.1, tertiary: 77.5 },
    economicMultiplier: 2.28,
    populationDensity: 3807
  },
  '新潟県': {
    prefecture: '新潟県',
    minimumWage: 931,
    averageIncome: 420,
    consumptionIndex: 0.92,
    industryStructure: { primary: 3.8, secondary: 26.2, tertiary: 70.0 },
    economicMultiplier: 1.88,
    populationDensity: 181
  },
  '富山県': {
    prefecture: '富山県',
    minimumWage: 948,
    averageIncome: 450,
    consumptionIndex: 0.94,
    industryStructure: { primary: 2.1, secondary: 35.8, tertiary: 62.1 },
    economicMultiplier: 1.92,
    populationDensity: 251
  },
  '石川県': {
    prefecture: '石川県',
    minimumWage: 933,
    averageIncome: 440,
    consumptionIndex: 0.93,
    industryStructure: { primary: 2.4, secondary: 29.8, tertiary: 67.8 },
    economicMultiplier: 1.89,
    populationDensity: 274
  },
  '福井県': {
    prefecture: '福井県',
    minimumWage: 931,
    averageIncome: 460,
    consumptionIndex: 0.95,
    industryStructure: { primary: 2.8, secondary: 32.1, tertiary: 65.1 },
    economicMultiplier: 1.91,
    populationDensity: 187
  },
  '山梨県': {
    prefecture: '山梨県',
    minimumWage: 938,
    averageIncome: 430,
    consumptionIndex: 0.92,
    industryStructure: { primary: 4.2, secondary: 28.8, tertiary: 67.0 },
    economicMultiplier: 1.85,
    populationDensity: 186
  },
  '長野県': {
    prefecture: '長野県',
    minimumWage: 948,
    averageIncome: 450,
    consumptionIndex: 0.94,
    industryStructure: { primary: 3.8, secondary: 30.2, tertiary: 66.0 },
    economicMultiplier: 1.88,
    populationDensity: 154
  },
  '岐阜県': {
    prefecture: '岐阜県',
    minimumWage: 950,
    averageIncome: 460,
    consumptionIndex: 0.96,
    industryStructure: { primary: 2.1, secondary: 35.8, tertiary: 62.1 },
    economicMultiplier: 1.94,
    populationDensity: 190
  },
  '静岡県': {
    prefecture: '静岡県',
    minimumWage: 984,
    averageIncome: 480,
    consumptionIndex: 0.98,
    industryStructure: { primary: 1.8, secondary: 35.2, tertiary: 63.0 },
    economicMultiplier: 2.02,
    populationDensity: 473
  },
  '愛知県': {
    prefecture: '愛知県',
    minimumWage: 1027,
    averageIncome: 530,
    consumptionIndex: 1.05,
    industryStructure: { primary: 0.8, secondary: 38.2, tertiary: 61.0 },
    economicMultiplier: 2.15,
    populationDensity: 1460
  },
  '三重県': {
    prefecture: '三重県',
    minimumWage: 973,
    averageIncome: 470,
    consumptionIndex: 0.97,
    industryStructure: { primary: 2.1, secondary: 35.8, tertiary: 62.1 },
    economicMultiplier: 1.96,
    populationDensity: 314
  },
  '滋賀県': {
    prefecture: '滋賀県',
    minimumWage: 967,
    averageIncome: 490,
    consumptionIndex: 1.00,
    industryStructure: { primary: 1.8, secondary: 35.2, tertiary: 63.0 },
    economicMultiplier: 2.01,
    populationDensity: 353
  },
  '京都府': {
    prefecture: '京都府',
    minimumWage: 1008,
    averageIncome: 500,
    consumptionIndex: 1.02,
    industryStructure: { primary: 1.2, secondary: 22.8, tertiary: 76.0 },
    economicMultiplier: 2.08,
    populationDensity: 560
  },
  '大阪府': {
    prefecture: '大阪府',
    minimumWage: 1064,
    averageIncome: 520,
    consumptionIndex: 1.08,
    industryStructure: { primary: 0.2, secondary: 20.8, tertiary: 79.0 },
    economicMultiplier: 2.22,
    populationDensity: 4630
  },
  '兵庫県': {
    prefecture: '兵庫県',
    minimumWage: 1001,
    averageIncome: 490,
    consumptionIndex: 1.01,
    industryStructure: { primary: 1.1, secondary: 26.9, tertiary: 72.0 },
    economicMultiplier: 2.05,
    populationDensity: 650
  },
  '奈良県': {
    prefecture: '奈良県',
    minimumWage: 936,
    averageIncome: 470,
    consumptionIndex: 0.98,
    industryStructure: { primary: 1.8, secondary: 18.2, tertiary: 80.0 },
    economicMultiplier: 1.92,
    populationDensity: 365
  },
  '和歌山県': {
    prefecture: '和歌山県',
    minimumWage: 929,
    averageIncome: 420,
    consumptionIndex: 0.91,
    industryStructure: { primary: 3.2, secondary: 22.8, tertiary: 74.0 },
    economicMultiplier: 1.82,
    populationDensity: 204
  },
  '鳥取県': {
    prefecture: '鳥取県',
    minimumWage: 900,
    averageIncome: 380,
    consumptionIndex: 0.87,
    industryStructure: { primary: 4.8, secondary: 24.2, tertiary: 71.0 },
    economicMultiplier: 1.75,
    populationDensity: 160
  },
  '島根県': {
    prefecture: '島根県',
    minimumWage: 904,
    averageIncome: 390,
    consumptionIndex: 0.88,
    industryStructure: { primary: 5.2, secondary: 23.8, tertiary: 71.0 },
    economicMultiplier: 1.76,
    populationDensity: 103
  },
  '岡山県': {
    prefecture: '岡山県',
    minimumWage: 932,
    averageIncome: 440,
    consumptionIndex: 0.93,
    industryStructure: { primary: 2.8, secondary: 28.2, tertiary: 69.0 },
    economicMultiplier: 1.89,
    populationDensity: 270
  },
  '広島県': {
    prefecture: '広島県',
    minimumWage: 970,
    averageIncome: 470,
    consumptionIndex: 0.97,
    industryStructure: { primary: 1.8, secondary: 28.2, tertiary: 70.0 },
    economicMultiplier: 1.98,
    populationDensity: 334
  },
  '山口県': {
    prefecture: '山口県',
    minimumWage: 928,
    averageIncome: 430,
    consumptionIndex: 0.92,
    industryStructure: { primary: 2.1, secondary: 32.9, tertiary: 65.0 },
    economicMultiplier: 1.88,
    populationDensity: 226
  },
  '徳島県': {
    prefecture: '徳島県',
    minimumWage: 896,
    averageIncome: 400,
    consumptionIndex: 0.89,
    industryStructure: { primary: 3.8, secondary: 24.2, tertiary: 72.0 },
    economicMultiplier: 1.78,
    populationDensity: 184
  },
  '香川県': {
    prefecture: '香川県',
    minimumWage: 918,
    averageIncome: 420,
    consumptionIndex: 0.91,
    industryStructure: { primary: 2.8, secondary: 26.2, tertiary: 71.0 },
    economicMultiplier: 1.84,
    populationDensity: 515
  },
  '愛媛県': {
    prefecture: '愛媛県',
    minimumWage: 897,
    averageIncome: 410,
    consumptionIndex: 0.90,
    industryStructure: { primary: 3.2, secondary: 26.8, tertiary: 70.0 },
    economicMultiplier: 1.82,
    populationDensity: 243
  },
  '高知県': {
    prefecture: '高知県',
    minimumWage: 897,
    averageIncome: 390,
    consumptionIndex: 0.88,
    industryStructure: { primary: 4.8, secondary: 18.2, tertiary: 77.0 },
    economicMultiplier: 1.72,
    populationDensity: 102
  },
  '福岡県': {
    prefecture: '福岡県',
    minimumWage: 941,
    averageIncome: 460,
    consumptionIndex: 0.96,
    industryStructure: { primary: 1.8, secondary: 20.2, tertiary: 78.0 },
    economicMultiplier: 2.02,
    populationDensity: 1024
  },
  '佐賀県': {
    prefecture: '佐賀県',
    minimumWage: 900,
    averageIncome: 400,
    consumptionIndex: 0.89,
    industryStructure: { primary: 4.2, secondary: 26.8, tertiary: 69.0 },
    economicMultiplier: 1.78,
    populationDensity: 340
  },
  '長崎県': {
    prefecture: '長崎県',
    minimumWage: 898,
    averageIncome: 390,
    consumptionIndex: 0.88,
    industryStructure: { primary: 3.8, secondary: 18.2, tertiary: 78.0 },
    economicMultiplier: 1.75,
    populationDensity: 329
  },
  '熊本県': {
    prefecture: '熊本県',
    minimumWage: 898,
    averageIncome: 410,
    consumptionIndex: 0.90,
    industryStructure: { primary: 4.2, secondary: 22.8, tertiary: 73.0 },
    economicMultiplier: 1.82,
    populationDensity: 240
  },
  '大分県': {
    prefecture: '大分県',
    minimumWage: 899,
    averageIncome: 420,
    consumptionIndex: 0.91,
    industryStructure: { primary: 3.2, secondary: 28.8, tertiary: 68.0 },
    economicMultiplier: 1.85,
    populationDensity: 182
  },
  '宮崎県': {
    prefecture: '宮崎県',
    minimumWage: 897,
    averageIncome: 380,
    consumptionIndex: 0.87,
    industryStructure: { primary: 5.8, secondary: 19.2, tertiary: 75.0 },
    economicMultiplier: 1.72,
    populationDensity: 143
  },
  '鹿児島県': {
    prefecture: '鹿児島県',
    minimumWage: 897,
    averageIncome: 380,
    consumptionIndex: 0.87,
    industryStructure: { primary: 5.2, secondary: 17.8, tertiary: 77.0 },
    economicMultiplier: 1.70,
    populationDensity: 178
  },
  '沖縄県': {
    prefecture: '沖縄県',
    minimumWage: 896,
    averageIncome: 360,
    consumptionIndex: 0.85,
    industryStructure: { primary: 2.1, secondary: 8.9, tertiary: 89.0 },
    economicMultiplier: 1.68,
    populationDensity: 645
  }
};

// 産業関連表に基づく波及効果係数
export interface IndustryMultiplier {
  sector: string;
  directEffect: number;
  indirectEffect: number;
  inducedEffect: number;
  totalMultiplier: number;
}

export const industryMultipliers: Record<string, IndustryMultiplier> = {
  'consumption': {
    sector: '最終消費',
    directEffect: 1.000,
    indirectEffect: 0.425,
    inducedEffect: 0.312,
    totalMultiplier: 1.737
  },
  'manufacturing': {
    sector: '製造業',
    directEffect: 1.000,
    indirectEffect: 0.682,
    inducedEffect: 0.445,
    totalMultiplier: 2.127
  },
  'services': {
    sector: 'サービス業',
    directEffect: 1.000,
    indirectEffect: 0.358,
    inducedEffect: 0.298,
    totalMultiplier: 1.656
  },
  'construction': {
    sector: '建設業',
    directEffect: 1.000,
    indirectEffect: 0.712,
    inducedEffect: 0.398,
    totalMultiplier: 2.110
  },
  'agriculture': {
    sector: '農林水産業',
    directEffect: 1.000,
    indirectEffect: 0.445,
    inducedEffect: 0.285,
    totalMultiplier: 1.730
  }
};

// 地域別最低賃金取得関数
export const getMinimumWage = (prefecture: string): number => {
  return regionalData[prefecture]?.minimumWage || 900; // デフォルト値
};

// 地域別経済データ取得関数
export const getRegionalData = (prefecture: string): RegionalData | null => {
  return regionalData[prefecture] || null;
};

// 産業別波及効果計算
export const calculateIndustryImpact = (
  initialImpact: number,
  industryType: string
): {
  direct: number;
  indirect: number;
  induced: number;
  total: number;
} => {
  const multiplier = industryMultipliers[industryType] || industryMultipliers['services'];
  
  return {
    direct: initialImpact * multiplier.directEffect,
    indirect: initialImpact * multiplier.indirectEffect,
    induced: initialImpact * multiplier.inducedEffect,
    total: initialImpact * multiplier.totalMultiplier
  };
};