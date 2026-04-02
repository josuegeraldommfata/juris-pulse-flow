import { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FeeCalculator() {
  const [valorCausa, setValorCausa] = useState(100000);
  const [percentual, setPercentual] = useState(30);

  const bruto = (valorCausa * percentual) / 100;
  const impostos = bruto * 0.15;
  const liquido = bruto - impostos;

  const data = [
    { name: 'Bruto', value: bruto },
    { name: 'Impostos', value: impostos },
    { name: 'Líquido', value: liquido },
  ];

  const colors = ['hsl(217, 91%, 60%)', 'hsl(0, 84%, 60%)', 'hsl(160, 84%, 39%)'];

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Calculadora de Êxito</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Valor da Causa (R$)</label>
          <Input
            type="number"
            value={valorCausa}
            onChange={(e) => setValorCausa(Number(e.target.value))}
            className="rounded-xl bg-secondary/50 border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Honorários (%)</label>
          <Input
            type="number"
            value={percentual}
            onChange={(e) => setPercentual(Number(e.target.value))}
            className="rounded-xl bg-secondary/50 border-border"
          />
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(217, 33%, 6%)', border: '1px solid hsl(217, 33%, 16%)', borderRadius: '12px' }}
              labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-card rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground">Bruto</p>
          <p className="text-sm font-bold text-primary">R$ {bruto.toLocaleString('pt-BR')}</p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground">Impostos</p>
          <p className="text-sm font-bold text-destructive">R$ {impostos.toLocaleString('pt-BR')}</p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground">Líquido</p>
          <p className="text-sm font-bold text-[hsl(var(--emerald))]">R$ {liquido.toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
