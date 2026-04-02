import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';
import { mockPerformanceData } from '@/data/mockData';

export function PerformanceChart() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Leads Totais vs Qualificados</h3>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(217, 33%, 6%)', border: '1px solid hsl(217, 33%, 16%)', borderRadius: '12px' }}
              labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
            />
            <Legend wrapperStyle={{ color: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
            <Bar dataKey="leadsTotal" name="Leads Totais" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="leadsQualificados" name="Qualificados IA" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Tempo Médio de Atendimento IA</span>
          </div>
          <p className="text-lg font-bold text-primary">2.4 min</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--emerald))]" />
            <span className="text-[10px] text-muted-foreground">Honorários Pendentes (est.)</span>
          </div>
          <p className="text-lg font-bold text-[hsl(var(--emerald))]">R$ 245.000</p>
        </div>
      </div>
    </div>
  );
}
