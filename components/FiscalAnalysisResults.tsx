"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Building2, 
  MapPin,
  BarChart3,
  PieChart,
  Calculator,
  Target,
  Zap,
  ArrowUpDown
} from 'lucide-react';

interface FiscalAnalysisResultsProps {
  results: {
    policy: any;
    scenario: any;
    taxRevenue: {
      currentTotal: number;
      impactAmount: number;
      newTotal: number;
      impactPercentage: number;
      localImpact?: number;
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
    regionalImpact: {
      topRegions: Array<{
        name: string;
        impact: number;
        changeRate: number;
      }>;
      disparity: {
        before: number;
        after: number;
        change: number;
      };
    };
  };
}

export default function FiscalAnalysisResults({ results }: FiscalAnalysisResultsProps) {
  const { policy, scenario, taxRevenue, alternativeTaxes, economicImpact, timeline, regionalImpact } = results || {};
  
  if (!results) {
    return <div>Loading...</div>;
  }

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < -2) return 'text-red-600';
    return 'text-orange-600';
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-red-100 text-red-800';
    if (probability >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>税収概要</span>
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4" />
            <span>代替税制</span>
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>地域別影響</span>
          </TabsTrigger>
          <TabsTrigger value="economic" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>経済影響</span>
          </TabsTrigger>
        </TabsList>

        {/* Tax Revenue Overview */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{policy.name}</h3>
                  <p className="text-sm text-slate-600">選択シナリオ: {scenario.label}</p>
                </div>
                <Badge variant="secondary">{policy.category}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>国税収入への影響</span>
                </CardTitle>
                <CardDescription>年間税収への影響額</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {getImpactIcon(taxRevenue.impactAmount)}
                    <span className={`text-4xl font-bold ${getImpactColor(taxRevenue.impactAmount)}`}>
                      {taxRevenue.impactAmount > 0 ? '+' : ''}{taxRevenue.impactAmount.toFixed(1)}兆円
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    現在の税収: {taxRevenue.currentTotal}兆円 → {taxRevenue.newTotal?.toFixed(1)}兆円
                  </p>
                  <div className="text-lg font-semibold">
                    変化率: {taxRevenue.impactPercentage > 0 ? '+' : ''}{taxRevenue.impactPercentage?.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>地方税収への影響</span>
                </CardTitle>
                <CardDescription>地方自治体の税収変化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {getImpactIcon(taxRevenue.localImpact || 0)}
                    <span className={`text-4xl font-bold ${getImpactColor(taxRevenue.localImpact || 0)}`}>
                      {(taxRevenue.localImpact || 0) > 0 ? '+' : ''}{(taxRevenue.localImpact || 0).toFixed(1)}兆円
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    地方税収への波及効果
                  </p>
                  <div className="text-lg font-semibold">
                    変化率: {((taxRevenue.localImpact || 0) / 25.8 * 100) > 0 ? '+' : ''}{((taxRevenue.localImpact || 0) / 25.8 * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>時系列での税収変化</span>
              </CardTitle>
              <CardDescription>政策実施後の税収推移予測</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((point: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{point.year}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getImpactColor(point.impact)}`}>
                        {point.impact > 0 ? '+' : ''}{point.impact.toFixed(1)}兆円
                      </span>
                      <Progress value={Math.abs(point.impact) * 10} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alternative Tax Options */}
        <TabsContent value="alternatives" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">代替税制の提案</h3>
            <p className="text-slate-600">
              税収{taxRevenue.impactAmount > 0 ? '増加' : '減少'}を補うための代替的な税制変更案
            </p>
          </div>

          <div className="grid gap-4">
            {alternativeTaxes.map((tax: any, index: number) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{tax.taxType}</h4>
                          <p className="text-sm text-slate-600">{tax.rate}</p>
                        </div>
                      </div>
                      <div className="ml-13">
                        <p className="text-sm text-slate-700 mb-2">
                          予想影響: <span className="font-medium">{tax.impact}</span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">実施確率:</span>
                          <Badge className={getProbabilityColor(tax.probability)}>
                            {tax.probability}%
                          </Badge>
                          <Progress value={tax.probability} className="flex-1 h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              実施確率は過去の政策決定パターン、政治的実現可能性、経済状況を総合的に分析した結果です。
              実際の政策決定は政治的判断により変動する可能性があります。
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Regional Impact */}
        <TabsContent value="regional" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">地域別税収影響</h3>
            <p className="text-slate-600">
              都道府県別の税収への影響分析
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionalImpact.topRegions.map((region: any, index: number) => (
              <Card key={index} className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{region.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {index < 3 ? '影響大' : index < 6 ? '影響中' : '影響小'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getImpactColor(region.impact)}`}>
                      {region.impact > 0 ? '+' : ''}{region.impact.toFixed(2)}億円
                    </div>
                    <div className="text-xs text-slate-600">
                      変化率: {region.changeRate > 0 ? '+' : ''}{region.changeRate.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>地域間格差への影響</CardTitle>
              <CardDescription>政策による地域間の税収格差変化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {regionalImpact.disparity.before.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-700">実施前の格差指数</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {regionalImpact.disparity.after.toFixed(2)}
                  </div>
                  <div className="text-sm text-orange-700">実施後の格差指数</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {regionalImpact.disparity.change > 0 ? '+' : ''}{regionalImpact.disparity.change.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">格差変化</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economic Impact */}
        <TabsContent value="economic" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">経済全体への影響</h3>
            <p className="text-slate-600">
              GDP、雇用、消費への波及効果分析
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>GDP影響</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getImpactColor(economicImpact.gdpImpact)}`}>
                    {economicImpact.gdpImpact > 0 ? '+' : ''}{economicImpact.gdpImpact.toFixed(1)}兆円
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    実質GDP変化率: {(economicImpact.gdpImpact / 550 * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>雇用影響</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getImpactColor(economicImpact.employmentImpact)}`}>
                    {economicImpact.employmentImpact > 0 ? '+' : ''}{Math.abs(economicImpact.employmentImpact).toLocaleString()}人
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    雇用者数変化
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>消費影響</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getImpactColor(economicImpact.consumptionImpact)}`}>
                    {economicImpact.consumptionImpact > 0 ? '+' : ''}{economicImpact.consumptionImpact.toFixed(1)}兆円
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    個人消費変化
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>経済波及効果の詳細</CardTitle>
              <CardDescription>政策による経済全体への段階的影響</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">第1次効果（直接効果）</span>
                  <span className="font-bold text-blue-600">
                    {taxRevenue.impactAmount.toFixed(1)}兆円
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">第2次効果（間接効果）</span>
                  <span className="font-bold text-orange-600">
                    {(economicImpact.gdpImpact * 0.6).toFixed(1)}兆円
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">第3次効果（誘発効果）</span>
                  <span className="font-bold text-green-600">
                    {(economicImpact.consumptionImpact * 0.4).toFixed(1)}兆円
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <span className="font-medium text-purple-900">総合効果</span>
                  <span className="font-bold text-purple-600 text-lg">
                    {(taxRevenue.impactAmount + economicImpact.gdpImpact * 0.6 + economicImpact.consumptionImpact * 0.4).toFixed(1)}兆円
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}