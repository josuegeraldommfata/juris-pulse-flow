import { Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

const data = [
  { hour: '06h', tokens: 2 },
  { hour: '08h', tokens: 12 },
  { hour: '10h', tokens: 28 },
  { hour: '12h', tokens: 18 },
  { hour: '14h', tokens: 35 },
  { hour: '16h', tokens: 42 },
  { hour: '18h', tokens: 30 },
  { hour: '20h', tokens: 15 },
  { hour: '22h', tokens: 5 },
];

export function TokenConsumptionChart() {
  const peak = data.reduce((max, d) => d.tokens > max.tokens ? d : max, data[0]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          Consumo de Tokens (Hoje)
        </h3>
        <p className="text-xs text-muted-foreground">
          Pico: <strong className="text-accent">{peak.tokens} tokens</strong> às {peak.hour}
        </p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" />
            <XAxis dataKey="hour" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 6%)',
                border: '1px solid hsl(217, 33%, 16%)',
                borderRadius: '12px',
                color: 'hsl(210, 40%, 96%)',
              }}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="hsl(160, 84%, 39%)"
              fill="url(#tokenGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
