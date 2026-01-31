import { useState } from 'react';
import { Building2, DollarSign, SlidersHorizontal, Shield, Save, Zap, Sun, Moon, Trash2, Plus } from 'lucide-react';
import { AdminSettings, MakingCharge } from '@/types/goldRate';

interface AdminPanelProps {
  settings: AdminSettings;
  onSettingsChange: (settings: AdminSettings) => void;
  onTestApi?: () => Promise<boolean>;
  apiTestResult?: 'success' | 'error' | null;
}

type TabType = 'api' | 'prices' | 'charges' | 'security';

export function AdminPanel({ settings, onSettingsChange, onTestApi, apiTestResult }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('prices');
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');

  const handleChange = (key: keyof AdminSettings, value: number | boolean | string) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleSave = () => {
    alert('Settings saved!');
  };

  const handleAddRegion = () => {
    const newCharge: MakingCharge = {
      id: Date.now().toString(),
      name: 'NEW REGION',
      above: 4.0,
      below: 3.0,
    };
    onSettingsChange({
      ...settings,
      makingCharges: [...settings.makingCharges, newCharge],
    });
  };

  const handleDeleteRegion = (id: string) => {
    onSettingsChange({
      ...settings,
      makingCharges: settings.makingCharges.filter(c => c.id !== id),
    });
  };

  const handleUpdateCharge = (id: string, field: keyof MakingCharge, value: string | number) => {
    onSettingsChange({
      ...settings,
      makingCharges: settings.makingCharges.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const handlePinChange = () => {
    setPinError('');
    
    if (pinForm.oldPin !== settings.adminPin) {
      setPinError('Old PIN is incorrect');
      return;
    }
    
    if (pinForm.newPin.length < 4) {
      setPinError('New PIN must be at least 4 characters');
      return;
    }
    
    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinError('New PIN and Confirm PIN do not match');
      return;
    }
    
    onSettingsChange({
      ...settings,
      adminPin: pinForm.newPin,
    });
    
    setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
    alert('PIN changed successfully!');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'api', label: 'API', icon: <Zap className="w-4 h-4" /> },
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

      {/* API Tab Content */}
      {activeTab === 'api' && (
        <div className="space-y-6 max-w-md">
          {/* Demo Mode Toggle */}
          <div className="gold-card flex items-center justify-between">
            <span className="text-foreground">Demo Mode</span>
            <button
              onClick={() => handleChange('demoMode', !settings.demoMode)}
              className={`admin-toggle ${settings.demoMode ? 'bg-primary' : 'bg-secondary'}`}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.demoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-muted-foreground text-sm mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="2917bf5d71e666e9905ddca2a7d2ac6b"
                className="admin-input flex-1"
              />
              <button
                onClick={onTestApi}
                className="px-4 py-2 bg-secondary text-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors"
              >
                Test
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Get your key from{' '}
              <a 
                href="https://metalpriceapi.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                metalpriceapi.com
              </a>
            </p>
            {apiTestResult === 'success' && (
              <p className="text-xs text-success mt-1">API connection successful!</p>
            )}
            {apiTestResult === 'error' && (
              <p className="text-xs text-destructive mt-1">API connection failed. Check your key.</p>
            )}
          </div>

          {/* Refresh Interval */}
          <div>
            <label className="block text-muted-foreground text-sm mb-2">Refresh Interval (s)</label>
            <input
              type="number"
              value={settings.refreshInterval}
              onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value) || 120)}
              className="admin-input w-full"
              min="60"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Default: 120s. Lower values increase API usage.
            </p>
          </div>
        </div>
      )}

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

      {/* Charges Tab Content */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          {/* Show Making Charges Toggle */}
          <div className="gold-card flex items-center justify-between">
            <span className="text-foreground">Show Making Charges</span>
            <button
              onClick={() => handleChange('showMakingCharges', !settings.showMakingCharges)}
              className={`admin-toggle ${settings.showMakingCharges ? 'bg-success' : 'bg-secondary'}`}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.showMakingCharges ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Charges Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-foreground font-medium">Charges</span>
              <button
                onClick={handleAddRegion}
                className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary rounded-md text-sm hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Region
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
                <div className="col-span-4">Region Name</div>
                <div className="col-span-6">Display Range</div>
                <div className="col-span-2 text-right">Del</div>
              </div>

              {/* Table Rows */}
              {settings.makingCharges.map((charge) => (
                <div 
                  key={charge.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={charge.name}
                      onChange={(e) => handleUpdateCharge(charge.id, 'name', e.target.value.toUpperCase())}
                      className="bg-transparent text-foreground font-medium focus:outline-none focus:text-primary w-full"
                    />
                  </div>
                  <div className="col-span-6 flex items-center gap-2">
                    <input
                      type="number"
                      value={charge.above}
                      onChange={(e) => handleUpdateCharge(charge.id, 'above', parseFloat(e.target.value) || 0)}
                      className="bg-transparent text-primary w-16 focus:outline-none"
                      step="0.1"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={charge.below}
                      onChange={(e) => handleUpdateCharge(charge.id, 'below', parseFloat(e.target.value) || 0)}
                      className="bg-transparent text-foreground w-16 focus:outline-none"
                      step="0.1"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => handleDeleteRegion(charge.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab Content */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-md">
          {/* Theme Toggle */}
          <div className="gold-card flex items-center justify-between">
            <span className="text-foreground">Theme</span>
            <div className="flex items-center gap-2 bg-secondary rounded-md p-1">
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`p-2 rounded transition-colors ${
                  settings.theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`p-2 rounded transition-colors ${
                  settings.theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Change Admin PIN */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Change Admin PIN</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-muted-foreground text-sm mb-2">Old PIN</label>
                <input
                  type="password"
                  value={pinForm.oldPin}
                  onChange={(e) => setPinForm({ ...pinForm, oldPin: e.target.value })}
                  className="admin-input w-full"
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground text-sm mb-2">New PIN</label>
                <input
                  type="password"
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                  className="admin-input w-full"
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground text-sm mb-2">Confirm New PIN</label>
                <input
                  type="password"
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                  className="admin-input w-full"
                />
              </div>
              
              {pinError && (
                <p className="text-destructive text-sm">{pinError}</p>
              )}
              
              <button
                onClick={handlePinChange}
                className="px-4 py-2 bg-secondary text-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
