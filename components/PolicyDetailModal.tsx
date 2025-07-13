"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getMinimumWage, getRegionalData, calculateIndustryImpact } from '@/lib/regional-data';
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  ShoppingCart,
  Briefcase,
  Home,
  ChevronRight,
  Info,
  Calculator,
  Target,
  Zap
} from 'lucide-react';

interface PolicyDetailModalProps {
  policy: any;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (policyId: string, scenario: any) => void;
  userRegion?: string;
}

export default function PolicyDetailModal({ policy, isOpen, onClose, onSelect, userRegion }: PolicyDetailModalProps) {
  const [selectedScenario, setSelectedScenario] = useState(policy?.scenarios?.[0]);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!policy) return null;

  // 地域別データの取得
  const regionalData = userRegion ? getRegionalData(userRegion) : null;
  const currentMinimumWage = userRegion ? getMinimumWage(userRegion) : 902;

  // 政策別の現在値を地域に応じて更新
  const getCurrentRate = () => {
    if (policy.id === 'minimum-wage' && regionalData) {
      return `${currentMinimumWage}円/時`;
    }
    return policy.currentRate;
  };

  // カスタムシナリオの作成
  const createCustomScenario = () => {
    if (!customValue || isNaN(Number(customValue))) return;
    
    const value = Number(customValue);
    let customScenario;
    
    switch (policy.id) {
      case 'minimum-wage':
        const currentWage = currentMinimumWage;
        const change = value - currentWage;
        customScenario = {
          rate: `${value}円/時`,
          label: `${value}円/時（${change > 0 ? '+' : ''}${change}円）`,
          change: change,
          isCustom: true
        };
        break;
      case 'consumption-tax':
        customScenario = {
          rate: `${value}%`,
          label: `${value}%（${value > 10 ? '+' : ''}${value - 10}%）`,
          change: value - 10,
          isCustom: true
        };
        break;
      case 'child-support':
        customScenario = {
          rate: `月${value.toLocaleString()}円`,
          label: `月${value.toLocaleString()}円（${value > 15000 ? '+' : ''}${(value - 15000).toLocaleString()}円）`,
          change: value - 15000,
          isCustom: true
        };
        break;
      default:
        return;
    }
    
    setSelectedScenario(customScenario);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const getStepIcon = (step: number) => {
    const icons = [
      <DollarSign className="w-5 h-5" />,
      <ShoppingCart className="w-5 h-5" />,
      <Users className="w-5 h-5" />,
      <Building className="w-5 h-5" />,
      <Briefcase className="w-5 h-5" />,
      <Home className="w-5 h-5" />
    ];
    return icons[step - 1] || <Info className="w-5 h-5" />;
  };

  const getStepColor = (step: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
      'bg-red-100 text-red-600',
      'bg-teal-100 text-teal-600'
    ];
    return colors[step - 1] || 'bg-gray-100 text-gray-600';
  };

  const getImpactEstimate = (scenario: any) => {
    if (!scenario) return 0;
    
    // 地域別データを考慮した影響計算
    const regionMultiplier = regionalData?.economicMultiplier || 1.0;
    const consumptionIndex = regionalData?.consumptionIndex || 1.0;
    
    const baseImpacts = {
      'consumption-tax': -4200 * Math.abs(scenario.change) * consumptionIndex,
      'income-tax': -3800 * Math.abs(scenario.change) * regionMultiplier,
      'pension': -2100 * Math.abs(scenario.change) * regionMultiplier,
      'minimum-wage': scenario.change * 160 * regionMultiplier, // 月160時間労働想定
      'child-support': scenario.change,
      'corporate-tax': -1200 * Math.abs(scenario.change) * regionMultiplier
    };
    
    const impact = baseImpacts[policy.id as keyof typeof baseImpacts] || 0;
    
    // 産業関連表による波及効果を考慮
    const industryType = policy.id === 'minimum-wage' ? 'services' : 'consumption';
    const rippleEffect = calculateIndustryImpact(Math.abs(impact), industryType);
    
    return scenario.change > 0 && policy.id !== 'child-support' && policy.id !== 'minimum-wage' 
      ? -rippleEffect.total 
      : rippleEffect.total;
  };

  // 波及効果の詳細計算
  const getDetailedImpact = (scenario: any) => {
    if (!scenario) return null;
    
    const baseImpact = Math.abs(getImpactEstimate(scenario));
    const industryType = policy.id === 'minimum-wage' ? 'services' : 'consumption';
    
    return calculateIndustryImpact(baseImpact, industryType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{policy.name}</DialogTitle>
              <DialogDescription className="text-lg mt-2">
                {policy.description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {policy.category}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scenarios">政策シナリオ</TabsTrigger>
            <TabsTrigger value="impact-flow">影響経路</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Info className="w-4 h-4" />
                <span>
                  現在の{policy.name.replace('変更', '').replace('拡充', '').replace('改革', '')}: {getCurrentRate()}
                  {userRegion && policy.id === 'minimum-wage' && (
                    <span className="ml-2 text-blue-600">（{userRegion}）</span>
                  )}
                </span>
              </div>

              {/* カスタム入力セクション */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">カスタムシナリオ</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomInput(!showCustomInput)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Calculator className="w-4 h-4 mr-1" />
                      数値入力
                    </Button>
                  </div>
                  
                  {showCustomInput && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="custom-value" className="text-sm">
                          {policy.id === 'minimum-wage' && '時給（円）'}
                          {policy.id === 'consumption-tax' && '税率（%）'}
                          {policy.id === 'child-support' && '月額（円）'}
                          {!['minimum-wage', 'consumption-tax', 'child-support'].includes(policy.id) && '値'}
                        </Label>
                        <Input
                          id="custom-value"
                          type="number"
                          value={customValue}
                          onChange={(e) => setCustomValue(e.target.value)}
                          placeholder={
                            policy.id === 'minimum-wage' ? currentMinimumWage.toString() :
                            policy.id === 'consumption-tax' ? '10' :
                            policy.id === 'child-support' ? '15000' : '0'
                          }
                          className="w-24 text-center"
                        />
                        <Button
                          size="sm"
                          onClick={createCustomScenario}
                          disabled={!customValue || isNaN(Number(customValue))}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          作成
                        </Button>
                      </div>
                      <p className="text-xs text-slate-600">
                        任意の数値を入力して、独自のシナリオを作成できます
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {policy.scenarios.map((scenario: any, index: number) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedScenario === scenario 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              scenario.change > 0 ? 'bg-red-100' : scenario.change < 0 ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {scenario.change > 0 ? (
                                <TrendingUp className={`w-5 h-5 ${scenario.change > 0 ? 'text-red-600' : 'text-green-600'}`} />
                              ) : scenario.change < 0 ? (
                                <TrendingDown className="w-5 h-5 text-green-600" />
                              ) : (
                                <Calculator className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{scenario.label}</h3>
                              <p className="text-sm text-slate-600">
                                予想月額影響: 
                                <span className={`font-bold ml-1 ${
                                  getImpactEstimate(scenario) > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {getImpactEstimate(scenario) > 0 ? '+' : ''}{getImpactEstimate(scenario).toLocaleString()}円
                                </span>
                                {scenario.isCustom && (
                                  <Badge variant="outline" className="ml-2 text-xs border-purple-300 text-purple-700">
                                    カスタム
                                  </Badge>
                                )}
                              </p>
                              
                              {/* 波及効果の詳細表示 */}
                              {selectedScenario === scenario && (
                                <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                                  <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                      <div className="font-medium text-blue-600">直接効果</div>
                                      <div>{Math.round(getDetailedImpact(scenario)?.direct || 0).toLocaleString()}円</div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-orange-600">間接効果</div>
                                      <div>{Math.round(getDetailedImpact(scenario)?.indirect || 0).toLocaleString()}円</div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-green-600">誘発効果</div>
                                      <div>{Math.round(getDetailedImpact(scenario)?.induced || 0).toLocaleString()}円</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedScenario === scenario && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedScenario && (
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">選択中のシナリオ</CardTitle>
                  <CardDescription>
                    {selectedScenario.label} - 予想月額影響: 
                    <span className={`font-bold ml-1 ${
                      getImpactEstimate(selectedScenario) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getImpactEstimate(selectedScenario) > 0 ? '+' : ''}{getImpactEstimate(selectedScenario).toLocaleString()}円
                    </span>
                    {userRegion && (
                      <span className="text-sm text-slate-500 ml-2">（{userRegion}基準）</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => onSelect(policy.id, selectedScenario)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      このシナリオで分析実行
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="impact-flow" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">政策影響の経路</h3>
              <p className="text-slate-600">
                {policy.name}がどのように段階を経て最終的に所得に影響するかを示します
              </p>
            </div>

            <div className="space-y-4">
              {policy.impactFlow.map((step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStepColor(step.step)}`}>
                      {getStepIcon(step.step)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">{step.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              ステップ {step.step}
                            </Badge>
                          </div>
                          <p className="text-slate-600">{step.description}</p>
                          
                          {/* 定量的な波及効果表示 */}
                          {selectedScenario && step.step <= 3 && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                              <div className="text-xs text-blue-800">
                                <div className="font-medium mb-1">定量的影響（産業関連表ベース）</div>
                                {step.step === 1 && (
                                  <div>直接効果: {Math.round(getDetailedImpact(selectedScenario)?.direct || 0).toLocaleString()}円/月</div>
                                )}
                                {step.step === 2 && (
                                  <div>間接効果: {Math.round(getDetailedImpact(selectedScenario)?.indirect || 0).toLocaleString()}円/月</div>
                                )}
                                {step.step === 3 && (
                                  <div>誘発効果: {Math.round(getDetailedImpact(selectedScenario)?.induced || 0).toLocaleString()}円/月</div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {index < policy.impactFlow.length - 1 && (
                    <div className="flex justify-start ml-6 mt-2 mb-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">最終的な所得への影響</h4>
                  <p className="text-slate-600 mb-4">
                    これらの段階を経て、最終的にあなたの可処分所得に影響が現れます。
                    具体的な金額は、あなたの収入や家族構成、居住地域によって変わります。
                  </p>
                  
                  {/* 総合的な波及効果表示 */}
                  {selectedScenario && (
                    <div className="mb-4 p-3 bg-white rounded-lg border">
                      <div className="text-sm text-slate-700 mb-2">産業関連表による総合波及効果</div>
                      <div className="text-2xl font-bold text-teal-700">
                        波及倍率: {(getDetailedImpact(selectedScenario)?.totalMultiplier || 1).toFixed(2)}倍
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        初期影響が経済全体に与える総合的な効果
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => onSelect(policy.id, selectedScenario)}
                      className="border-teal-300 text-teal-700 hover:bg-teal-50"
                    >
                      詳細な影響額を計算する
                      <Calculator className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}