import { Clock } from 'lucide-react';

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const generateData = () => {
  return days.map((day) =>
    hours.map((hour) => {
      let base = 0;
      if (hour >= 8 && hour <= 20) base = 3;
      if (hour >= 10 && hour <= 12) base = 7;
      if (hour >= 14 && hour <= 16) base = 8;
      if (day === 'Sáb' || day === 'Dom') base = Math.floor(base * 0.3);
      return Math.max(0, base + Math.floor(Math.random() * 4) - 1);
    })
  );
};

const data = generateData();
const maxVal = Math.max(...data.flat());

function getColor(val: number) {
  if (val === 0) return 'hsl(217, 33%, 8%)';
  const ratio = val / maxVal;
  if (ratio < 0.25) return 'hsl(217, 91%, 60% / 0.15)';
  if (ratio < 0.5) return 'hsl(217, 91%, 60% / 0.35)';
  if (ratio < 0.75) return 'hsl(217, 91%, 60% / 0.6)';
  return 'hsl(217, 91%, 60% / 0.9)';
}

export function ConversationHeatmap() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        Mapa de Calor de Conversas
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Horários com maior entrada de leads</p>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex ml-10 mb-1">
            {hours.filter((_, i) => i % 3 === 0).map(h => (
              <span key={h} className="text-[10px] text-muted-foreground" style={{ width: `${(3 / 24) * 100}%` }}>
                {String(h).padStart(2, '0')}h
              </span>
            ))}
          </div>
          {/* Grid */}
          {days.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] text-muted-foreground w-8 text-right">{day}</span>
              <div className="flex-1 flex gap-0.5">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="flex-1 h-4 rounded-sm cursor-crosshair"
                    style={{ backgroundColor: getColor(data[di][h]) }}
                    title={`${day} ${String(h).padStart(2, '0')}:00 — ${data[di][h]} leads`}
                  />
                ))}
              </div>
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-10">
            <span className="text-[10px] text-muted-foreground">Menos</span>
            {[0.1, 0.3, 0.6, 0.9].map((o) => (
              <div key={o} className="h-3 w-6 rounded-sm" style={{ backgroundColor: `hsl(217, 91%, 60% / ${o})` }} />
            ))}
            <span className="text-[10px] text-muted-foreground">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}
