import { useClock } from '@/hooks/useClock';

interface GinniCardProps {
  price: number;
  symbol: string;
  lastUpdate: Date;
}

export function GinniCard({ price, symbol, lastUpdate }: GinniCardProps) {
  const { formatUpdateTime } = useClock();

  return (
    <div className="ginni-card">
      <div className="text-center">
        <div className="text-muted-foreground text-sm font-medium mb-2">
          GINNI (21K)
        </div>
        
        <div className="price-display-large gold-text mb-3">
          {price}
        </div>
        
        <div className="inline-block gold-badge mb-4">
          {symbol}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last Update On {formatUpdateTime(lastUpdate)}{' '}
          <span className="live-badge ml-2">LIVE</span>
        </div>
      </div>
    </div>
  );
}
