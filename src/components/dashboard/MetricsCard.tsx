
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-white border-gray-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-amber-50 border-amber-100',
    danger: 'bg-red-50 border-red-100',
  };

  const iconColors = {
    default: 'text-blue-500 bg-blue-100',
    success: 'text-green-500 bg-green-100',
    warning: 'text-amber-500 bg-amber-100', 
    danger: 'text-red-500 bg-red-100',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <Card className={cn("overflow-hidden", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && trendValue && (
                <span className={cn("text-sm font-medium", trendColors[trend])}>
                  {trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
          {icon && (
            <div className={cn("p-2 rounded-full", iconColors[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
