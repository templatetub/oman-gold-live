import { Header } from '@/components/Header';
import { USDCard } from '@/components/USDCard';
import { TolaCard } from '@/components/TolaCard';
import { GinniCard } from '@/components/GinniCard';
import { LiveMarketRates } from '@/components/LiveMarketRates';
import { MakingCharges } from '@/components/MakingCharges';
import { AdminPanel } from '@/components/AdminPanel';
import { useGoldPrices } from '@/hooks/useGoldPrices';

const Index = () => {
  const { priceData, adminSettings, setAdminSettings, trend } = useGoldPrices();

  const karatRates = [
    { karat: '24 Karat', price: priceData.perGram24k },
    { karat: '22 Karat', price: priceData.perGram22k },
    { karat: '21 Karat', price: priceData.perGram21k },
    { karat: '18 Karat', price: priceData.perGram18k },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-6">
        {/* Main Price Cards Row */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* USD Card */}
          <div className="col-span-3">
            <USDCard 
              usdPerOunce={priceData.usdPerOunce} 
              trend={trend}
            />
          </div>
          
          {/* 10 Tola Card */}
          <div className="col-span-3">
            <TolaCard 
              price={priceData.tola10WithPremium} 
              symbol={adminSettings.symbol}
            />
          </div>
          
          {/* Live Market Rates */}
          <div className="col-span-6 row-span-2">
            <LiveMarketRates 
              rates={karatRates} 
              symbol={adminSettings.symbol}
            />
          </div>
          
          {/* Ginni Card */}
          <div className="col-span-6">
            <GinniCard 
              price={priceData.ginniPrice}
              symbol={adminSettings.symbol}
              lastUpdate={priceData.lastUpdate}
            />
          </div>
        </div>

        {/* Making Charges */}
        <MakingCharges />

        {/* Admin Panel */}
        <AdminPanel 
          settings={adminSettings}
          onSettingsChange={setAdminSettings}
        />
      </main>
    </div>
  );
};

export default Index;
