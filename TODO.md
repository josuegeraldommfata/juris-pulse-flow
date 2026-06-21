# TODO - Correções Evolution (Robôs), Webhook n8n e Delete

## Planejado

### 1) Delete de robô (botão na UI)
- [ ] Criar endpoint no backend: remover instância na Evolution API.
- [ ] Atualizar `src/pages/WhatsAppPage.tsx` com botão **Deletar**.
- [ ] Adicionar método no `src/services/api.ts` para chamar o delete.

### 2) Corrigir criação de instância para webhook
- [ ] Ajustar `POST /api/evolution/create` para informar `webhook` dentro do payload enviado ao `/instance/create` (evitar erro "instance requires property \"webhook\"" e remover passo manual).
- [ ] Garantir que a URL do webhook inclui `userId` corretamente.

### 3) Corrigir "invalid signature" do n8n/webhook
- [ ] Verificar onde o backend valida assinatura (ou se n8n valida).
- [ ] Alinhar secret/token: adicionar `N8N_WEBHOOK_SECRET` e validar/mandar esse header/param.
- [ ] Ajustar o endpoint do webhook do n8n/evolution para aceitar a assinatura correta.

### 4) Teste manual pós-correção
- [ ] Criar instância -> validar que webhook do n8n já fica configurado.
- [ ] Enviar msg fake -> validar que `/api/webhook/whatsapp` persiste lead/conversa.
- [ ] Deletar instância -> validar sumiço na Evolution.

