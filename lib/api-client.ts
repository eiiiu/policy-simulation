// API client for policy simulation service
// Handles all communication with backend services

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    version: string;
    cached: boolean;
  };
}

export interface PolicyListResponse {
  policies: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    status: 'active' | 'draft' | 'archived';
    lastUpdated: string;
  }>;
  totalCount: number;
  categories: string[];
}

export interface SimulationRequest {
  policyId: string;
  userParameters: {
    income: number;
    familySize: string;
    region: string;
    age: number;
    occupation?: string;
    hasHomeLoan?: boolean;
  };
  analysisLevel: 'simple' | 'detailed' | 'expert';
}

export interface SimulationResponse {
  sessionId: string;
  results: {
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
      breakdown: {
        directEffect: number;
        indirectEffect: number;
        generalEquilibriumEffect: number;
      };
    };
    expert: {
      assumptions: string[];
      sensitivity: Array<{
        parameter: string;
        impact: string;
      }>;
      methodology: {
        calculationFormula: string;
        dataSources: string[];
        validationResults: {
          accuracy: number;
          robustness: number;
        };
      };
    };
  };
  metadata: {
    calculationTime: number;
    dataVersion: string;
    confidenceScore: number;
  };
}

export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          cached: response.headers.get('x-cache') === 'HIT',
        },
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPolicies(category?: string): Promise<ApiResponse<PolicyListResponse>> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<PolicyListResponse>(`/policies${params}`);
  }

  async simulatePolicy(request: SimulationRequest): Promise<ApiResponse<SimulationResponse>> {
    return this.request<SimulationResponse>('/simulate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async comparePolicies(
    requests: SimulationRequest[]
  ): Promise<ApiResponse<{ comparisons: SimulationResponse[]; analysis: any }>> {
    return this.request('/compare', {
      method: 'POST',
      body: JSON.stringify({ scenarios: requests }),
    });
  }

  async getEconomicData(
    dataType: string,
    region?: string,
    dateRange?: { from: string; to: string }
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    params.append('type', dataType);
    if (region) params.append('region', region);
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }

    return this.request(`/economic-data?${params.toString()}`);
  }

  async saveAnalysis(
    sessionId: string,
    metadata: { title?: string; notes?: string }
  ): Promise<ApiResponse<{ analysisId: string }>> {
    return this.request('/analysis/save', {
      method: 'POST',
      body: JSON.stringify({ sessionId, metadata }),
    });
  }

  async getAnalysisHistory(
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<{ analyses: any[]; total: number }>> {
    return this.request(`/analysis/history?limit=${limit}&offset=${offset}`);
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Utility functions for data transformation
export const transformPolicyData = (rawPolicy: any) => ({
  id: rawPolicy.id,
  name: rawPolicy.name,
  category: rawPolicy.category,
  description: rawPolicy.description,
  parameters: rawPolicy.parameters || {},
  isActive: rawPolicy.status === 'active',
  lastUpdated: new Date(rawPolicy.lastUpdated),
});

export const formatSimulationResults = (results: SimulationResponse) => ({
  ...results,
  results: {
    ...results.results,
    simple: {
      ...results.results.simple,
      monthlyImpact: Math.round(results.results.simple.monthlyImpact),
    },
    detailed: {
      ...results.results.detailed,
      scenarios: results.results.detailed.scenarios.map(scenario => ({
        ...scenario,
        impact: Math.round(scenario.impact),
      })),
      timeline: results.results.detailed.timeline.map(point => ({
        ...point,
        impact: Math.round(point.impact),
      })),
    },
  },
});