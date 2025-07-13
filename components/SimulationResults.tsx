"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  PieChart, 
  Calculator,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface SimulationResultsProps {
  results: any;
}

export default function SimulationResults({ results }: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState('simple');

  const policy = results.policy;
  const scenario = results.scenario;

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < -5000) return 'text-red-600';
    return 'text-orange-600';
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getConfidenceBadge = (confidence: string) => {
    const configs = {
      high: { label: '高信頼', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      medium: { label: '中信頼', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      low: { label: '低信頼', variant: 'outline' as const, color: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[confidence as keyof typeof configs] || configs.medium;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="simple" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>シンプル表示</span>
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>詳細分析</span>
          </TabsTrigger>
          <TabsTrigger value="expert" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>専門家向け</span>
          </TabsTrigger>
        </TabsList>

        {/* Simple View */}
        <TabsContent value="simple" className="space-y-6">
          {/* Policy and Scenario Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{policy.name}</h3>
                  <p className="text-sm text-slate-600">選択シナリオ: {scenario.label}</p>
                </div>
                <Badge variant="secondary">{policy.category}</Badge>
              </div>
              <div className="text-sm text-slate-600">
                <p>現在: {policy.currentRate} → 変更後: {scenario.rate || scenario.label}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>月額影響額</span>
                  </span>
                  {getConfidenceBadge(results.simple.confidence)}
                </CardTitle>
                <CardDescription>あなたの家計への月額影響</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {getImpactIcon(results.simple.monthlyImpact)}
                    <span className={`text-4xl font-bold ${getImpactColor(results.simple.monthlyImpact)}`}>
                      {results.simple.monthlyImpact > 0 ? '+' : ''}{results.simple.monthlyImpact.toLocaleString()}円
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {results.simple.monthlyImpact < 0 ? '負担増加' : '負担軽減'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>実施時期</span>
                </CardTitle>
                <CardDescription>政策の実施予定</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-2">
                    {results.simple.implementationDate}
                  </div>
                  <p className="text-sm text-slate-600">
                    実施予定時期
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              この結果は、現在の経済状況と過去のデータに基づく推定値です。
              実際の影響は経済環境の変化により異なる場合があります。
            </AlertDescription>
          </Alert>

          {/* Impact Flow Visualization */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>影響の経路</span>
              </CardTitle>
              <CardDescription>政策がどのように段階を経て所得に影響するか</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {policy.impactFlow.slice(0, 4).map((step: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-slate-600">{step.description}</div>
                    </div>
                    {index < 3 && (
                      <div className="text-slate-400">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed View */}
        <TabsContent value="detailed" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scenarios */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>シナリオ分析</span>
                </CardTitle>
                <CardDescription>3つの想定シナリオでの影響予測</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.detailed.scenarios.map((scenario: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{scenario.name}</span>
                      <span className={`font-bold ${getImpactColor(scenario.impact)}`}>
                        {scenario.impact > 0 ? '+' : ''}{scenario.impact.toLocaleString()}円
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={scenario.probability} className="flex-1 h-2" />
                      <span className="text-sm text-slate-600 w-12">{scenario.probability}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>時系列変化</span>
                </CardTitle>
                <CardDescription>政策実施後の影響推移</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.detailed.timeline.map((point: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{point.period}</span>
                    <span className={`font-bold ${getImpactColor(point.impact)}`}>
                      {point.impact > 0 ? '+' : ''}{point.impact.toLocaleString()}円
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>影響要因の分解</CardTitle>
              <CardDescription>政策による影響の詳細な内訳</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">-5,200円</div>
                  <div className="text-sm text-red-700">直接効果</div>
                  <div className="text-xs text-slate-600 mt-1">税負担の増加</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">-2,100円</div>
                  <div className="text-sm text-orange-700">間接効果</div>
                  <div className="text-xs text-slate-600 mt-1">物価上昇による影響</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">-1,200円</div>
                  <div className="text-sm text-yellow-700">一般均衡効果</div>
                  <div className="text-xs text-slate-600 mt-1">経済全体への波及</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expert View */}
        <TabsContent value="expert" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>計算の前提条件</CardTitle>
                <CardDescription>シミュレーションで使用した主要パラメータ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.expert.assumptions.map((assumption: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{assumption}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>感度分析</CardTitle>
                <CardDescription>主要パラメータ変更時の結果への影響</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.expert.sensitivity.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">{item.parameter}</span>
                      <Badge variant="outline">{item.impact}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>計算式と方法論</CardTitle>
              <CardDescription>分析に使用した経済学的手法の詳細</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="text-slate-700 mb-2">基本計算式:</div>
                <div className="text-slate-900">
                  総影響額 = 直接効果 + 間接効果 + 一般均衡効果
                </div>
                <div className="text-slate-900 mt-2">
                  直接効果 = (新税率 - 旧税率) × 課税ベース × 所得係数
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">使用データソース</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• 総務省統計局「家計調査」</li>
                    <li>• 内閣府「国民経済計算」</li>
                    <li>• 財務省「税収統計」</li>
                    <li>• 厚生労働省「毎月勤労統計」</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">分析手法</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• ミクロシミュレーション</li>
                    <li>• 部分均衡分析</li>
                    <li>• 感度分析</li>
                    <li>• モンテカルロ・シミュレーション</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}