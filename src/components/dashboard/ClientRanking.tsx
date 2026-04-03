import { Trophy, TrendingUp } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

export function ClientRanking() {
  const ranked = [...mockUsers]
    .sort((a, b) => b.tokensConsumed - a.tokensConsumed)
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-yellow-400" />
        Ranking de Clientes
      </h3>
      <div className="space-y-3">
        {ranked.map((user, i) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{medals[i] || `${i + 1}º`}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{user.office}</p>
                <p className="text-xs text-muted-foreground">{user.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-accent">{user.tokensConsumed}</p>
              <p className="text-xs text-muted-foreground">tokens usados</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
