"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, Users, MapPin, BarChart3, Lightbulb, ChevronRight, Info, Eye } from 'lucide-react';
import FiscalAnalysisResults from '@/components/FiscalAnalysisResults';
import SimulationResults from '@/components/SimulationResults';
import PolicyDetailModal from '@/components/PolicyDetailModal';

interface UserParameters {
  income: string;
  familySize: string;
  region: string;
  age: string;
  occupation?: string;
  hasHomeLoan?: boolean;
}

interface PolicyData {
  id: string;
  name: string;
  category: string;
  description: string;
  currentRate: string | number;
  scenarios: Array<{
    rate: string | number;
    label: string;
    change: number;
  }>;
  impactFlow: Array<{
    step: number;
    title: string;
    description: string;
  }>;
}

interface ScenarioData {
  rate: string | number;
  label: string;
  change: number;
}

interface SimulationResults {
  policy: PolicyData | null;
  scenario: ScenarioData;
  userParams: UserParameters;
  simple: {
    monthlyImpact: number;
    confidence: string;
    implementationDate: string;
  };
  detailed: {
    scenarios: Array<{
      name: string;
      impact: number;
      probability: number;
    }>;
    timeline: Array<{
      period: string;
      impact: number;
    }>;
  };
  expert: {
    assumptions: string[];
    sensitivity: Array<{
      parameter: string;
      impact: string;
    }>;
  };
}

