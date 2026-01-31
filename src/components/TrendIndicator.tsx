import { TrendingUp, TrendingDown } from 'lucide-react';
import { TrendData } from '@/types/goldRate';

interface TrendIndicatorProps {
  trend: TrendData;
  showPercentage?: boolean;
  size?: 'sm' | 'md';
}

export function TrendIndicator({ trend, showPercentage = true, size = 'sm' }: TrendIndicatorProps) {
  if (trend.direction === 'neutral') {
    return null;
  }

  const isUp = trend.direction === 'up';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-1 ${isUp ? 'trend-up' : 'trend-down'}`}>
      {isUp ? (
        <TrendingUp className={iconSize} />
      ) : (
        <TrendingDown className={iconSize} />
      )}
      {showPercentage && (
        <span className={`${textSize} font-medium`}>
          {isUp ? '+' : '-'}{trend.percentage.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
