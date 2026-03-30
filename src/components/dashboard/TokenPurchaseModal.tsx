import { useState } from 'react';
import { Check, CreditCard, Zap } from 'lucide-react';
import { tokenPlans } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TokenPurchaseModal({ open, onClose }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>('pro');
  const [processing, setProcessing] = useState(false);

  const handlePurchase = () => {
    if (!selectedPlan) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            Comprar Créditos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {tokenPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                'w-full p-4 rounded-xl border transition-all duration-200 text-left relative',
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 glow-electric'
                  : 'border-border hover:border-primary/30 bg-secondary/30'
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px]">
                  Popular
                </Badge>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )}>
                    {selectedPlan === plan.id && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3 text-accent" />
                      {plan.tokens.toLocaleString()} tokens
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gradient-electric">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold"
          disabled={!selectedPlan || processing}
          onClick={handlePurchase}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processando via Mercado Pago...
            </span>
          ) : (
            'Finalizar Compra'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
