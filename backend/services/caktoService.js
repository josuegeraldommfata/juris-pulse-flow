const axios = require('axios');

// Cliente Cakto
const caktoClient = axios.create({
  baseURL: process.env.CAKTO_API_URL || 'https://api.cakto.com.br',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CAKTO_CLIENT_SECRET}`
  }
});

/**
 * CAKTO PAYMENT SERVICE
 * Integração completa com gateway Cakto
 */

// Criar checkout de pagamento (Pix, Cartão, Boleto)
async function criarCheckout(dados) {
  try {
    const { 
      valor, 
      descricao, 
      clienteNome, 
      clienteEmail, 
      clienteCPF, 
      clienteTelefone,
      metodoPagamento, // 'pix', 'credit_card', 'boleto'
      planoId,
      userId
    } = dados;

    const payload = {
      client_id: process.env.CAKTO_CLIENT_ID,
      amount: Math.round(valor * 100), // Valor em centavos
      currency: 'BRL',
      description: descricao || 'Compra de tokens - Advocatus IA',
      customer: {
        name: clienteNome,
        email: clienteEmail,
        document: clienteCPF,
        phone: clienteTelefone
      },
      payment_method: metodoPagamento,
      metadata: {
        plano_id: planoId,
        user_id: userId,
        sistema: 'advocatus_ia'
      },
      notification_url: `${process.env.CAKTO_WEBHOOK_URL || 'http://localhost:3001'}/api/webhook/cakto`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/wallet?status=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/wallet?status=cancelled`
    };

    console.log('🔵 Criando checkout Cakto:', { valor, metodoPagamento, cliente: clienteEmail });

    const response = await caktoClient.post('/v1/checkouts', payload);

    console.log('✅ Checkout criado:', response.data.id);

    return {
      success: true,
      checkout_id: response.data.id,
      checkout_url: response.data.checkout_url,
      pix_qr_code: response.data.pix?.qr_code,
      pix_qr_code_text: response.data.pix?.qr_code_text,
      boleto_url: response.data.boleto?.url,
      boleto_barcode: response.data.boleto?.barcode,
      status: response.data.status,
      expires_at: response.data.expires_at
    };

  } catch (error) {
    console.error('❌ Erro ao criar checkout Cakto:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao processar pagamento',
      details: error.response?.data
    };
  }
}

// Processar pagamento com cartão de crédito (transparente)
async function processarCartao(dados) {
  try {
    const {
      valor,
      parcelas,
      cardNumber,
      cardHolder,
      cardExpiry,
      cardCVV,
      clienteNome,
      clienteEmail,
      clienteCPF,
      clienteTelefone,
      userId,
      planoId
    } = dados;

    const payload = {
      client_id: process.env.CAKTO_CLIENT_ID,
      amount: Math.round(valor * 100),
      currency: 'BRL',
      payment_method: 'credit_card',
      installments: parcelas || 1,
      card: {
        number: cardNumber.replace(/\s/g, ''),
        holder_name: cardHolder,
        expiration_month: cardExpiry.split('/')[0],
        expiration_year: '20' + cardExpiry.split('/')[1],
        cvv: cardCVV
      },
      customer: {
        name: clienteNome,
        email: clienteEmail,
        document: clienteCPF,
        phone: clienteTelefone
      },
      metadata: {
        user_id: userId,
        plano_id: planoId,
        sistema: 'advocatus_ia'
      },
      notification_url: `${process.env.CAKTO_WEBHOOK_URL || 'http://localhost:3001'}/api/webhook/cakto`
    };

    console.log('💳 Processando cartão:', { valor, parcelas, cliente: clienteEmail });

    const response = await caktoClient.post('/v1/payments', payload);

    console.log('✅ Pagamento processado:', response.data.status);

    return {
      success: response.data.status === 'approved' || response.data.status === 'paid',
      transaction_id: response.data.id,
      status: response.data.status,
      message: response.data.status_message,
      approved: response.data.status === 'approved',
      authorization_code: response.data.authorization_code
    };

  } catch (error) {
    console.error('❌ Erro ao processar cartão:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Pagamento recusado',
      code: error.response?.data?.code
    };
  }
}

