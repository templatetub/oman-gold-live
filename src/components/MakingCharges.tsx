import { MakingCharge } from '@/types/goldRate';

const DEFAULT_MAKING_CHARGES: MakingCharge[] = [
  { name: 'TURKISH', above: 4.5, below: 3.8 },
  { name: 'SAUDI', above: 4.8, below: 4 },
  { name: 'SINGAPORE', above: 3.5, below: 3 },
  { name: 'OMANI', above: 3.5, below: 3 },
  { name: 'EMIRATI', above: 3.8, below: 2.8 },
  { name: 'INDIAN', above: 4, below: 3.5 },
  { name: 'BAHRAINI', above: 4, below: 3.5 },
  { name: 'KHWATI', above: 4, below: 3.5 },
];

export function MakingCharges() {
  return (
    <div className="mt-6">
      <div className="text-center text-muted-foreground text-sm tracking-wider mb-4">
        MAKING CHARGE STARTING ------{'>'} LESS THEN 2.00 GRM MAKING PER PIECE
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {DEFAULT_MAKING_CHARGES.map((charge) => (
          <div key={charge.name} className="making-charge-card">
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
