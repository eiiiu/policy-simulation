// Policy Simulation Engine
// Core calculation engine for policy impact analysis

import { getRegionalData, calculateIndustryImpact } from './regional-data';
export interface UserParameters {
  income: number;
  familySize: string;
  region: string;
  age: number;
  occupation?: string;
  hasHomeLoan?: boolean;
}

export interface PolicyParameters {
  id: string;
  type: string;
  baseRate: number;
  newRate: number;
  implementationDate: string;
  duration?: number;
}

export interface SimulationResult {
  directEffect: number;
  indirectEffect: number;
  generalEquilibriumEffect: number;
  totalImpact: number;
  confidence: 'high' | 'medium' | 'low';
  scenarios: Array<{
    name: string;
    impact: number;
    probability: number;
  }>;
}

export class SimulationEngine {
  // Regional economic multipliers
  private regionalMultipliers: Record<string, number> = {
    '東京都': 1.15,
    '大阪府': 1.08,
    '愛知県': 1.05,
    '神奈川県': 1.12,
    '埼玉県': 1.02,
    '千葉県': 1.03,
    // Add more regions...
  };

  // Family composition multipliers
  private familyMultipliers: Record<string, number> = {
    'single': 1.0,
    'couple': 1.6,
    'couple-1child': 2.2,
    'couple-2children': 2.8,
    'couple-3children': 3.4,
    'single-parent': 1.8,
  };

  // Age-based consumption pattern adjustments
  private ageMultipliers: Record<string, number> = {
    '20-29': 0.95,
    '30-39': 1.05,
    '40-49': 1.15,
    '50-59': 1.10,
    '60+': 0.85,
  };

  calculateConsumptionTaxImpact(
    userParams: UserParameters,
    policyParams: PolicyParameters
  ): SimulationResult {
    const { income, familySize, region, age } = userParams;
    const { baseRate, newRate } = policyParams;

    // 地域別データの取得
    const regionalData = getRegionalData(region);
    if (!regionalData) {
      throw new Error(`Regional data not found for ${region}`);
    }
    // Calculate annual consumption based on income
    const consumptionRate = this.getConsumptionRate(income);
    const annualConsumption = income * 10000 * consumptionRate;

    // Apply multipliers
    const regionMultiplier = regionalData.economicMultiplier;
    const familyMultiplier = this.familyMultipliers[familySize] || 1.0;
    const ageGroup = this.getAgeGroup(age);
    const ageMultiplier = this.ageMultipliers[ageGroup] || 1.0;
    const consumptionIndex = regionalData.consumptionIndex;

    const adjustedConsumption = annualConsumption * regionMultiplier * familyMultiplier * ageMultiplier * consumptionIndex;

    // Direct effect: immediate tax burden change
    const directEffect = adjustedConsumption * (newRate - baseRate) / 100;

    // 産業関連表による波及効果計算
    const rippleEffects = calculateIndustryImpact(Math.abs(directEffect), 'consumption');
    
    // 符号を考慮した効果計算
    const sign = directEffect >= 0 ? 1 : -1;
    const indirectEffect = rippleEffects.indirect * sign;
    const inducedEffect = rippleEffects.induced * sign;

    const totalImpact = rippleEffects.total * sign;
    const monthlyImpact = totalImpact / 12;

    // Generate scenarios
    const scenarios = this.generateScenarios(monthlyImpact);

    return {
      directEffect: rippleEffects.direct * sign / 12,
      indirectEffect: indirectEffect / 12,
      generalEquilibriumEffect: inducedEffect / 12,
      totalImpact: monthlyImpact,
      confidence: this.calculateConfidence(income, familySize),
      scenarios
    };
  }

  calculateMinimumWageImpact(
    userParams: UserParameters,
    currentWage: number,
    newWage: number
  ): SimulationResult {
    const { income, familySize, region, age } = userParams;
    
    // 地域別データの取得
    const regionalData = getRegionalData(region);
    if (!regionalData) {
      throw new Error(`Regional data not found for ${region}`);
    }

    // 最低賃金労働者への直接影響（月160時間労働想定）
    const monthlyHours = 160;
    const directMonthlyImpact = (newWage - currentWage) * monthlyHours;
    
    // 地域の産業構造を考慮した波及効果
    const serviceRatio = regionalData.industryStructure.tertiary / 100;
    const adjustedImpact = directMonthlyImpact * serviceRatio * regionalData.economicMultiplier;
    
    // 産業関連表による波及効果
    const rippleEffects = calculateIndustryImpact(Math.abs(adjustedImpact), 'services');
    const sign = adjustedImpact >= 0 ? 1 : -1;
    
    const scenarios = this.generateScenarios(rippleEffects.total * sign);

    return {
      directEffect: rippleEffects.direct * sign,
      indirectEffect: rippleEffects.indirect * sign,
      generalEquilibriumEffect: rippleEffects.induced * sign,
      totalImpact: rippleEffects.total * sign,
      confidence: this.calculateConfidence(income, familySize),
      scenarios
    };
  }
  private getConsumptionRate(income: number): number {
    // Consumption rate decreases with income (based on empirical data)
    if (income < 3000000) return 0.85;
    if (income < 5000000) return 0.75;
    if (income < 8000000) return 0.65;
    if (income < 12000000) return 0.55;
    return 0.45;
  }

  private getAgeGroup(age: number): string {
    if (age < 30) return '20-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    if (age < 60) return '50-59';
    return '60+';
  }

  private calculateIndirectEffect(directEffect: number, income: number): number {
    // Indirect effects are typically 15-25% of direct effects
    const elasticity = income > 5000000 ? 0.15 : 0.25;
    return directEffect * elasticity;
  }

  private calculateGeneralEquilibriumEffect(directEffect: number, region: string): number {
    // General equilibrium effects vary by region
    const multiplier = this.regionalMultipliers[region] || 1.0;
    return directEffect * 0.1 * multiplier;
  }

  private generateScenarios(baseImpact: number): Array<{ name: string; impact: number; probability: number }> {
    return [
      {
        name: '楽観シナリオ',
        impact: Math.round(baseImpact * 0.7),
        probability: 30
      },
      {
        name: '基準シナリオ',
        impact: Math.round(baseImpact),
        probability: 50
      },
      {
        name: '悲観シナリオ',
        impact: Math.round(baseImpact * 1.3),
        probability: 20
      }
    ];
  }

  private calculateConfidence(income: number, familySize: string): 'high' | 'medium' | 'low' {
    // Higher confidence for standard family types and income ranges
    if (income >= 3000000 && income <= 8000000 && 
        ['couple', 'couple-1child', 'couple-2children'].includes(familySize)) {
      return 'high';
    }
    if (income >= 2000000 && income <= 12000000) {
      return 'medium';
    }
    return 'low';
  }
}

export const simulationEngine = new SimulationEngine();