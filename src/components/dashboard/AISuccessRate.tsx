import { Bot, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { week: 'Sem 1', iaSuccess: 38, humanHelp: 7 },
  { week: 'Sem 2', iaSuccess: 45, humanHelp: 5 },
  { week: 'Sem 3', iaSuccess: 52, humanHelp: 8 },
  { week: 'Sem 4', iaSuccess: 60, humanHelp: 4 },
];

export function AISuccessRate() {
  const totalSuccess = data.reduce((a, d) => a + d.iaSuccess, 0);
  const totalHuman = data.reduce((a, d) => a + d.humanHelp, 0);
  const rate = Math.round((totalSuccess / (totalSuccess + totalHuman)) * 100);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Taxa de Sucesso da IA
        </h3>
        <div className="text-2xl font-bold text-gradient-electric">{rate}%</div>
      </div>
      <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> IA Finalizou
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Precisou Humano
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" />
            <XAxis dataKey="week" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 6%)',
                border: '1px solid hsl(217, 33%, 16%)',
                borderRadius: '12px',
                color: 'hsl(210, 40%, 96%)',
              }}
            />
            <Bar dataKey="iaSuccess" name="IA Finalizou" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="humanHelp" name="Precisou Humano" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
