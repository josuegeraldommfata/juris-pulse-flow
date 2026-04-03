import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Google Ads', value: 42, color: 'hsl(217, 91%, 60%)' },
  { name: 'Meta Ads', value: 28, color: 'hsl(262, 83%, 58%)' },
  { name: 'Orgânico', value: 18, color: 'hsl(160, 84%, 39%)' },
  { name: 'Indicação', value: 12, color: 'hsl(38, 92%, 50%)' },
];

export function LeadOriginChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Origem dos Leads</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 6%)',
                border: '1px solid hsl(217, 33%, 16%)',
                borderRadius: '12px',
                color: 'hsl(210, 40%, 96%)',
              }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: 'hsl(215, 20%, 55%)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
