import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { ThumbsDown } from 'lucide-react';

const data = [
  { reason: 'Curiosos', pct: 30 },
  { reason: 'Fora da área', pct: 20 },
  { reason: 'Sem documentos', pct: 15 },
  { reason: 'Já tem advogado', pct: 12 },
  { reason: 'Sem interesse', pct: 10 },
  { reason: 'Outros', pct: 13 },
];

export function DiscardReasonsChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        <ThumbsDown className="h-4 w-4 text-destructive" />
        Motivos de Descarte pela IA
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Por que a IA descartou leads frios</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="reason"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 6%)',
                border: '1px solid hsl(217, 33%, 16%)',
                borderRadius: '12px',
                color: 'hsl(210, 40%, 96%)',
              }}
              formatter={(value: number) => [`${value}%`, 'Porcentagem']}
            />
            <Bar dataKey="pct" fill="hsl(0, 84%, 60%)" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
