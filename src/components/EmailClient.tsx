import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { 
  Crown, 
  Inbox, 
  Send, 
  LogOut, 
  Moon,
  Sun,
  X,
  Brain,
  Shield,
  Clock
} from 'lucide-react'

interface Email {
  id: string
  from: string
  fromName: string
  to?: string
  toName?: string
  subject: string
  preview: string
  time: string
  isRead: boolean
  hasAttachment: boolean
  priority: 'high' | 'normal' | 'low'
  fullContent: string
  isSuspicious?: boolean
}

// Função para criar emails da caixa de entrada (9 totais, completos)
const createMockInboxEmails = (userName: string): Email[] => [
  {
    id: '1',
    from: 'kayori.ayumi@yaldabaothbank.com',
    fromName: 'Kayori Ayumi',
    subject: 'SecureFlag{ProtejaSuasSenhas!}',
    preview: `Olá ${userName}, Esta é uma atualização de rotina sobre o projeto de segurança...`,
    time: 'há cerca de 1 hora',
    isRead: false,
    hasAttachment: false,
    priority: 'high',
    fullContent: `Olá ${userName},\n\nEsta é uma atualização de rotina sobre o projeto de segurança. Precisamos revisar as políticas de senha e implementar novas medidas de proteção.\n\nPor favor, revise o documento anexo e me informe suas considerações.\n\nAtenciosamente,\nKayori Ayumi\nEquipe de Segurança da Informação`,
    isSuspicious: true
  },
  {
    id: '2',
    from: 'lucas.rocha@yaldabaothbank.com',
    fromName: 'Lucas Rocha',
    subject: 'Atualização sobre o projeto 1',
    preview: `Prezado ${userName}, Segue o relatório de progresso do projeto 1...`,
    time: 'há cerca de 2 horas',
    isRead: false,
    hasAttachment: true,
    priority: 'normal',
    fullContent: `Prezado ${userName},\n\nSegue o relatório de progresso do projeto 1. Todas as metas foram atingidas conforme planejado e estamos dentro do cronograma estabelecido.\n\nDestaques desta semana:\n- Conclusão da fase de análise\n- Início dos testes de sistema\n- Aprovação do orçamento adicional\n\nPróximos passos serão discutidos na reunião de segunda-feira.\n\nCordialmente,\nLucas Rocha`,
    isSuspicious: false
  },
  {
    id: '3',
    from: 'seguranca.urgente@yaldabaothbank.com',
    fromName: 'Segurança Urgente',
    subject: 'URGENTE: Sua conta será suspensa em 24h',
    preview: 'Detectamos atividade suspeita em sua conta. Clique aqui imediatamente...',
    time: 'há cerca de 3 horas',
    isRead: false,
    hasAttachment: false,
    priority: 'normal',
    fullContent: `ATENÇÃO ${userName}!\n\nDetectamos atividade suspeita em sua conta bancária. Sua conta será SUSPENSA em 24 horas se não tomarmos ação imediata.\n\nClique no link abaixo AGORA para verificar sua identidade:\nhttps://yaldabaoth-verification-fake.com/urgent\n\nSe você não agir dentro de 24 horas, sua conta será permanentemente bloqueada.\n\nEquipe de Segurança Yaldabaoth Bank\n(Este é um email automatizado, não responda)`,
    isSuspicious: true
  },
  {
    id: '4',
    from: 'francisco.neto@yaldabaothbank.com',
    fromName: 'Francisco Neto',
    subject: 'Relatório financeiro mensal',
    preview: `Caro ${userName}, Anexo o relatório de finanças do mês...`,
    time: 'há 4 horas',
    isRead: true,
    hasAttachment: true,
    priority: 'normal',
    fullContent: `Caro ${userName},\n\nAnexo o relatório financeiro mensal. Por favor, revise e retorne com comentários antes da reunião de amanhã.\n\nResumo:\n- Receitas: +15%\n- Despesas: Controladas\n- Projeções: Positivas\n\nAtenciosamente,\nFrancisco Neto\nFinanceiro`,
    isSuspicious: false
  },
  {
    id: '5',
    from: 'paulo.almeida@yaldabaothbank.com',
    fromName: 'Paulo Almeida',
    subject: 'Reunião de equipe - Agenda atualizada',
    preview: `Olá ${userName}, Atualizei a agenda para a reunião de equipe...`,
    time: 'há 5 horas',
    isRead: false,
    hasAttachment: false,
    priority: 'low',
    fullContent: `Olá ${userName},\n\nAtualizei a agenda para a reunião de equipe de amanhã. Novos itens:\n1. Discussão de metas Q4\n2. Apresentação de novos hires\n3. Feedback do cliente principal\n\nLink Zoom: https://zoom.us/j/123456789\n\nAbraços,\nPaulo Almeida\nRH`,
    isSuspicious: false
  },
  {
    id: '6',
    from: 'clara.florence@yaldabaothbank.com',
    fromName: 'Clara Florence',
    subject: 'Proposta de parceria externa',
    preview: `Prezado ${userName}, Gostaria de discutir uma proposta de parceria...`,
    time: 'há 1 dia',
    isRead: true,
    hasAttachment: true,
    priority: 'high',
    fullContent: `Prezado ${userName},\n\nGostaria de discutir uma proposta de parceria com a empresa XYZ. Anexo o documento com detalhes.\n\nPontos chave:\n- Investimento inicial: R$500k\n- Retorno esperado: 20% anual\n- Riscos: Baixos\n\nMarque uma call?\n\nCordialmente,\nClara Florence\nParcerias`,
    isSuspicious: false
  },
  {
    id: '7',
    from: 'suporte.bancario@yaldabaothbank.com',
    fromName: 'Suporte Bancário',
    subject: 'Confirmação de transação pendente',
    preview: 'Sua transação de R$10.000 está pendente. Clique para confirmar...',
    time: 'há 2 dias',
    isRead: false,
    hasAttachment: false,
    priority: 'normal',
    fullContent: `Olá ${userName},\n\nSua transação de R$10.000 está pendente de confirmação por segurança.\n\nClique aqui para aprovar: https://yaldabaoth-approve-fake.com/transacao\n\nSe não reconhecer, ignore.\n\nSuporte Bancário`,
    isSuspicious: true
  },
  {
    id: '8',
    from: 'sebastiao.santos@yaldabaothbank.com',
    fromName: 'Sebastião Santos',
    subject: 'Feedback sobre o relatório trimestral',
    preview: `Caro ${userName}, Excelente trabalho no relatório trimestral...`,
    time: 'há 3 dias',
    isRead: true,
    hasAttachment: false,
    priority: 'low',
    fullContent: `Caro ${userName},\n\nExcelente trabalho no relatório trimestral. Os números estão alinhados e a análise é precisa.\n\nSugestão: Incluir mais gráficos na próxima.\n\nParabéns!\nSebastião Santos\nDiretoria`,
    isSuspicious: false
  },
  {
    id: '9',
    from: 'auditoria.interna@yaldabaothbank.com',
    fromName: 'Auditoria Interna',
    subject: 'Auditoria anual - Documentos solicitados',
    preview: `Prezado ${userName}, Solicitamos documentos para a auditoria anual...`,
    time: 'há 4 dias',
    isRead: false,
    hasAttachment: false,
    priority: 'high',
    fullContent: `Prezado ${userName},\n\nPara a auditoria anual, solicitamos:\n1. Extratos bancários Q1-Q4\n2. Contratos de fornecedores\n3. Relatórios de conformidade\n\nPrazo: 15/10/2025\n\nEnvie para auditoria@yaldabaothbank.com\n\nAtenciosamente,\nAuditoria Interna`,
    isSuspicious: false
  }
]

