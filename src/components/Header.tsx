import { useClock } from '@/hooks/useClock';
import { RefreshCw, Sun, Globe, Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
interface HeaderProps {
  showBackButton?: boolean;
}
export function Header({
  showBackButton = false
}: HeaderProps) {
  const {
    formattedTime,
    formattedDate
  } = useClock();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  };
  return <header className="flex items-center justify-between py-4 px-6 border-b border-border">
      <div className="flex-1 flex items-center">
        {showBackButton ? <Link to="/" className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t.backToDashboard}</span>
          </Link> : null}
      </div>
      
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
        
        <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-base font-bold border-primary border-solid shadow-sm text-center">
          <Globe className="w-4 h-4" />
          <span className="text-sm">{language}</span>
        </button>

        {!showBackButton && <Link to="/admin" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </Link>}
      </div>
    </header>;
}