interface FiscalResults {
  policy: PolicyData | null;
  scenario: ScenarioData;
  taxRevenue: {
    currentTotal: number;
    impactAmount: number;
    newTotal: number;
    impactPercentage: number;
  };
  alternativeTaxes: Array<{
    taxType: string;
    rate: string;
    probability: number;
    impact: string;
  }>;
  economicImpact: {
    gdpImpact: number;
    employmentImpact: number;
    consumptionImpact: number;
  };
  timeline: Array<{
    year: string;
    impact: number;
  }>;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisType, setAnalysisType] = useState(''); // 'personal' or 'fiscal'
  const [userParams, setUserParams] = useState<UserParameters>({
    income: '',
    familySize: '',
    region: '',
    age: ''
  });
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [selectedPolicyData, setSelectedPolicyData] = useState<PolicyData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioData | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [fiscalResults, setFiscalResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const policies = [
    { 
      id: 'consumption-tax', 
      name: '消費税変更', 
      category: '税制', 
      description: '消費税率の変更による家計への影響を分析',
      currentRate: 10,
      scenarios: [
        { rate: 8, label: '8%（2%減税）', change: -2 },
        { rate: 12, label: '12%（2%増税）', change: +2 },
        { rate: 15, label: '15%（5%増税）', change: +5 }
      ],
      impactFlow: [
        { step: 1, title: '消費税率変更', description: '政府が消費税率を変更' },
        { step: 2, title: '商品価格変化', description: '店頭価格が税率分だけ上昇・下降' },
        { step: 3, title: '消費行動変化', description: '価格変化により購買量が変動' },
        { step: 4, title: '企業売上変化', description: '消費変化が企業の売上に影響' },
        { step: 5, title: '雇用・賃金変化', description: '企業業績変化が雇用・賃金に波及' },
        { step: 6, title: '可処分所得変化', description: '最終的な家計の手取り収入に影響' }
      ]
    },
    { 
      id: 'income-tax', 
      name: '所得税変更', 
      category: '税制', 
      description: '所得税率や控除額変更の影響を分析',
      currentRate: '5-45%',
      scenarios: [
        { rate: '税率-2%', label: '全税率2%減税', change: -2 },
        { rate: '税率+2%', label: '全税率2%増税', change: +2 },
        { rate: '控除拡大', label: '基礎控除100万円拡大', change: 0 }
      ],
      impactFlow: [
        { step: 1, title: '所得税制変更', description: '税率変更または控除額変更' },
        { step: 2, title: '税負担変化', description: '個人の所得税負担が直接変化' },
        { step: 3, title: '可処分所得変化', description: '手取り収入が即座に変動' },
        { step: 4, title: '消費支出変化', description: '可処分所得変化により消費が変動' },
        { step: 5, title: '経済活動変化', description: '消費変化が経済全体に波及' },
        { step: 6, title: '長期所得効果', description: '経済活動変化が将来所得に影響' }
      ]
    },
    { 
      id: 'pension', 
      name: '年金制度改革', 
      category: '社会保障', 
      description: '年金保険料・給付額変更の影響を分析',
      currentRate: '18.3%',
      scenarios: [
        { rate: '20.3%', label: '保険料2%増加', change: +2 },
        { rate: '16.3%', label: '保険料2%減少', change: -2 },
        { rate: '給付減', label: '給付額10%削減', change: -10 }
      ],
      impactFlow: [
        { step: 1, title: '年金制度変更', description: '保険料率または給付額の変更' },
        { step: 2, title: '保険料負担変化', description: '毎月の年金保険料が変動' },
        { step: 3, title: '現在可処分所得変化', description: '保険料変化により手取り収入が変動' },
        { step: 4, title: '将来不安変化', description: '給付変化により将来への不安が変動' },
        { step: 5, title: '消費・貯蓄行動変化', description: '不安変化により消費・貯蓄が変動' },
        { step: 6, title: '総合所得効果', description: '現在・将来の総合的な所得効果' }
      ]
    },
    { 
      id: 'minimum-wage', 
      name: '最低賃金変更', 
      category: '労働', 
      description: '最低賃金改定による労働市場への影響を分析',
      currentRate: '902円',
      scenarios: [
        { rate: '1000円', label: '1000円（98円増）', change: +98 },
        { rate: '1200円', label: '1200円（298円増）', change: +298 },
        { rate: '850円', label: '850円（52円減）', change: -52 }
      ],
      impactFlow: [
        { step: 1, title: '最低賃金変更', description: '政府が最低賃金を改定' },
        { step: 2, title: '労働コスト変化', description: '企業の人件費が直接変化' },
        { step: 3, title: '雇用調整', description: '企業が雇用量や労働時間を調整' },
        { step: 4, title: '賃金水準変化', description: '最低賃金労働者の賃金が変化' },
        { step: 5, title: '消費力変化', description: '賃金変化により消費能力が変動' },
        { step: 6, title: '所得分配効果', description: '労働者全体の所得分配に影響' }
      ]
    },
    { 
      id: 'child-support', 
      name: '児童手当拡充', 
      category: '子育て', 
      description: '児童手当支給額・対象年齢拡大の影響を分析',
      currentRate: '月1.5万円',
      scenarios: [
        { rate: '月2万円', label: '月2万円（5千円増）', change: +5000 },
        { rate: '月3万円', label: '月3万円（1.5万円増）', change: +15000 },
        { rate: '18歳まで', label: '18歳まで延長', change: 0 }
      ],
      impactFlow: [
        { step: 1, title: '児童手当拡充', description: '支給額増加または対象年齢拡大' },
        { step: 2, title: '家計収入増加', description: '子育て世帯の収入が直接増加' },
        { step: 3, title: '子育て費用軽減', description: '教育・養育費の負担が軽減' },
        { step: 4, title: '消費余力拡大', description: '他の消費に回せる余力が拡大' },
        { step: 5, title: '経済活動活性化', description: '消費増加により経済が活性化' },
        { step: 6, title: '長期所得向上', description: '経済活性化により全体の所得向上' }
      ]
    },
    { 
      id: 'corporate-tax', 
      name: '法人税変更', 
      category: '税制', 
      description: '法人税率変更による企業・雇用への影響を分析',
      currentRate: '23.2%',
      scenarios: [
        { rate: '20%', label: '20%（3.2%減税）', change: -3.2 },
        { rate: '25%', label: '25%（1.8%増税）', change: +1.8 },
        { rate: '30%', label: '30%（6.8%増税）', change: +6.8 }
      ],
      impactFlow: [
        { step: 1, title: '法人税率変更', description: '企業の税負担が変化' },
        { step: 2, title: '企業利益変化', description: '税引き後利益が直接変化' },
        { step: 3, title: '投資・雇用判断', description: '利益変化により投資・雇用方針が変化' },
        { step: 4, title: '賃金・雇用変化', description: '企業方針変化により労働条件が変化' },
        { step: 5, title: '経済成長率変化', description: '投資・雇用変化により経済成長率が変化' },
        { step: 6, title: '労働者所得変化', description: '最終的に労働者の所得に影響' }
      ]
    }
  ];

  const regions = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const handleInputChange = (field: keyof UserParameters, value: string) => {
    setUserParams(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return analysisType;
      case 2:
        if (analysisType === 'personal') {
          return userParams.income && userParams.familySize && userParams.region && userParams.age;
        }
        return true; // 税収分析では個人情報不要
      case 3:
        return selectedPolicy;
      default:
        return true;
    }
  };

  const runSimulation = async () => {
    if (!selectedPolicy || !selectedScenario) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (analysisType === 'personal') {
      // 個人影響分析
      const mockResults = {
        policy: selectedPolicyData,
        scenario: selectedScenario,
        userParams,
        simple: {
          monthlyImpact: getScenarioImpact(selectedPolicy, selectedScenario),
          confidence: 'high',
          implementationDate: '2024年4月'
        },
        detailed: {
          scenarios: [
            { name: '楽観シナリオ', impact: getScenarioImpact(selectedPolicy, selectedScenario) * 0.7, probability: 30 },
            { name: '基準シナリオ', impact: getScenarioImpact(selectedPolicy, selectedScenario), probability: 50 },
            { name: '悲観シナリオ', impact: getScenarioImpact(selectedPolicy, selectedScenario) * 1.3, probability: 20 }
          ],
          timeline: [
            { period: '実施直後', impact: getScenarioImpact(selectedPolicy, selectedScenario) },
            { period: '6ヶ月後', impact: getScenarioImpact(selectedPolicy, selectedScenario) * 0.85 },
            { period: '1年後', impact: getScenarioImpact(selectedPolicy, selectedScenario) * 0.8 },
            { period: '2年後', impact: getScenarioImpact(selectedPolicy, selectedScenario) * 0.75 }
          ]
        },
        expert: {
          assumptions: [
            '価格転嫁率: 100%',
            '代替効果: 中程度',
            '所得効果: 軽微'
          ],
          sensitivity: [
            { parameter: '税率変更幅', impact: '±15%' },
            { parameter: '実施時期', impact: '±8%' }
          ]
        }
      };
      setSimulationResults(mockResults);
    } else {
      // 税収影響分析
      const mockFiscalResults = {
        policy: selectedPolicyData,
        scenario: selectedScenario,
        regionalImpact: {
          topRegions: [
            { name: '東京都', impact: 1250.5, changeRate: 2.1 },
            { name: '大阪府', impact: 890.2, changeRate: 1.8 },
            { name: '愛知県', impact: 720.8, changeRate: 1.9 },
            { name: '神奈川県', impact: 680.3, changeRate: 1.7 },
            { name: '埼玉県', impact: 420.1, changeRate: 1.5 },
            { name: '千葉県', impact: 380.7, changeRate: 1.4 },
            { name: '兵庫県', impact: 350.2, changeRate: 1.6 },
            { name: '福岡県', impact: 290.8, changeRate: 1.3 },
            { name: '北海道', impact: 280.5, changeRate: 1.2 },
            { name: '静岡県', impact: 250.3, changeRate: 1.1 }
          ],
          disparity: {
            before: 1.45,
            after: 1.48,
            change: 0.03
          }
        },
        taxRevenue: {
          currentTotal: 65.2, // 兆円
          impactAmount: getTaxRevenueImpact(selectedPolicy, selectedScenario),
          newTotal: 65.2 + getTaxRevenueImpact(selectedPolicy, selectedScenario),
          impactPercentage: (getTaxRevenueImpact(selectedPolicy, selectedScenario) / 65.2) * 100
        },
        alternativeTaxes: getAlternativeTaxOptions(selectedPolicy, selectedScenario),
        economicImpact: {
          gdpImpact: getTaxRevenueImpact(selectedPolicy, selectedScenario) * 0.8, // GDP影響
          employmentImpact: Math.round(getTaxRevenueImpact(selectedPolicy, selectedScenario) * 15000), // 雇用影響（人）
          consumptionImpact: getTaxRevenueImpact(selectedPolicy, selectedScenario) * 1.2 // 消費影響
        },
        timeline: [
          { year: '2024年', impact: getTaxRevenueImpact(selectedPolicy, selectedScenario) },
          { year: '2025年', impact: getTaxRevenueImpact(selectedPolicy, selectedScenario) * 1.05 },
          { year: '2026年', impact: getTaxRevenueImpact(selectedPolicy, selectedScenario) * 1.08 },
          { year: '2027年', impact: getTaxRevenueImpact(selectedPolicy, selectedScenario) * 1.10 }
        ]
      };
      setFiscalResults(mockFiscalResults);
    }
    
    setIsLoading(false);
    setCurrentStep(analysisType === 'personal' ? 4 : 4);
  };

  const getScenarioImpact = (policyId: string, scenario: ScenarioData | null) => {
    if (!scenario) return 0;
    
    const baseImpacts = {
      'consumption-tax': -4200 * Math.abs(scenario.change),
      'income-tax': -3800 * Math.abs(scenario.change),
      'pension': -2100 * Math.abs(scenario.change),
      'minimum-wage': 1800 * Math.abs(scenario.change) / 100,
      'child-support': scenario.change,
      'corporate-tax': -1200 * Math.abs(scenario.change)
    };
    
    const impact = baseImpacts[policyId as keyof typeof baseImpacts] || 0;
    return scenario.change > 0 && policyId !== 'child-support' ? -Math.abs(impact) : Math.abs(impact);
  };

  const getTaxRevenueImpact = (policyId: string, scenario: ScenarioData | null) => {
    if (!scenario) return 0;
    
    // 税収への影響（兆円単位）
    const baseImpacts = {
      'consumption-tax': 2.8 * scenario.change, // 1%で約2.8兆円
      'income-tax': 1.9 * Math.abs(scenario.change), // 税率変更による影響
      'corporate-tax': 1.2 * scenario.change, // 法人税率変更
      'minimum-wage': -0.3 * (scenario.change / 100), // 最低賃金上昇による企業負担増
      'child-support': -0.8 * (scenario.change / 10000), // 児童手当拡充
      'pension': 0.5 * scenario.change // 年金保険料変更
    };
    
    return baseImpacts[policyId as keyof typeof baseImpacts] || 0;
  };

  const getAlternativeTaxOptions = (policyId: string, scenario: ScenarioData | null) => {
    if (!scenario) return [];
    
    const revenueGap = getTaxRevenueImpact(policyId, scenario);
    
    if (revenueGap >= 0) {
      // 税収増の場合は減税オプション
      return [
        {
          taxType: '所得税減税',
          rate: `基礎控除${Math.round(revenueGap * 50)}万円拡大`,
          probability: 65,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円減税`
        },
        {
          taxType: '法人税減税',
          rate: `税率${(revenueGap * 0.8).toFixed(1)}%減税`,
          probability: 45,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円減税`
        },
        {
          taxType: '社会保障拡充',
          rate: '年金・医療費拡充',
          probability: 55,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円支出増`
        }
      ];
    } else {
      // 税収減の場合は増税オプション
      return [
        {
          taxType: '所得税増税',
          rate: `高所得者税率${Math.abs(revenueGap * 2).toFixed(1)}%増税`,
          probability: 70,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円増税`
        },
        {
          taxType: '法人税増税',
          rate: `税率${Math.abs(revenueGap * 1.5).toFixed(1)}%増税`,
          probability: 50,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円増税`
        },
        {
          taxType: '消費税増税',
          rate: `税率${Math.abs(revenueGap / 2.8).toFixed(1)}%増税`,
          probability: 85,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円増税`
        },
        {
          taxType: '社会保障削減',
          rate: '年金・医療費削減',
          probability: 40,
          impact: `${Math.abs(revenueGap).toFixed(1)}兆円支出削減`
        }
      ];
    }
  };

  const handlePolicySelect = (policyId: string, scenario: ScenarioData) => {
    setSelectedPolicy(policyId);
    setSelectedPolicyData(policies.find(p => p.id === policyId) || null);
    setSelectedScenario(scenario);
    setShowPolicyModal(false);
  };

  const openPolicyModal = (policy: PolicyData) => {
    setSelectedPolicyData(policy);
    setShowPolicyModal(true);
  };

  const resetSimulation = () => {
    setAnalysisType('');
    setCurrentStep(1);
    setUserParams({ income: '', familySize: '', region: '', age: '' });
    setSelectedPolicy('');
    setSelectedPolicyData(null);
    setSelectedScenario(null);
    setSimulationResults(null);
    setFiscalResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">政策シミュレーションAI</h1>
                <p className="text-sm text-slate-600">実証ミクロ経済学の民主化</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Beta Version
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {Array.from({ length: analysisType === 'personal' ? 4 : 3 }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step}
                  </div>
                  {step < (analysisType === 'personal' ? 4 : 3) && (
                    <ChevronRight className={`w-4 h-4 mx-2 ${
                      currentStep > step ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              ステップ {currentStep} / {analysisType === 'personal' ? 4 : 3}
            </div>
          </div>
          <Progress value={(currentStep / (analysisType === 'personal' ? 4 : 3)) * 100} className="h-2" />
        </div>

        {/* Step 1: User Parameters */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                あなたの基本情報を入力してください
              </h2>
              <p className="text-lg text-slate-600">
                より正確なシミュレーション結果を提供するため、基本的な情報をお聞かせください
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>基本情報</span>
                  </CardTitle>
                  <CardDescription>シミュレーションに必要な基本的な情報</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="income">年収（万円）</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="例: 500"
                      value={userParams.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">年齢</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="例: 35"
                      value={userParams.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familySize">家族構成</Label>
                    <Select value={userParams.familySize} onValueChange={(value) => handleInputChange('familySize', value)}>
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="家族構成を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">単身</SelectItem>
                        <SelectItem value="couple">夫婦のみ</SelectItem>
                        <SelectItem value="couple-1child">夫婦+子1人</SelectItem>
                        <SelectItem value="couple-2children">夫婦+子2人</SelectItem>
                        <SelectItem value="couple-3children">夫婦+子3人以上</SelectItem>
                        <SelectItem value="single-parent">ひとり親世帯</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>居住地域</span>
                  </CardTitle>
                  <CardDescription>地域別の経済指標を考慮した分析を行います</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="region">都道府県</Label>
                    <Select value={userParams.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="居住地を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!validateStep(1)}
                size="lg"
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
              >
                次へ進む
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Policy Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                分析したい政策を選択してください
              </h2>
              <p className="text-lg text-slate-600">
                以下の政策から、影響を知りたいものを選択してください
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((policy) => (
                <Card 
                  key={policy.id}
                  className={`transition-all duration-200 shadow-lg border-0 hover:shadow-xl hover:scale-105 ${
                    selectedPolicy === policy.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {policy.category}
                      </Badge>
                      {selectedPolicy === policy.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {policy.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openPolicyModal(policy)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        詳細を見る
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4 pt-6">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                戻る
              </Button>
              <Button 
                onClick={runSimulation}
                disabled={!selectedPolicy || !selectedScenario || isLoading}
                size="lg"
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    分析中...
                  </>
                ) : (
                  <>
                    シミュレーション実行
                    <BarChart3 className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 4 && simulationResults && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                シミュレーション結果
              </h2>
              <p className="text-lg text-slate-600">
                {simulationResults.policy.name}による影響分析結果
              </p>
            </div>

            <SimulationResults results={simulationResults} />

            <div className="flex justify-center space-x-4 pt-6">
              <Button 
                variant="outline"
                onClick={resetSimulation}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                新しいシミュレーション
              </Button>
              <Button 
                size="lg"
                className="px-8 py-3 text-lg bg-teal-600 hover:bg-teal-700"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                詳細レポートをダウンロード
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Fiscal Results */}
        {currentStep === 4 && fiscalResults && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                税収影響分析結果
              </h2>
              <p className="text-lg text-slate-600">
                {fiscalResults.policy?.name}による税収・経済への影響分析
              </p>
            </div>

            <FiscalAnalysisResults results={fiscalResults} />

            <div className="flex justify-center space-x-4 pt-6">
              <Button 
                variant="outline"
                onClick={resetSimulation}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                新しい分析
              </Button>
              <Button 
                size="lg"
                className="px-8 py-3 text-lg bg-teal-600 hover:bg-teal-700"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                詳細レポートをダウンロード
              </Button>
            </div>
          </div>
        )}

        {/* Policy Detail Modal */}
        <PolicyDetailModal
          policy={selectedPolicyData}
          isOpen={showPolicyModal}
          onClose={() => setShowPolicyModal(false)}
          onSelect={handlePolicySelect}
          userRegion={userParams.region}
        />

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">科学的根拠</h3>
              <p className="text-sm text-slate-600">
                実証的な経済研究に基づく信頼性の高い分析結果を提供
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">直感的理解</h3>
              <p className="text-sm text-slate-600">
                複雑な経済分析を分かりやすいビジュアルで表現
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">透明性</h3>
              <p className="text-sm text-slate-600">
                計算過程や前提条件を明確に開示した透明な分析
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}