import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, AlertTriangle, DollarSign, Shield, Users, FileText } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 text-center">
        <Scale className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground">Última atualização: 04 de junho de 2026</p>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-6">
          {/* Aceitação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma <strong>Advocatus IA</strong> 
                ("Plataforma", "Serviço", "nós" ou "nosso"), uma solução SaaS desenvolvida para advogados 
                e escritórios de advocacia.
              </p>
              <p>
                <strong>Ao criar uma conta ou usar nossos serviços, você concorda integral e irrestritamente 
                com estes Termos.</strong> Se não concordar, não utilize a plataforma.
              </p>
              <p>
                Este é um contrato juridicamente vinculante entre você ("Usuário", "Cliente" ou "você") 
                e a Advocatus IA.
              </p>
            </CardContent>
          </Card>

          {/* Definições */}
          <Card>
            <CardHeader>
              <CardTitle>2. Definições</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul>
                <li><strong>Plataforma:</strong> Software Advocatus IA, incluindo aplicações web, móveis, APIs e integrações</li>
                <li><strong>Usuário:</strong> Advogado, estagiário ou escritório de advocacia que utiliza nossos serviços</li>
                <li><strong>Conta:</strong> Perfil criado na plataforma com credenciais únicas de acesso</li>
                <li><strong>Conteúdo:</strong> Dados, informações, documentos e arquivos inseridos pelo usuário</li>
                <li><strong>Tokens:</strong> Créditos digitais consumidos para usar funcionalidades de IA</li>
                <li><strong>Lead:</strong> Potencial cliente captado via WhatsApp ou outras integrações</li>
                <li><strong>Scraping:</strong> Coleta automatizada de dados públicos de tribunais</li>
              </ul>
            </CardContent>
          </Card>

          {/* Elegibilidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. Elegibilidade e Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">3.1 Requisitos</h3>
              <p>Para usar nossa plataforma, você deve:</p>
              <ul>
                <li>Ser maior de 18 anos e capaz civilmente</li>
                <li>Ser advogado regularmente inscrito na OAB ou estagiário supervisionado</li>
                <li>Atuar em território brasileiro</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter sigilo das credenciais de acesso</li>
              </ul>

              <h3 className="font-semibold mt-4">3.2 Verificação</h3>
              <p>
                Reservamo-nos o direito de verificar informações fornecidas, incluindo consulta ao cadastro da OAB.
                Contas com dados falsos ou suspeitas serão suspensas.
              </p>

              <h3 className="font-semibold mt-4">3.3 Responsabilidade da Conta</h3>
              <p>
                Você é integralmente responsável por atividades realizadas em sua conta, incluindo ações de 
                colaboradores autorizados. Notifique-nos imediatamente sobre uso não autorizado.
              </p>
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>4. Descrição dos Serviços</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>A Advocatus IA oferece:</p>
              
              <h3 className="font-semibold">4.1 Gestão de Leads</h3>
              <ul>
                <li>Captação e organização de leads via WhatsApp</li>
                <li>Classificação automática por área jurídica</li>
                <li>Kanban para acompanhamento de oportunidades</li>
                <li>Notificações de leads quentes</li>
              </ul>

              <h3 className="font-semibold">4.2 Inteligência Artificial Jurídica</h3>
              <ul>
                <li>12 agentes especializados por área do direito</li>
                <li>Geração de petições, contratos e documentos</li>
                <li>Análise de viabilidade processual</li>
                <li>Cálculos de honorários advocatícios</li>
              </ul>

              <h3 className="font-semibold">4.3 Automação de Processos</h3>
              <ul>
                <li>Scraping de tribunais (TJSP, TRT, etc.)</li>
                <li>Acompanhamento processual automatizado</li>
                <li>Alertas de movimentações</li>
                <li>Relatórios e dossiês completos</li>
              </ul>

              <h3 className="font-semibold">4.4 Integrações</h3>
              <ul>
                <li>WhatsApp Business via Evolution API</li>
                <li>Gateways de pagamento (Cakto)</li>
                <li>Sistemas de e-mail e SMS</li>
              </ul>
            </CardContent>
          </Card>

          {/* Sistema de Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                5. Sistema de Tokens e Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">5.1 Modelo de Cobrança</h3>
              <p>Nossa plataforma utiliza sistema de <strong>tokens pré-pagos</strong>:</p>
              <ul>
                <li><strong>1 token:</strong> Exportação de dossiê de lead</li>
                <li><strong>2 tokens:</strong> Geração de documentos IA, scraping de processos</li>
                <li>Funcionalidades básicas (dashboard, leads, conversas) são gratuitas</li>
              </ul>

              <h3 className="font-semibold">5.2 Planos Disponíveis</h3>
              <ul>
                <li><strong>Recarga 50 tokens:</strong> R$ 29,90 (R$ 0,60/token)</li>
                <li><strong>Pacote 100 tokens:</strong> R$ 49,90 (R$ 0,50/token)</li>
                <li><strong>Pacote 500 tokens:</strong> R$ 199,90 (R$ 0,40/token)</li>
                <li><strong>Plano Starter:</strong> R$ 110/mês (500 tokens inclusos)</li>
                <li><strong>Plano Professional:</strong> R$ 240/mês (1500 tokens inclusos)</li>
              </ul>

              <h3 className="font-semibold">5.3 Política de Reembolso</h3>
              <ul>
                <li>Tokens não utilizados não expiram</li>
                <li>Reembolso apenas em caso de falha técnica comprovada</li>
                <li>Cancelamento de assinatura sem multa (tokens restantes mantidos)</li>
                <li>Disputas resolvidas em até 7 dias úteis</li>
              </ul>
            </CardContent>
          </Card>

          {/* Uso Aceitável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                6. Política de Uso Aceitável
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">6.1 Usos Permitidos</h3>
              <ul>
                <li>Atividades advocatícias lícitas e éticas</li>
                <li>Gestão de clientes e processos próprios</li>
                <li>Automação de tarefas jurídicas rotineiras</li>
                <li>Pesquisa de jurisprudência e legislação</li>
              </ul>

              <h3 className="font-semibold">6.2 Usos Proibidos</h3>
              <p><strong>É ESTRITAMENTE PROIBIDO:</strong></p>
              <ul>
                <li>Violar leis, regulamentos ou código de ética da OAB</li>
                <li>Realizar engenharia reversa, hacking ou ataques à plataforma</li>
                <li>Compartilhar credenciais de acesso com terceiros</li>
                <li>Usar bots para consumir tokens artificialmente</li>
                <li>Coletar dados pessoais sem consentimento</li>
                <li>Realizar spam, phishing ou atividades fraudulentas</li>
                <li>Sobrecarregar intencionalmente nossa infraestrutura</li>
                <li>Acessar dados de outros usuários</li>
                <li>Usar para fins não-advocatícios (consultoria empresarial, etc.)</li>
              </ul>

              <h3 className="font-semibold">6.3 Monitoramento</h3>
              <p>
                Monitoramos uso da plataforma para detectar violações. Reservamo-nos o direito de 
                suspender contas que violem esta política, sem reembolso.
              </p>
            </CardContent>
          </Card>

          {/* Propriedade Intelectual */}
          <Card>
            <CardHeader>
              <CardTitle>7. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">7.1 Nossa Propriedade</h3>
              <p>São de nossa exclusiva propriedade:</p>
              <ul>
                <li>Código-fonte da plataforma Advocatus IA</li>
                <li>Algoritmos de inteligência artificial</li>
                <li>Interface, design e experiência do usuário</li>
                <li>Marca "Advocatus IA" e elementos visuais</li>
                <li>Documentação técnica e treinamentos</li>
              </ul>

              <h3 className="font-semibold">7.2 Seu Conteúdo</h3>
              <p>
                Você mantém todos os direitos sobre dados e documentos que inserir na plataforma.
                Concede-nos apenas licença técnica para processar, armazenar e exibir esse conteúdo.
              </p>

              <h3 className="font-semibold">7.3 Documentos Gerados por IA</h3>
              <p>
                Documentos criados pelos agentes de IA pertencem a você, mas são baseados em 
                templates e conhecimento de nossa propriedade. Use com responsabilidade profissional.
              </p>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                8. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                O tratamento de dados pessoais é regido por nossa 
                <strong> Política de Privacidade</strong>, em conformidade com a LGPD.
              </p>
              
              <h3 className="font-semibold">8.1 Sigilo Profissional</h3>
              <p>
                Respeitamos o sigilo profissional advocatício. Seus dados de clientes e processos 
                são tratados com máxima confidencialidade.
              </p>

              <h3 className="font-semibold">8.2 Segurança</h3>
              <p>Implementamos medidas técnicas robustas:</p>
              <ul>
                <li>Criptografia AES-256 para dados em repouso</li>
                <li>TLS 1.3 para transmissão</li>
                <li>Autenticação multifator (2FA)</li>
                <li>Logs de auditoria completos</li>
                <li>Backups seguros com retenção de 90 dias</li>
              </ul>
            </CardContent>
          </Card>

          {/* SLA e Disponibilidade */}
          <Card>
            <CardHeader>
              <CardTitle>9. Acordo de Nível de Serviço (SLA)</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">9.1 Disponibilidade</h3>
              <ul>
                <li><strong>Uptime garantido:</strong> 99,5% (4 horas de indisponibilidade/mês)</li>
                <li><strong>Janela de manutenção:</strong> Domingos, 02h às 06h (previamente comunicada)</li>
                <li><strong>Suporte técnico:</strong> Segunda a sexta, 8h às 18h (horário comercial)</li>
              </ul>

              <h3 className="font-semibold">9.2 Performance</h3>
              <ul>
                <li>Tempo de resposta médio: &lt; 2 segundos</li>
                <li>Processamento de IA: &lt; 30 segundos</li>
                <li>Scraping de tribunais: &lt; 2 minutos</li>
              </ul>

              <h3 className="font-semibold">9.3 Compensações</h3>
              <p>
                Indisponibilidade superior ao SLA gera crédito de tokens equivalente ao tempo perdido.
                Falhas não incluem manutenções programadas ou problemas de terceiros (tribunais, WhatsApp).
              </p>
            </CardContent>
          </Card>

          {/* Limitação de Responsabilidade */}
          <Card>
            <CardHeader>
              <CardTitle>10. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">10.1 Isenções</h3>
              <p><strong>A Advocatus IA não se responsabiliza por:</strong></p>
              <ul>
                <li>Decisões jurídicas baseadas em documentos gerados por IA</li>
                <li>Prazos processuais perdidos por falha de scraping de tribunais</li>
                <li>Indisponibilidade de serviços de terceiros (WhatsApp, tribunais)</li>
                <li>Perda de dados por uso inadequado ou ataques externos</li>
                <li>Consequências de violação de credenciais pelo usuário</li>
              </ul>

              <h3 className="font-semibold">10.2 Limite de Indenização</h3>
              <p>
                Nossa responsabilidade total está limitada ao valor pago nos últimos 12 meses.
                Não respondemos por danos indiretos, lucros cessantes ou danos morais.
              </p>

              <h3 className="font-semibold">10.3 Força Maior</h3>
              <p>
                Não nos responsabilizamos por falhas causadas por eventos fora de nosso controle:
                pandemias, desastres naturais, ataques cibernéticos, decisões governamentais, etc.
              </p>
            </CardContent>
          </Card>

          {/* Modificações */}
          <Card>
            <CardHeader>
              <CardTitle>11. Modificações dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Podemos modificar estes Termos a qualquer tempo. Alterações significativas 
                serão comunicadas com <strong>30 dias de antecedência</strong> via e-mail.
              </p>
              <p>
                O uso continuado após as alterações implica aceitação. Se discordar, 
                cancele sua conta antes da vigência das mudanças.
              </p>
            </CardContent>
          </Card>

          {/* Suspensão */}
          <Card>
            <CardHeader>
              <CardTitle>12. Suspensão e Encerramento</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold">12.1 Suspensão por Violação</h3>
              <p>Podemos suspender sua conta imediatamente em caso de:</p>
              <ul>
                <li>Violação destes Termos ou Política de Uso</li>
                <li>Atividade fraudulenta ou suspeita</li>
                <li>Inadimplência superior a 15 dias</li>
                <li>Ordem judicial ou determinação da OAB</li>
              </ul>

              <h3 className="font-semibold">12.2 Cancelamento Voluntário</h3>
              <p>
                Você pode cancelar a qualquer tempo. Dados serão mantidos por 90 dias para
                eventual reativação, depois permanentemente excluídos.
              </p>

              <h3 className="font-semibold">12.3 Exportação de Dados</h3>
              <p>
                Antes do encerramento, você pode exportar seus dados em formato JSON/PDF
                sem custo adicional (prazo de 30 dias).
              </p>
            </CardContent>
          </Card>

          {/* Lei Aplicável */}
          <Card>
            <CardHeader>
              <CardTitle>13. Lei Aplicável e Foro</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Estes Termos são regidos pelas <strong>leis brasileiras</strong>. 
                Disputas serão resolvidas preferencialmente por <strong>mediação ou arbitragem</strong>.
              </p>
              <p>
                O foro competente é o da <strong>Comarca de São Paulo/SP</strong>, 
                renunciando a qualquer outro, por mais privilegiado que seja.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>14. Contato e Suporte</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="mb-0">
                <strong>Advocatus IA</strong><br />
                📧 E-mail: <a href="mailto:contrato@advocatusia.com.br">contrato@advocatusia.com.br</a><br />
                📞 Telefone: (11) 99999-9999<br />
                💬 WhatsApp: (11) 99999-9999<br />
                🌐 Site: <a href="https://www.advocatusia.com.br" target="_blank" rel="noopener noreferrer">www.advocatusia.com.br</a><br />
                📍 Endereço: [Inserir endereço completo]<br />
                🕒 Horário de atendimento: Segunda a sexta, 8h às 18h
              </p>
            </CardContent>
          </Card>

          {/* Data de Vigência */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center font-medium">
                ⚖️ <strong>Estes Termos de Uso entram em vigor em 04 de junho de 2026</strong> ⚖️
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TermsOfServicePage;