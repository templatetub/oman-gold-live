import { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminPanel } from '@/components/AdminPanel';
import { PinProtection } from '@/components/PinProtection';
import { useGoldPricesContext } from '@/contexts/GoldPricesContext';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { 
    adminSettings, 
    setAdminSettings, 
    testApiConnection,
    apiTestResult,
  } = useGoldPricesContext();

  if (!isAuthenticated) {
    return (
      <PinProtection 
        correctPin={adminSettings.adminPin} 
        onSuccess={() => setIsAuthenticated(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="container mx-auto px-6 py-6">
        <AdminPanel 
          settings={adminSettings}
          onSettingsChange={setAdminSettings}
          onTestApi={testApiConnection}
          apiTestResult={apiTestResult}
        />
      </main>
    </div>
  );
};

export default Admin;
