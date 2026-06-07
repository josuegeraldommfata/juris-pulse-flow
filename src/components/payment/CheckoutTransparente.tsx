import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Barcode, Check, Loader2, AlertCircle, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import axios from 'axios';

interface CheckoutTransparenteProps {
  valor: number;
  quantidadeTokens: number;
  planoId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutTransparente({
  valor,
  quantidadeTokens,
  planoId,
  onSuccess,
  onCancel
}: CheckoutTransparenteProps) {
  const [metodoPagamento, setMetodoPagamento] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  // Dados do cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [parcelas, setParcelas] = useState(1);

  // Dados do cliente
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');

  // Resultado Pix/Boleto
  const [pixQRCode, setPixQRCode] = useState('');
  const [pixCopiaECola, setPixCopiaECola] = useState('');
  const [boletoURL, setBoletoURL] = useState('');

  // Máscaras
  const maskCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .substring(0, 19);
  };

  const maskExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5);
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .substring(0, 14);
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const handleProcessarCartao = async () => {
    // Validações
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Número do cartão inválido');
      return;
    }

    if (!cardHolder || cardHolder.length < 3) {
      toast.error('Nome do titular inválido');
      return;
    }

    if (!cardExpiry || cardExpiry.length !== 5) {
      toast.error('Data de validade inválida');
      return;
    }

    if (!cardCVV || cardCVV.length < 3) {
      toast.error('CVV inválido');
      return;
    }

    if (!nome || !email || !cpf) {
      toast.error('Preencha todos os dados');
      return;
    }

    setProcessando(true);

    try {
      const userId = JSON.parse(localStorage.getItem('advocatus_user') || '{}').id;

      const response = await axios.post('http://localhost:3001/api/payment/process-card', {
        valor,
        quantidade_tokens: quantidadeTokens,
        parcelas,
        card_number: cardNumber,
        card_holder: cardHolder,
        card_expiry: cardExpiry,
        card_cvv: cardCVV,
        cliente: {
          nome,
          email,
          cpf,
          telefone
        }
      }, {
        headers: {
          'x-user-id': userId
        }
      });

      if (response.data.success && response.data.approved) {
        setSucesso(true);
        toast.success(`🎉 Pagamento aprovado! ${quantidadeTokens} tokens creditados!`);
        
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        toast.error(response.data.error || 'Pagamento recusado');
      }

    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(error.response?.data?.error || 'Erro ao processar pagamento');
    } finally {
      setProcessando(false);
    }
  };

  const handleGerarPix = async () => {
    if (!nome || !email || !cpf) {
      toast.error('Preencha todos os dados');
      return;
    }

    setProcessando(true);

    try {
      const userId = JSON.parse(localStorage.getItem('advocatus_user') || '{}').id;

      const response = await axios.post('http://localhost:3001/api/payment/checkout', {
        valor,
        quantidade_tokens: quantidadeTokens,
        plano_id: planoId,
        metodo_pagamento: 'pix',
        cliente: { nome, email, cpf, telefone }
      }, {
        headers: {
          'x-user-id': userId
        }
      });

      if (response.data.success) {
        setPixQRCode(response.data.checkout.pix_qr_code);
        setPixCopiaECola(response.data.checkout.pix_qr_code_text);
        toast.success('QR Code Pix gerado com sucesso!');
      }

    } catch (error: any) {
      console.error('Erro ao gerar Pix:', error);
      toast.error('Erro ao gerar Pix');
    } finally {
      setProcessando(false);
    }
  };

  const handleGerarBoleto = async () => {
    if (!nome || !email || !cpf) {
      toast.error('Preencha todos os dados');
      return;
    }

    setProcessando(true);

    try {
      const userId = JSON.parse(localStorage.getItem('advocatus_user') || '{}').id;

      const response = await axios.post('http://localhost:3001/api/payment/checkout', {
        valor,
        quantidade_tokens: quantidadeTokens,
        plano_id: planoId,
        metodo_pagamento: 'boleto',
        cliente: { nome, email, cpf, telefone }
      }, {
        headers: {
          'x-user-id': userId
        }
      });

      if (response.data.success) {
        setBoletoURL(response.data.checkout.boleto_url);
        toast.success('Boleto gerado com sucesso!');
        window.open(response.data.checkout.boleto_url, '_blank');
      }

    } catch (error: any) {
      console.error('Erro ao gerar boleto:', error);
      toast.error('Erro ao gerar boleto');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence>
        {sucesso ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pagamento Aprovado!</h2>
            <p className="text-muted-foreground mb-6">{quantidadeTokens} tokens foram creditados na sua conta</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="h-1 bg-accent rounded-full max-w-xs"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Checkout Seguro</h2>
              <p className="text-muted-foreground">
                Você está comprando <span className="font-bold text-accent">{quantidadeTokens} tokens</span> por{' '}
                <span className="font-bold text-foreground">R$ {valor.toFixed(2)}</span>
              </p>
            </div>

            {/* Seleção do Método de Pagamento */}
            <div className="glass-card rounded-2xl p-6">
              <Label className="text-sm font-semibold mb-3 block">Método de Pagamento</Label>
              <RadioGroup value={metodoPagamento} onValueChange={(val: any) => setMetodoPagamento(val)}>
                <div className="grid grid-cols-3 gap-3">
                  <Label
                    htmlFor="credit_card"
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      metodoPagamento === 'credit_card'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
                    <CreditCard className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs font-medium">Cartão</span>
                  </Label>

                  <Label
                    htmlFor="pix"
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      metodoPagamento === 'pix'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="pix" id="pix" className="sr-only" />
                    <Smartphone className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs font-medium">Pix</span>
                  </Label>

                  <Label
                    htmlFor="boleto"
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      metodoPagamento === 'boleto'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="boleto" id="boleto" className="sr-only" />
                    <Barcode className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs font-medium">Boleto</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dados do Cliente */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Seus Dados
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="nome" className="text-sm mb-2 block">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="João da Silva"
                    className="rounded-xl bg-secondary/50 border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="rounded-xl bg-secondary/50 border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-sm mb-2 block">CPF</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCPF(maskCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="rounded-xl bg-secondary/50 border-border"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="telefone" className="text-sm mb-2 block">Telefone (Opcional)</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(maskPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="rounded-xl bg-secondary/50 border-border"
                  />
                </div>
              </div>
            </div>

            {/* Formulário Cartão de Crédito */}
            {metodoPagamento === 'credit_card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Dados do Cartão
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card_number" className="text-sm mb-2 block">Número do Cartão</Label>
                    <Input
                      id="card_number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="rounded-xl bg-secondary/50 border-border font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card_holder" className="text-sm mb-2 block">Nome no Cartão</Label>
                    <Input
                      id="card_holder"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="JOÃO DA SILVA"
                      className="rounded-xl bg-secondary/50 border-border uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="card_expiry" className="text-sm mb-2 block">Validade</Label>
                      <Input
                        id="card_expiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="rounded-xl bg-secondary/50 border-border font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="card_cvv" className="text-sm mb-2 block">CVV</Label>
                      <Input
                        id="card_cvv"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="rounded-xl bg-secondary/50 border-border font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="parcelas" className="text-sm mb-2 block">Parcelas</Label>
                      <select
                        id="parcelas"
                        value={parcelas}
                        onChange={(e) => setParcelas(Number(e.target.value))}
                        className="w-full h-10 rounded-xl bg-secondary/50 border border-border px-3 text-sm"
                      >
                        <option value={1}>1x R$ {valor.toFixed(2)}</option>
                        <option value={2}>2x R$ {(valor / 2).toFixed(2)}</option>
                        <option value={3}>3x R$ {(valor / 3).toFixed(2)}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleProcessarCartao}
                  disabled={processando}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-12 text-base font-semibold"
                >
                  {processando ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Pagar R$ {valor.toFixed(2)}
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Pix */}
            {metodoPagamento === 'pix' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card rounded-2xl p-6 space-y-4 text-center"
              >
                {!pixQRCode ? (
                  <>
                    <Smartphone className="h-16 w-16 mx-auto text-primary" />
                    <h3 className="font-semibold text-foreground">Pagamento via Pix</h3>
                    <p className="text-sm text-muted-foreground">
                      Após gerar o QR Code, você tem 30 minutos para realizar o pagamento
                    </p>

                    <Button
                      onClick={handleGerarPix}
                      disabled={processando}
                      className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12"
                    >
                      {processando ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        'Gerar QR Code Pix'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground mb-4">Escaneie o QR Code</h3>
                    <div className="bg-white p-4 rounded-xl inline-block">
                      <img src={pixQRCode} alt="QR Code Pix" className="h-64 w-64" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Ou copie o código:</p>
                      <div className="flex gap-2">
                        <Input
                          value={pixCopiaECola}
                          readOnly
                          className="rounded-xl bg-secondary/50 font-mono text-xs"
                        />
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(pixCopiaECola);
                            toast.success('Código copiado!');
                          }}
                          variant="outline"
                          className="rounded-xl"
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Boleto */}
            {metodoPagamento === 'boleto' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card rounded-2xl p-6 space-y-4 text-center"
              >
                <Barcode className="h-16 w-16 mx-auto text-primary" />
                <h3 className="font-semibold text-foreground">Pagamento via Boleto</h3>
                <p className="text-sm text-muted-foreground">
                  O boleto tem validade de 3 dias úteis
                </p>

                {!boletoURL ? (
                  <Button
                    onClick={handleGerarBoleto}
                    disabled={processando}
                    className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12"
                  >
                    {processando ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      'Gerar Boleto'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-accent">
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">Boleto gerado com sucesso!</span>
                    </div>
                    <Button
                      onClick={() => window.open(boletoURL, '_blank')}
                      variant="outline"
                      className="w-full rounded-xl"
                    >
                      Abrir Boleto Novamente
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Segurança */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Conexão Segura</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Dados Protegidos</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Cakto Gateway</span>
              </div>
            </div>

            {/* Botão Cancelar */}
            <div className="text-center">
              <Button
                onClick={onCancel}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
