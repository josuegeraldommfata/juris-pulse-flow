import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground">Última atualização: 04 de junho de 2026</p>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-6">
          {/* Introdução */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                A <strong>Advocatus IA</strong> ("nós", "nosso" ou "Plataforma") está comprometida com a proteção da
                privacidade e segurança dos dados pessoais de seus usuários. Esta Política de Privacidade descreve
                como coletamos, usamos, armazenamos e protegemos suas informações, em conformidade com a
                <strong> Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e demais legislações aplicáveis.
              </p>
              <p>
                Ao utilizar nossa plataforma, você concorda com os termos desta Política. Caso não concorde, pedimos
                que não utilize nossos serviços.
              </p>
            </CardContent>
          </Card>

          {/* Dados Coletados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                2. Dados Coletados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold mt-4">2.1 Dados Fornecidos Diretamente</h3>
              <ul>
                <li><strong>Cadastro:</strong> Nome completo, e-mail, CPF/CNPJ, telefone, OAB (quando aplicável)</li>
                <li><strong>Perfil:</strong> Foto, razão social, área de atuação jurídica</li>
                <li><strong>Pagamento:</strong> Dados de cartão de crédito (processados via gateway Cakto - não armazenamos)</li>
                <li><strong>Comunicações:</strong> Conversas do WhatsApp com leads (via Evolution API)</li>
              </ul>

              <h3 className="font-semibold mt-4">2.2 Dados Coletados Automaticamente</h3>
              <ul>
                <li><strong>Logs de Acesso:</strong> Endereço IP, navegador, dispositivo, horários de acesso</li>
                <li><strong>Uso da Plataforma:</strong> Páginas visitadas, funcionalidades utilizadas, tokens consumidos</li>
                <li><strong>Cookies:</strong> Preferências, sessão ativa, análise de desempenho (Google Analytics)</li>
              </ul>

              <h3 className="font-semibold mt-4">2.3 Dados de Terceiros</h3>
              <ul>
                <li><strong>Scraping Judicial:</strong> Dados públicos de processos (TJSP, TRT)</li>
                <li><strong>WhatsApp:</strong> Mensagens e metadados via Evolution API</li>
                <li><strong>Gateway de Pagamento:</strong> Status de transações via Cakto</li>
              </ul>
            </CardContent>
          </Card>

          {/* Finalidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                3. Finalidade do Uso dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Utilizamos seus dados pessoais para:</p>
              <ul>
                <li><strong>Execução do Contrato:</strong> Fornecer os serviços contratados (gestão de leads, IA jurídica, scraping)</li>
                <li><strong>Cobrança:</strong> Processar pagamentos e gerenciar tokens consumidos</li>
                <li><strong>Comunicação:</strong> Enviar notificações, alertas de leads quentes, atualizações do sistema</li>
                <li><strong>Segurança:</strong> Prevenir fraudes, abuso e acesso não autorizado</li>
                <li><strong>Melhorias:</strong> Analisar uso da plataforma para otimizações e novos recursos</li>
                <li><strong>Obrigações Legais:</strong> Cumprir exigências judiciais e regulatórias</li>
                <li><strong>Marketing:</strong> Enviar ofertas e conteúdos (com seu consentimento prévio)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Base Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                4. Base Legal (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>O tratamento dos seus dados é baseado nas seguintes hipóteses legais:</p>
              <ul>
                <li><strong>Art. 7º, V - Execução de Contrato:</strong> Dados necessários para prestar os serviços</li>
                <li><strong>Art. 7º, VI - Exercício Regular de Direitos:</strong> Defesa em processos judiciais</li>
                <li><strong>Art. 7º, IX - Legítimo Interesse:</strong> Segurança, prevenção de fraudes, melhorias</li>
                <li><strong>Art. 7º, I - Consentimento:</strong> Marketing e cookies não essenciais</li>
                <li><strong>Art. 7º, II - Obrigação Legal:</strong> Cumprimento de leis e decisões judiciais</li>
              </ul>
            </CardContent>
          </Card>

          {/* Compartilhamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                5. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Seus dados podem ser compartilhados com:</p>
              <ul>
                <li><strong>Processadores de Pagamento:</strong> Cakto (gateway de pagamento)</li>
                <li><strong>Serviços de Comunicação:</strong> Evolution API (WhatsApp Business)</li>
                <li><strong>Infraestrutura:</strong> Servidores de hospedagem (AWS, Google Cloud, etc.)</li>
                <li><strong>Autoridades:</strong> Mediante ordem judicial ou requisição legal</li>
                <li><strong>Parceiros Comerciais:</strong> Somente com seu consentimento explícito</li>
              </ul>
              <p className="mt-4">
                <strong>Importante:</strong> Não vendemos, alugamos ou comercializamos seus dados pessoais para terceiros.
              </p>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. Medidas de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Implementamos as seguintes medidas técnicas e organizacionais:</p>
              <ul>
                <li><strong>Criptografia:</strong> TLS/SSL para transmissão de dados, bcrypt para senhas</li>
                <li><strong>Controle de Acesso:</strong> Autenticação JWT, permissões baseadas em roles</li>
                <li><strong>Monitoramento:</strong> Logs de auditoria, detecção de anomalias</li>
                <li><strong>Backups:</strong> Cópias diárias com retenção de 30 dias</li>
                <li><strong>Rate Limiting:</strong> Proteção contra ataques DDoS e força bruta</li>
                <li><strong>Firewall:</strong> Filtragem de tráfego malicioso</li>
                <li><strong>Treinamento:</strong> Equipe capacitada em segurança da informação</li>
              </ul>
            </CardContent>
          </Card>

          {/* Retenção */}
          <Card>
            <CardHeader>
              <CardTitle>7. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Mantemos seus dados pelo tempo necessário para:</p>
              <ul>
                <li><strong>Dados Cadastrais:</strong> Durante a vigência do contrato + 5 anos (prescrição legal)</li>
                <li><strong>Dados Financeiros:</strong> 5 anos (Lei 8.846/94 e CTN)</li>
                <li><strong>Logs de Acesso:</strong> 6 meses (Marco Civil da Internet - Lei 12.965/14)</li>
                <li><strong>Conversas de Leads:</strong> Enquanto houver interesse legítimo ou obrigação legal</li>
              </ul>
              <p className="mt-4">
                Após esses prazos, os dados serão anonimizados ou excluídos de forma segura.
              </p>
            </CardContent>
          </Card>

          {/* Direitos do Titular */}
          <Card>
            <CardHeader>
              <CardTitle>8. Seus Direitos (LGPD - Art. 18)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Você tem direito a:</p>
              <ul>
                <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e obter cópia</li>
                <li><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
                <li><strong>Anonimização/Bloqueio/Eliminação:</strong> Excluir dados desnecessários ou excessivos</li>
                <li><strong>Portabilidade:</strong> Exportar seus dados em formato estruturado (JSON/CSV)</li>
                <li><strong>Revogação de Consentimento:</strong> Cancelar autorização previamente dada</li>
                <li><strong>Oposição:</strong> Contestar tratamentos baseados em legítimo interesse</li>
                <li><strong>Revisão de Decisões Automatizadas:</strong> Questionar resultados de IA</li>
              </ul>
              <p className="mt-4">
                <strong>Para exercer seus direitos, entre em contato:</strong><br />
                📧 E-mail: <a href="mailto:privacidade@advocatusia.com.br">privacidade@advocatusia.com.br</a><br />
                📱 WhatsApp: (11) 99999-9999<br />
                Prazo de resposta: até 15 dias úteis
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>9. Cookies e Tecnologias de Rastreamento</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Utilizamos cookies para:</p>
              <ul>
                <li><strong>Essenciais:</strong> Autenticação, sessão ativa (obrigatórios)</li>
                <li><strong>Funcionais:</strong> Preferências de idioma, tema (escuro/claro)</li>
                <li><strong>Analíticos:</strong> Google Analytics (anônimos)</li>
                <li><strong>Marketing:</strong> Remarketing, anúncios personalizados (com consentimento)</li>
              </ul>
              <p className="mt-4">
                Você pode gerenciar cookies nas configurações do navegador, mas isso pode afetar funcionalidades.
              </p>
            </CardContent>
          </Card>

          {/* Transferência Internacional */}
          <Card>
            <CardHeader>
              <CardTitle>10. Transferência Internacional de Dados</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Alguns prestadores de serviços (ex: AWS, Google Cloud) podem estar localizados fora do Brasil.
                Nesses casos, garantimos que:
              </p>
              <ul>
                <li>Há cláusulas contratuais-padrão (LGPD - Art. 33, VIII)</li>
                <li>O país de destino oferece nível adequado de proteção</li>
                <li>Medidas técnicas e organizacionais são aplicadas</li>
              </ul>
            </CardContent>
          </Card>

          {/* Menores */}
          <Card>
            <CardHeader>
              <CardTitle>11. Menores de Idade</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Nossos serviços são destinados a <strong>advogados e profissionais do direito maiores de 18 anos</strong>.
                Não coletamos intencionalmente dados de menores. Se identificarmos tal situação, os dados serão
                excluídos imediatamente.
              </p>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card>
            <CardHeader>
              <CardTitle>12. Alterações na Política</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Podemos atualizar esta Política periodicamente. Alterações significativas serão notificadas por
                e-mail ou aviso na plataforma com <strong>30 dias de antecedência</strong>. O uso continuado após
                as alterações implica aceitação.
              </p>
            </CardContent>
          </Card>

          {/* DPO */}
          <Card>
            <CardHeader>
              <CardTitle>13. Encarregado de Proteção de Dados (DPO)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                <strong>Nome:</strong> Robson Alexandre<br />
                <strong>E-mail:</strong> <a href="mailto:dpo@advocatusia.com.br">dpo@advocatusia.com.br</a><br />
                <strong>Telefone:</strong> (11) 99999-9999<br />
                <strong>Endereço:</strong> [Inserir endereço completo]
              </p>
            </CardContent>
          </Card>

          {/* ANPD */}
          <Card>
            <CardHeader>
              <CardTitle>14. Autoridade Nacional (ANPD)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Se suas solicitações não forem atendidas satisfatoriamente, você pode registrar reclamação na
                <strong> Autoridade Nacional de Proteção de Dados (ANPD)</strong>:
              </p>
              <p>
                🌐 Site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">www.gov.br/anpd</a><br />
                📧 E-mail: atendimento@anpd.gov.br
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>15. Contato</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="mb-0">
                <strong>Advocatus IA</strong><br />
                📧 E-mail: <a href="mailto:contato@advocatusia.com.br">contato@advocatusia.com.br</a><br />
                📱 WhatsApp: (11) 99999-9999<br />
                🌐 Site: <a href="https://www.advocatusia.com.br" target="_blank" rel="noopener noreferrer">www.advocatusia.com.br</a><br />
                📍 Endereço: [Inserir endereço completo]
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicyPage;
