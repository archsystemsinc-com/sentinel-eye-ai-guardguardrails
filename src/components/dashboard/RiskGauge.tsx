
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface RiskGaugeProps {
  value: number;
  className?: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, className }) => {
  // Clamp risk score between 0-100
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  // Determine color based on risk level
  const getColor = (value: number) => {
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Determine indicator label
  const getRiskLabel = (value: number) => {
    if (value < 30) return 'Low Risk';
    if (value < 70) return 'Medium Risk';
    return 'High Risk';
  };

  // Get the indicator color
  const indicatorColor = getColor(normalizedValue);
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
      <Progress
        value={normalizedValue}
        className="h-3 bg-gray-200"
      />
      <div 
        className={`absolute -bottom-6 transform -translate-x-1/2 ${indicatorColor} h-4 w-4 rounded-full border-2 border-white`} 
        style={{ left: `${normalizedValue}%` }}
      />
      <div className="text-center mt-8">
        <span className="text-sm font-medium">{getRiskLabel(normalizedValue)}</span>
        <span className="text-xs text-gray-500 ml-2">({normalizedValue}%)</span>
      </div>
    </div>
  );
};

export default RiskGauge;
