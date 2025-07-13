"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';

interface PolicyComparisonProps {
  policies: any[];
}

export default function PolicyComparison({ policies }: PolicyComparisonProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">政策比較分析</h3>
        <p className="text-slate-600">選択した政策の影響を比較して確認できます</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {policies.map((policy, index) => (
          <Card key={index} className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{policy.category}</Badge>
                <div className="flex items-center space-x-1">
                  {policy.impact > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    policy.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {policy.impact > 0 ? '+' : ''}{policy.impact.toLocaleString()}円/月
                  </span>
                </div>
              </div>
              <CardTitle>{policy.name}</CardTitle>
              <CardDescription>{policy.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>実施確度</span>
                  <span>{policy.likelihood}%</span>
                </div>
                <Progress value={policy.likelihood} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{policy.timeline}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{policy.affected}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}