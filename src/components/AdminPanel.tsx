import { useState } from 'react';
import { Building2, DollarSign, SlidersHorizontal, Shield, Save } from 'lucide-react';
import { AdminSettings } from '@/types/goldRate';

interface AdminPanelProps {
  settings: AdminSettings;
  onSettingsChange: (settings: AdminSettings) => void;
}

type TabType = 'api' | 'prices' | 'charges' | 'security';

export function AdminPanel({ settings, onSettingsChange }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('prices');

  const handleChange = (key: keyof AdminSettings, value: number | boolean | string) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleSave = () => {
    // Settings are auto-saved via useEffect in useGoldPrices
    // This is just visual feedback
    alert('Settings saved!');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'api', label: 'API', icon: <span className="text-xs">⚡</span> },
    { id: 'prices', label: 'Prices', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'charges', label: 'Charges', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="gold-card mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Admin</h2>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab flex items-center gap-2 ${
              activeTab === tab.id ? 'admin-tab-active' : 'admin-tab-inactive'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prices Tab Content */}
      {activeTab === 'prices' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Manual Override Toggle */}
            <div className="gold-card flex items-center justify-between">
              <span className="text-foreground">Manual Override</span>
              <button
                onClick={() => handleChange('manualOverride', !settings.manualOverride)}
                className={`admin-toggle ${settings.manualOverride ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.manualOverride ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* USD Input */}
            <div>
              <label className="block text-muted-foreground text-sm mb-2">USD</label>
              <input
                type="number"
                value={settings.usdOverride}
                onChange={(e) => handleChange('usdOverride', parseFloat(e.target.value) || 0)}
                className="admin-input w-full"
                step="0.01"
              />
            </div>

            {/* Exchange Rate & Symbol */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground text-sm mb-2">Exchange Rate</label>
                <input
                  type="number"
                  value={settings.exchangeRate}
                  onChange={(e) => handleChange('exchangeRate', parseFloat(e.target.value) || 1)}
                  className="admin-input w-full"
                  step="0.0001"
                />
              </div>
              <div>
                <label className="block text-muted-foreground text-sm mb-2">Symbol</label>
                <input
                  type="text"
                  value={settings.symbol}
                  onChange={(e) => handleChange('symbol', e.target.value)}
                  className="admin-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Enable Premiums Toggle */}
            <div className="gold-card flex items-center justify-between">
              <span className="text-foreground">Enable Premiums</span>
              <button
                onClick={() => handleChange('enablePremiums', !settings.enablePremiums)}
                className={`admin-toggle ${settings.enablePremiums ? 'bg-success' : 'bg-secondary'}`}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enablePremiums ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 10 Tola Premium */}
            <div>
              <div className="text-primary text-sm font-medium uppercase mb-1">10 TOLA PREMIUMS</div>
              <label className="block text-muted-foreground text-xs mb-2">10 Tola Premium</label>
              <input
                type="number"
                value={settings.premium10Tola}
                onChange={(e) => handleChange('premium10Tola', parseFloat(e.target.value) || 0)}
                className="admin-input w-full"
                step="0.1"
              />
            </div>

            {/* Ginni Premium */}
            <div>
              <div className="text-primary text-sm font-medium uppercase mb-1">GINNI PREMIUM</div>
              <label className="block text-muted-foreground text-xs mb-2">Ginni Premium</label>
              <input
                type="number"
                value={settings.premiumGinni}
                onChange={(e) => handleChange('premiumGinni', parseFloat(e.target.value) || 0)}
                className="admin-input w-full"
                step="0.1"
              />
            </div>

            {/* Per Gram Premiums */}
            <div>
              <div className="text-foreground text-sm mb-3">Per Gram Premiums</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground text-xs mb-2">24K</label>
                  <input
                    type="number"
                    value={settings.premium24k}
                    onChange={(e) => handleChange('premium24k', parseFloat(e.target.value) || 0)}
                    className="admin-input w-full"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-xs mb-2">22K</label>
                  <input
                    type="number"
                    value={settings.premium22k}
                    onChange={(e) => handleChange('premium22k', parseFloat(e.target.value) || 0)}
                    className="admin-input w-full"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-xs mb-2">21K</label>
                  <input
                    type="number"
                    value={settings.premium21k}
                    onChange={(e) => handleChange('premium21k', parseFloat(e.target.value) || 0)}
                    className="admin-input w-full"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-xs mb-2">18K</label>
                  <input
                    type="number"
                    value={settings.premium18k}
                    onChange={(e) => handleChange('premium18k', parseFloat(e.target.value) || 0)}
                    className="admin-input w-full"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab === 'api' && (
        <div className="text-muted-foreground text-center py-8">
          API Configuration - Coming Soon
        </div>
      )}
      {activeTab === 'charges' && (
        <div className="text-muted-foreground text-center py-8">
          Making Charges Configuration - Coming Soon
        </div>
      )}
      {activeTab === 'security' && (
        <div className="text-muted-foreground text-center py-8">
          Security Settings - Coming Soon
        </div>
      )}
    </div>
  );
}
