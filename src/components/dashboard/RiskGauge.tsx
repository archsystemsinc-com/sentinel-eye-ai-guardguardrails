
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RiskGaugeProps {
  value: number;
  label?: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, label = 'Risk Score' }) => {
  // Calculate the color based on risk level
  const getColor = (value: number) => {
    if (value < 20) return 'bg-green-500';
    if (value < 40) return 'bg-blue-500';
    if (value < 60) return 'bg-yellow-500';
    if (value < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskLabel = (value: number) => {
    if (value < 20) return 'Low';
    if (value < 40) return 'Moderate';
    if (value < 60) return 'Elevated';
    if (value < 80) return 'High';
    return 'Critical';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-lg font-medium">{getRiskLabel(value)}</span>
          </div>
          <Progress
            value={value}
            className="h-3"
            indicatorClassName={getColor(value)}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low Risk</span>
            <span>Critical Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskGauge;
