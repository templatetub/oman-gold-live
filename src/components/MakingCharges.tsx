import { MakingCharge } from '@/types/goldRate';

interface MakingChargesProps {
  charges: MakingCharge[];
  show: boolean;
}

export function MakingCharges({ charges, show }: MakingChargesProps) {
  if (!show) return null;

  return (
    <div className="mt-6">
      <div className="text-center text-muted-foreground text-sm tracking-wider mb-4">
        MAKING CHARGE STARTING ------{'>'} LESS THEN 2.00 GRM MAKING PER PIECE
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {charges.map((charge) => (
          <div key={charge.id} className="making-charge-card">
            <div className="text-muted-foreground text-xs font-medium mb-1 uppercase">
              {charge.name}
            </div>
            <div className="font-mono text-lg text-foreground">
              <span className="gold-text">{charge.above}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="text-foreground">{charge.below}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
