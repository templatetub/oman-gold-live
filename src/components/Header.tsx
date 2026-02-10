import { useState, useEffect, useRef, useCallback } from 'react';
import { useClock } from '@/hooks/useClock';
import { RefreshCw, Sun, Moon, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const AUTO_SWITCH_SECONDS = 5;

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

  const [autoSwitch, setAutoSwitch] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_SWITCH_SECONDS);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('oman_gold_theme');
    return stored ? stored === 'dark' : true;
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('oman_gold_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  }, [language, setLanguage]);

  // Auto-switch timer logic
  useEffect(() => {
    if (!autoSwitch) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCountdown(AUTO_SWITCH_SECONDS);
      return;
    }

    setCountdown(AUTO_SWITCH_SECONDS);
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          toggleLanguage();
          return AUTO_SWITCH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSwitch, toggleLanguage]);

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
        <button 
          onClick={() => setAutoSwitch(prev => !prev)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
            autoSwitch 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${autoSwitch ? 'animate-spin' : ''}`} />
          <span>{countdown}</span>
        </button>
        
        <button 
          onClick={() => setIsDark(prev => !prev)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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