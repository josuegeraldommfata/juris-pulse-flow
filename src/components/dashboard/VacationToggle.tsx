import { useState } from 'react';
import { Palmtree } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function VacationToggle() {
  const [vacation, setVacation] = useState(false);

  const toggle = (checked: boolean) => {
    setVacation(checked);
    if (checked) {
      toast.success('Modo Férias ativado', {
        description: 'O SDR enviará mensagem automática de ausência.',
      });
    } else {
      toast('Modo Férias desativado');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Palmtree className={`h-4 w-4 ${vacation ? 'text-accent' : 'text-muted-foreground'}`} />
            <Switch checked={vacation} onCheckedChange={toggle} className="data-[state=checked]:bg-accent" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{vacation ? 'Modo Férias Ativo' : 'Ativar Modo Férias'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