// Função para criar emails enviados (6 totais, completos)
const createMockSentEmails = (userEmail: string, userName: string): Email[] => [
  {
    id: 's1',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'kayori.ayumi@yaldabaothbank.com',
    toName: 'Kayori Ayumi',
    subject: 'Re: Reunião sobre expansão regional',
    preview: 'Obrigado pela apresentação detalhada. Gostaria de agendar uma reunião...',
    time: 'há 2 horas',
    isRead: true,
    hasAttachment: false,
    priority: 'normal',
    fullContent: `Prezada Kayori,\n\nObrigado pela apresentação detalhada sobre a expansão regional. Gostaria de agendar uma reunião para discutir os próximos passos e definir o cronograma de implementação.\n\nTenho algumas questões específicas sobre o orçamento e a estratégia de marketing local.\n\nQuando você estará disponível na próxima semana?\n\nAtenciosamente,\n${userName}`,
    isSuspicious: false
  },
  {
    id: 's2',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'lucas.rocha@yaldabaothbank.com',
    toName: 'Lucas Rocha',
    subject: 'Aprovação do relatório de progresso',
    preview: 'Aprovado o relatório. Parabéns pela entrega no prazo...',
    time: 'há 1 dia',
    isRead: true,
    hasAttachment: false,
    priority: 'normal',
    fullContent: `Olá Lucas,\n\nAprovado o relatório de progresso do projeto 1. Parabéns pela entrega no prazo e pela qualidade.\n\nAvance para a próxima fase.\n\n${userName}`,
    isSuspicious: false
  },
  {
    id: 's3',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'francisco.neto@yaldabaothbank.com',
    toName: 'Francisco Neto',
    subject: 'Re: Relatório financeiro mensal',
    preview: 'Recebido e revisado. Algumas sugestões em anexo...',
    time: 'há 2 dias',
    isRead: true,
    hasAttachment: true,
    priority: 'high',
    fullContent: `Francisco,\n\nRecebido o relatório. Revisado e com sugestões em anexo.\n\nDiscutimos na call de amanhã?\n\n${userName}`,
    isSuspicious: false
  },
  {
    id: 's4',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'paulo.almeida@yaldabaothbank.com',
    toName: 'Paulo Almeida',
    subject: 'Confirmação de presença na reunião',
    preview: 'Confirmo presença na reunião de equipe...',
    time: 'há 3 dias',
    isRead: true,
    hasAttachment: false,
    priority: 'low',
    fullContent: `Paulo,\n\nConfirmo presença na reunião de equipe. Chego às 10h.\n\nAbraços,\n${userName}`,
    isSuspicious: false
  },
  {
    id: 's5',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'clara.florence@yaldabaothbank.com',
    toName: 'Clara Florence',
    subject: 'Interesse na proposta de parceria',
    preview: 'Interessado na proposta. Vamos marcar uma call...',
    time: 'há 4 dias',
    isRead: true,
    hasAttachment: false,
    priority: 'high',
    fullContent: `Clara,\n\nInteressado na proposta de parceria com XYZ. Vamos marcar uma call para discutir detalhes?\n\nDisponível terça ou quarta?\n\n${userName}`,
    isSuspicious: false
  },
  {
    id: 's6',
    from: userEmail,
    fromName: `${userName} (Você)`,
    to: 'sebastiao.santos@yaldabaothbank.com',
    toName: 'Sebastião Santos',
    subject: 'Obrigado pelo feedback',
    preview: 'Agradeço o feedback positivo sobre o relatório...',
    time: 'há 5 dias',
    isRead: true,
    hasAttachment: false,
    priority: 'normal',
    fullContent: `Sebastião,\n\nObrigado pelo feedback positivo sobre o relatório trimestral. Vou incluir mais gráficos na próxima.\n\nAtenciosamente,\n${userName}`,
    isSuspicious: false
  }
]

