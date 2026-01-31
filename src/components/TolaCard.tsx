interface TolaCardProps {
  price: number;
  symbol: string;
}

export function TolaCard({ price, symbol }: TolaCardProps) {
  return (
    <div className="gold-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm font-medium">{symbol}</span>
      </div>
      
      <div className="price-display text-foreground mb-2">
        {price.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}
      </div>
      
      <div className="flex items-center">
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">10 Tola.</span>
      </div>
    </div>
  );
}
