import { Header } from '@/components/Header';
import { AdminPanel } from '@/components/AdminPanel';
import { useGoldPricesContext } from '@/contexts/GoldPricesContext';

const Admin = () => {
  const { 
    adminSettings, 
    setAdminSettings, 
    testApiConnection,
    apiTestResult,
  } = useGoldPricesContext();

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