interface EmailClientProps {
  userEmail: string
  onLogout: () => void
}

// Hook para efeito de digitação
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Reset completo quando o texto muda
    setDisplayText('')
    setIsTyping(false)
    
    if (!text) return

    setIsTyping(true)
    let index = 0

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isTyping }
}

export function EmailClient({ userEmail, onLogout }: EmailClientProps) {
  // Extrair primeiro nome do usuário do email
  const firstName = userEmail.split('@')[0].split('.')[0]
  const userName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  const userInitials = userName.substring(0, 2).toUpperCase()

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [inboxEmails, setInboxEmails] = useState(() => createMockInboxEmails(userName))
  const [sentEmails, _setSentEmails] = useState(() => createMockSentEmails(userEmail, userName))
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch {
      return false
    }
  })
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysisText, setAiAnalysisText] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)

  const { displayText, isTyping } = useTypewriter(aiAnalysisText, 25)

  // Gerenciar tema escuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    } catch {
      // ignore
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const currentEmails = selectedFolder === 'inbox' ? inboxEmails : sentEmails
  
  const markAsRead = (emailId: string) => {
    if (selectedFolder === 'inbox') {
      setInboxEmails(inboxEmails.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ))
    }
  }

  const handleEmailSelect = (email: Email) => {
    // Limpar completamente a análise anterior antes de selecionar novo email
    setShowAnalysis(false)
    setAiAnalysisText('')
    setIsAnalyzing(false)
    
    // Pequeno delay para garantir que a limpeza aconteça antes da seleção
    setTimeout(() => {
      setSelectedEmail(email)
      if (!email.isRead && selectedFolder === 'inbox') {
        markAsRead(email.id)
      }
    }, 10)
  }

  const generateAiAnalysis = (email: Email) => {
    // Limpar completamente qualquer análise anterior
    setAiAnalysisText('')
    setShowAnalysis(false)
    setIsAnalyzing(true)
    
    // Pequeno delay antes de mostrar a nova análise
    setTimeout(() => {
      setShowAnalysis(true)
    }, 200)
    
    // Simular delay de processamento
    setTimeout(() => {
      if (email.isSuspicious) {
        setAiAnalysisText(`🚨 ALERTA DE SEGURANÇA CORPORATIVA - ATAQUE DETECTADO

Este email apresenta características de golpe corporativo ou scam:

⚠️ SINAIS DE ATAQUE IDENTIFICADOS:
• Tentativa de engenharia social corporativa
• Simulação de comunicação oficial do banco
• Linguagem de urgência para bypass de protocolos
• Solicitação de credenciais ou dados sensíveis
• Links maliciosos para sites de phishing
• Pressão temporal para tomada de decisão
• Ameaças de bloqueio ou suspensão de serviços
• Possível malware em anexos

🔒 PROTOCOLO DE SEGURANÇA CORPORATIVA:
1. BLOQUEIE imediatamente qualquer ação solicitada
2. NÃO clique em links ou baixe anexos
3. NÃO forneça credenciais ou informações confidenciais
4. ISOLE o email e marque como suspeito
5. REPORTE para o Departamento de Segurança TI
6. VERIFIQUE através de canais seguros oficiais

🛡️ CLASSIFICAÇÃO: AMEAÇA CORPORATIVA
Tipo: Phishing/Scam/Engenharia Social
Nível de risco: CRÍTICO (95% probabilidade)`)
      } else {
        setAiAnalysisText(`✅ COMUNICAÇÃO CORPORATIVA SEGURA

Este email passou por todas as verificações de segurança:

🔍 VALIDAÇÕES REALIZADAS:
• Remetente autenticado: Domínio corporativo verificado
• Conteúdo apropriado para ambiente empresarial
• Sem solicitações de dados sensíveis
• Links internos ou ausentes (seguros)
• Linguagem profissional padrão
• Contexto corporativo legítimo
• Sem elementos de pressão temporal

✅ INDICADORES DE SEGURANÇA:
• Comunicação interna legítima
• Remetente conhecido da organização
• Conteúdo alinhado com políticas corporativas
• Sem características de engenharia social
• Aprovado pelos filtros de segurança

🛡️ CLASSIFICAÇÃO: COMUNICAÇÃO SEGURA
Tipo: Email corporativo legítimo
Nível de risco: BAIXO (0% probabilidade)

Aprovado para interação normal conforme políticas.`)
      }
      setIsAnalyzing(false)
    }, 1500)
  }

  const unreadCount = inboxEmails.filter(email => !email.isRead).length

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex overflow-hidden">
      {/* PAINEL 1: Navegação Lateral - FIXO */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--corporate-primary)] rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[var(--corporate-text-primary)]">
                Yaldabaoth
              </h1>
              <p className="text-xs text-[var(--corporate-text-secondary)]">
                Ficticious Bank
              </p>
            </div>
          </div>
          
          {/* Botão de Tema */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full mb-4 transition-all duration-200"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Modo Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Modo Escuro
              </>
            )}
          </Button>
        </div>

        {/* Lista de Navegação */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <Button
              variant={selectedFolder === 'inbox' ? 'default' : 'ghost'}
              className={`w-full justify-start transition-all duration-200 ${selectedFolder === 'inbox' 
                ? 'bg-[var(--corporate-primary)] text-white hover:bg-[var(--corporate-primary-dark)]' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedFolder('inbox')
                setSelectedEmail(null)
                setShowAnalysis(false)
                setAiAnalysisText('')
                setIsAnalyzing(false)
              }}
            >
              <Inbox className="h-4 w-4 mr-3" />
              Caixa de Entrada
              {unreadCount > 0 && (
                <Badge className="ml-auto bg-blue-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant={selectedFolder === 'sent' ? 'default' : 'ghost'}
              className={`w-full justify-start transition-all duration-200 ${selectedFolder === 'sent' 
                ? 'bg-[var(--corporate-primary)] text-white hover:bg-[var(--corporate-primary-dark)]' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedFolder('sent')
                setSelectedEmail(null)
                setShowAnalysis(false)
                setAiAnalysisText('')
                setIsAnalyzing(false)
              }}
            >
              <Send className="h-4 w-4 mr-3" />
              Enviados
            </Button>
          </nav>
        </div>

        {/* Perfil do Usuário */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--corporate-text-primary)] truncate">
                {userName}
              </p>
              <p className="text-xs text-[var(--corporate-text-secondary)] truncate">
                {userEmail}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="w-full transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* PAINEL 2: Lista de Emails - ROLÁVEL */}
      <div className="w-96 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
        {/* Header da Lista - FIXO */}
        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-[var(--corporate-text-primary)] mb-1">
            {selectedFolder === 'inbox' ? 'Caixa de Entrada' : 'Enviados'}
          </h2>
          <p className="text-sm text-[var(--corporate-text-secondary)]">
            {currentEmails.length} mensagens
          </p>
        </div>

        {/* Lista de Emails - ROLÁVEL */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {currentEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 mb-1 rounded-lg cursor-pointer transition-all duration-200 border transform hover:scale-[1.02] ${
                    selectedEmail?.id === email.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 scale-[1.02]'
                      : 'bg-white dark:bg-gray-700 border-transparent hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
                  } ${!email.isRead ? 'font-medium' : ''}`}
                  onClick={() => handleEmailSelect(email)}
                >
                  <div className="flex items-start gap-3">
                    {/* Indicador de não lido */}
                    <div className="mt-2">
                      {!email.isRead && selectedFolder === 'inbox' && (
                        <div className="w-2 h-2 bg-[var(--corporate-primary)] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm truncate ${!email.isRead ? 'font-bold' : 'font-medium'} text-[var(--corporate-text-primary)]`}>
                          {email.fromName}
                        </h4>
                        <span className="text-xs text-[var(--corporate-text-muted)] ml-2 flex-shrink-0">
                          {email.time}
                        </span>
                      </div>
                      
                      <h5 className={`text-sm mb-1 truncate ${!email.isRead ? 'font-semibold' : 'font-medium'} text-[var(--corporate-text-primary)]`}>
                        {email.subject}
                      </h5>
                      
                      <p className="text-sm text-[var(--corporate-text-secondary)] line-clamp-2 leading-relaxed">
                        {email.preview}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {email.hasAttachment && (
                          <Brain className="h-3 w-3 text-[var(--corporate-text-muted)]" />
                        )}
                        {email.priority === 'high' && (
                          <Clock className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* PAINEL 3: Visualização de Email */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
        {selectedEmail ? (
          <>
            {/* Header do Email - FIXO */}
            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              {/* Seção de Remetente/Destinatário */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between text-sm text-[var(--corporate-text-secondary)]">
                  <div>
                    <span className="font-medium">De: </span>
                    <span>{selectedEmail.fromName} ({selectedEmail.from})</span>
                  </div>
                  {selectedEmail.to && (
                    <div>
                      <span className="font-medium">Para: </span>
                      <span>{selectedEmail.toName} ({selectedEmail.to})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedEmail.fromName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[var(--corporate-text-primary)]">
                      {selectedEmail.fromName}
                    </h3>
                    <p className="text-sm text-[var(--corporate-text-secondary)]">
                      {selectedEmail.from}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedEmail(null)
                      setShowAnalysis(false)
                      setAiAnalysisText('')
                      setIsAnalyzing(false)
                    }}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-[var(--corporate-text-primary)] mb-1">
                  {selectedEmail.subject}
                </h2>
                <p className="text-sm text-[var(--corporate-text-secondary)]">
                  {selectedFolder === 'inbox' ? 'Recebido' : 'Enviado'} {selectedEmail.time}
                </p>
              </div>
            </div>

            {/* Conteúdo do Email - ROLÁVEL */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="max-w-none">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="whitespace-pre-line text-[var(--corporate-text-primary)] leading-relaxed">
                      {selectedEmail.fullContent}
                    </div>
                    
                    {/* Seção de Análise IA */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5 text-[var(--corporate-text-muted)]" />
                          <div className="flex-1">
                            <p className="font-medium text-[var(--corporate-text-primary)]">
                              Análise de Segurança por IA
                            </p>
                            <p className="text-sm text-[var(--corporate-text-secondary)]">
                              Verificar se o email é seguro ou suspeito
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={isAnalyzing}
                          className="transition-all duration-200 hover:bg-[var(--corporate-primary)] hover:text-white"
                          onClick={() => generateAiAnalysis(selectedEmail)}
                        >
                          {isAnalyzing ? (
                            <>
                              <Shield className="h-4 w-4 mr-2 animate-spin" />
                              Analisando...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Verificar E-mail com IA
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Resultado da Análise */}
                    {showAnalysis && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 transition-all duration-500 ease-in-out">
                        <div className="flex items-start gap-3 mb-3">
                          <Brain className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">
                              Relatório de Análise de Segurança
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                              {isAnalyzing ? 'Processando análise...' : 'Análise concluída'}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded p-4 border">
                          <pre className="whitespace-pre-wrap text-sm font-mono text-[var(--corporate-text-primary)] leading-relaxed">
                            {displayText}
                            {isTyping && <span className="animate-pulse">|</span>}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-[var(--corporate-text-secondary)]">
              <Crown className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">Nenhum email selecionado</h3>
              <p>Selecione um email da lista para visualizar seu conteúdo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
