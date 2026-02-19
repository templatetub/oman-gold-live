import { MakingCharge } from '@/types/goldRate';
import { useLanguage } from '@/contexts/LanguageContext';

interface MakingChargesProps {
  charges: MakingCharge[];
  show: boolean;
}

export function MakingCharges({ charges, show }: MakingChargesProps) {
  const { t, localizeText } = useLanguage();

  if (!show) return null;

  const getChargeName = (name: string) => {
    const nameMap: Record<string, string> = {
      'TURKISH': t.chargeTurkish,
      'SAUDI': t.chargeSaudi,
      'SINGAPORE': t.chargeSingapore,
      'OMANI': t.chargeOmani,
      'EMIRATI': t.chargeEmirati,
      'INDIAN': t.chargeIndian,
      'BAHRAINI': t.chargeBahraini,
      'KHWATI': t.chargeKhwati
    };
    return nameMap[name] || name;
  };

  return (
    <div className="mt-6">
      <div className="text-center text-muted-foreground text-base tracking-wider mb-4">
        {t.makingChargeTitle}
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {charges.map((charge) =>
        <div key={charge.id} className="making-charge-card">
            <div className="text-muted-foreground text-lg font-medium mb-2 uppercase">
              {getChargeName(charge.name)}
            </div>
            <div className="font-mono text-3xl text-foreground">
              <span className="gold-text font-bold">{localizeText(String(charge.above))}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="text-foreground font-bold">{localizeText(String(charge.below))}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}