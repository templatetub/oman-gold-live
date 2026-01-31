import { useClock } from '@/hooks/useClock';
import { RefreshCw, Sun, Globe } from 'lucide-react';

export function Header() {
  const { formattedTime, formattedDate } = useClock();

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border">
      <div className="flex-1" />
      
      <div className="text-center font-mono">
        <span className="text-lg text-foreground tracking-wider">
          {formattedTime} - {formattedDate}
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-end gap-4">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>5</span>
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Sun className="w-5 h-5" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" />
          <span className="text-sm">AR</span>
        </button>
      </div>
    </header>
  );
}