// Criar assinatura recorrente
async function criarAssinatura(dados) {
  try {
    const {
      planoId,
      planoPer,
      planoValor,
      clienteNome,
      clienteEmail,
      clienteCPF,
      clienteTelefone,
      cardToken,
      userId
    } = dados;

    const payload = {
      client_id: process.env.CAKTO_CLIENT_ID,
      plan: {
        id: planoId,
        name: dados.planoNome || 'Plano Advocatus IA',
        interval: planoPeriodicidade, // 'monthly', 'yearly'
        amount: Math.round(planoValor * 100)
      },
      customer: {
        name: clienteNome,
        email: clienteEmail,
        document: clienteCPF,
        phone: clienteTelefone
      },
      payment_method: 'credit_card',
      card_token: cardToken,
      metadata: {
        user_id: userId,
        plano_id: planoId,
        sistema: 'advocatus_ia'
      },
      notification_url: `${process.env.CAKTO_WEBHOOK_URL || 'http://localhost:3001'}/api/webhook/cakto`
    };

    console.log('🔁 Criando assinatura:', { plano: planoId, cliente: clienteEmail });

    const response = await caktoClient.post('/v1/subscriptions', payload);

    console.log('✅ Assinatura criada:', response.data.id);

    return {
      success: true,
      subscription_id: response.data.id,
      status: response.data.status,
      next_billing_date: response.data.next_billing_date,
      card_last_digits: response.data.card?.last_digits
    };

  } catch (error) {
    console.error('❌ Erro ao criar assinatura:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao criar assinatura'
    };
  }
}

// Cancelar assinatura
async function cancelarAssinatura(subscriptionId) {
  try {
    console.log('🛑 Cancelando assinatura:', subscriptionId);

    const response = await caktoClient.delete(`/v1/subscriptions/${subscriptionId}`);

    console.log('✅ Assinatura cancelada');

    return {
      success: true,
      message: 'Assinatura cancelada com sucesso'
    };

  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao cancelar assinatura'
    };
  }
}

// Consultar status de pagamento
async function consultarPagamento(transactionId) {
  try {
    const response = await caktoClient.get(`/v1/payments/${transactionId}`);

    return {
      success: true,
      status: response.data.status,
      paid: response.data.status === 'paid' || response.data.status === 'approved',
      amount: response.data.amount / 100,
      paid_at: response.data.paid_at
    };

  } catch (error) {
    console.error('❌ Erro ao consultar pagamento:', error.response?.data || error.message);
    
    return {
      success: false,
      error: 'Pagamento não encontrado'
    };
  }
}

// Gerar token de cartão (tokenização para checkout transparente)
async function tokenizarCartao(dados) {
  try {
    const { cardNumber, cardHolder, cardExpiry, cardCVV } = dados;

    const payload = {
      card: {
        number: cardNumber.replace(/\s/g, ''),
        holder_name: cardHolder,
        expiration_month: cardExpiry.split('/')[0],
        expiration_year: '20' + cardExpiry.split('/')[1],
        cvv: cardCVV
      }
    };

    const response = await caktoClient.post('/v1/tokens', payload);

    return {
      success: true,
      token: response.data.token,
      brand: response.data.brand,
      last_digits: response.data.last_digits
    };

  } catch (error) {
    console.error('❌ Erro ao tokenizar cartão:', error.response?.data || error.message);
    
    return {
      success: false,
      error: 'Dados do cartão inválidos'
    };
  }
}

// Processar webhook da Cakto
function processarWebhook(payload, signature) {
  try {
    // Verificar assinatura do webhook (se Cakto enviar)
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.CAKTO_WEBHOOK_SECRET)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    
    // if (signature !== expectedSignature) {
    //   return { success: false, error: 'Assinatura inválida' };
    // }

    const { event, data } = payload;

    console.log('📨 Webhook Cakto recebido:', event);

    return {
      success: true,
      event,
      data: {
        transaction_id: data.id,
        status: data.status,
        amount: data.amount / 100,
        customer_email: data.customer?.email,
        metadata: data.metadata
      }
    };

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    return {
      success: false,
      error: 'Erro ao processar webhook'
    };
  }
}

module.exports = {
  criarCheckout,
  processarCartao,
  criarAssinatura,
  cancelarAssinatura,
  consultarPagamento,
  tokenizarCartao,
  processarWebhook
};
