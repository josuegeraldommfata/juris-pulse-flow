import { Wallet, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface Props {
  onBuyTokens: () => void;
}

export function WalletCard({ onBuyTokens }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const percentage = (user.tokensAvailable / user.tokensTotal) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 glow-emerald">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Tokens Disponíveis</h3>
        </div>
        <Button
          size="sm"
          onClick={onBuyTokens}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1"
        >
          <Plus className="h-3 w-3" />
          Recarregar
        </Button>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              stroke="hsl(var(--border))"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50" cy="50" r="45"
              stroke="hsl(var(--emerald))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gradient-emerald">{user.tokensAvailable}</span>
            <span className="text-[10px] text-muted-foreground">tokens</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Total Adquirido</p>
            <p className="text-lg font-bold text-foreground">{user.tokensTotal.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Consumido</p>
            <p className="text-lg font-bold text-accent">{user.tokensConsumed.toLocaleString()}</p>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
