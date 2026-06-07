import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckoutTransparente } from '@/components/payment/CheckoutTransparente';
import { Coins, Zap, Crown } from 'lucide-react';

interface TokenPurchaseModalProps {
  open: boolean;
  onClose: () => void;
}

const PACOTES = [
  {
    id: 1,
    nome: '100 Tokens',
    tokens: 100,
    valor: 29.90,
    economia: '',
    icone: Coins,
    destaque: false
  },
  {
    id: 2,
    nome: '500 Tokens',
    tokens: 500,
    valor: 129.90,
    economia: '13% OFF',
    icone: Zap,
    destaque: true
  },
  {
    id: 3,
    nome: '1000 Tokens',
    tokens: 1000,
    valor: 229.90,
    economia: '23% OFF',
    icone: Crown,
    destaque: false
  }
];

export function TokenPurchaseModal({ open, onClose }: TokenPurchaseModalProps) {
  const [pacoteSelecionado, setPacoteSelecionado] = useState<typeof PACOTES[0] | null>(null);

  const handleSuccess = () => {
    // Recarregar a página para atualizar o saldo
    window.location.reload();
  };

  const handleVoltar = () => {
    setPacoteSelecionado(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {pacoteSelecionado ? 'Checkout Cakto' : 'Comprar Tokens'}
          </DialogTitle>
          <DialogDescription>
            {pacoteSelecionado 
              ? `Complete seu pagamento de ${pacoteSelecionado.tokens} tokens`
              : 'Escolha o pacote ideal para você'
            }
          </DialogDescription>
        </DialogHeader>

        {!pacoteSelecionado ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {PACOTES.map((pacote) => {
              const Icon = pacote.icone;
              return (
                <div
                  key={pacote.id}
                  className={`relative glass-card rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${
                    pacote.destaque ? 'ring-2 ring-accent glow-emerald' : ''
                  }`}
                  onClick={() => setPacoteSelecionado(pacote)}
                >
                  {pacote.economia && (
                    <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {pacote.economia}
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-foreground">{pacote.nome}</h3>
                      <p className="text-2xl font-bold text-accent mt-2">
                        R$ {pacote.valor.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        R$ {(pacote.valor / pacote.tokens).toFixed(2)} por token
                      </p>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                      onClick={() => setPacoteSelecionado(pacote)}
                    >
                      Comprar Agora
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <CheckoutTransparente
            valor={pacoteSelecionado.valor}
            quantidadeTokens={pacoteSelecionado.tokens}
            onSuccess={handleSuccess}
            onCancel={handleVoltar}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
