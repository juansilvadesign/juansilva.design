import type { TranslationKeys } from "./en";

export const pt = {
  meta: {
    siteName: "Juan Silva",
    defaultTitle: "Juan Silva — Engenheiro de Design | Next.js, Python e Automação de Crescimento",
    description:
      "Engenheiro de Design disponível para apoiar agências dos EUA e projetos por contrato — frontends em Next.js/TypeScript, backends em Python/FastAPI e automação de crescimento com n8n. Baseado no Rio de Janeiro e trabalhando no horário da costa leste dos EUA.",
    ogImageAlt: "Juan Silva — Engenheiro de Design",
    pages: {
      homeTitle: "Engenheiro de Design",
      projectsTitle: "Projetos",
      projectsDescription: "Seleção de trabalhos de engenharia de design, frontend e automação de Juan Silva.",
      contactTitle: "Contato",
      contactDescription: "Fale com Juan Silva sobre apoio para agências e projetos de engenharia por contrato.",
      cardTitle: "Cartão de Contato",
      cardDescription:
        "Salve o contato de Juan Silva ou fale por telefone, WhatsApp, e-mail, LinkedIn e GitHub.",
      privacyTitle: "Política de Privacidade",
      privacyDescription: "Como o portfólio de Juan Silva trata dados pessoais e técnicos.",
      termsTitle: "Termos de Uso",
      termsDescription: "Os termos aplicáveis ao uso do site de portfólio de Juan Silva.",
      cookiesTitle: "Política de Cookies",
      cookiesDescription: "Como cookies são utilizados no site de portfólio de Juan Silva.",
    },
  },
  locale: {
    switchLabel: "Mudar idioma",
    english: "English",
    portuguese: "Português",
  },
  navigation: {
    ariaLabel: "Navegação principal",
    skipToContent: "Pular para o conteúdo",
    home: "Início",
    projects: "Projetos",
    contact: "Contato",
    logoAlt: "Página inicial de Juan Silva",
    linkedInProfile: "Juan Silva no LinkedIn",
  },
  hero: {
    location: "Juan Silva — Rio de Janeiro, Brasil",
    flagAlt: "Bandeira do Brasil",
    portraitAlt: "Juan Silva",
    title: "Engenheiro de Design. Next.js, Python e automação de crescimento escalável.",
    typeLead: "Engenheiro de Design.",
    typeRotating: ["Next.js", "Python", "automação de crescimento"],
    introduction:
      "Disponível para apoiar agências dos EUA e projetos por contrato. O Rio está uma hora à frente do horário do leste dos EUA — 100% de sobreposição síncrona.",
    emailCta: "Entre em contato",
    emailAriaLabel: "Entre em contato, envie um e-mail para Juan Silva",
    linkedInCta: "LinkedIn",
    linkedInAriaLabel: "Abrir o perfil de Juan Silva no LinkedIn",
    githubAriaLabel: "Abrir o perfil de Juan Silva no GitHub",
    xAriaLabel: "Abrir o perfil de Juan Silva no X",
    figmaAriaLabel: "Abrir o perfil de Juan Silva no Figma",
    dribbbleAriaLabel: "Abrir o perfil de Juan Silva no Dribbble",
  },
  marquee: {
    ariaLabel: "Histórico",
    items: [
      "+100 projetos entregues",
      "Zero reclamações de clientes",
      "2 anos em ritmo de agência",
      "Nearshore do Rio · GMT-3",
    ],
  },
  projects: {
    sectionAriaLabel: "Projetos selecionados",
    liveProjectFallback: "Abrir projeto",
    evidenceFallback: "Ver evidência",
    sourceFallback: "Código-fonte",
    starsOne: "1 estrela no GitHub",
    starsMany: "{n} estrelas no GitHub",
    externalLinkAlt: "Abre em uma nova aba",
    detail: {
      backToIndex: "Todos os projetos",
      briefLegend: "Resumo do projeto",
      roleLabel: "Função",
      timeframeLabel: "Período",
      stackLabel: "Stack",
      evidenceLabel: "Evidência",
      caseInProgress: "Estudo de caso em andamento",
      caseInProgressBody:
        "O texto completo deste projeto ainda está sendo escrito. Tudo nesta página vem do registro do projeto e está correto como está.",
      nextProject: "Próximo projeto",
      dateOngoing: "Desde {start}",
      dateDelivered: "Entregue em {end}",
      dateRange: "{start} – {end}",
    },
    index: {
      heading: "Índice de projetos",
      countOne: "1 projeto",
      countMany: "{n} projetos",
      filterLegend: "Evidência",
      stackLegend: "Stack",
      sortLegend: "Ordenar",
      viewLegend: "Visualização",
      sortEvidence: "Evidência mais forte",
      sortRecent: "Mais recentes",
      viewGrid: "Grade",
      viewList: "Lista",
      clear: "Limpar filtros",
      empty: "Nenhum projeto reúne essa combinação de evidências.",
      emptyHint: "Limpar os filtros",
      recommended: "Recomendado",
      recommendedWhy: "Evidência mais forte em vista —",
      caseStudy: "Ler o estudo de caso",
      caseStudySoon: "Ver o projeto",
      boardTotal: "Projetos",
      board: {
        boardTotal: "Projetos",
        liveSite: "Com site no ar",
        designAndCode: "Design e código",
        sourceCode: "Com código-fonte",
      },
      signals: {
        liveSite: "Site no ar",
        designAndCode: "Design e código",
        sourceCode: "Código-fonte",
        productStack: "Stack de produto",
        storeListing: "Publicado em loja",
        designArtifact: "Arquivo de design",
      },
      signalsShort: {
        liveSite: "No ar",
        designAndCode: "Design + código",
        sourceCode: "Código",
        productStack: "Stack de produto",
        storeListing: "Publicado",
        designArtifact: "Arquivo de design",
      },
      stacks: {
        figma: "Figma",
        typescript: "TypeScript",
        tailwind: "Tailwind",
        javascript: "JavaScript",
        python: "Python",
        opensource: "Open Source",
      },
    },
  },
  contact: {
    title: "Vamos conversar",
    introduction:
      "Trabalho com equipes em estágio inicial para transformar conceitos em evidências. Minha atuação cobre discovery, UX/UI e engenharia frontend pronta para produção, com foco em resultados mensuráveis.",
    formAriaLabel: "Formulário de contato",
    fields: {
      firstName: {
        label: "Nome",
        required: "O nome é obrigatório",
        minLength: "O nome deve ter pelo menos 2 caracteres",
      },
      lastName: {
        label: "Sobrenome",
        required: "O sobrenome é obrigatório",
        minLength: "O sobrenome deve ter pelo menos 2 caracteres",
      },
      email: {
        label: "E-mail",
        required: "O e-mail é obrigatório",
        invalid: "Digite um e-mail válido",
      },
      message: {
        label: "Mensagem",
        required: "A mensagem é obrigatória",
        minLength: "A mensagem deve ter pelo menos 10 caracteres",
      },
    },
    consent: {
      prefix: "Li e concordo com os",
      terms: "Termos de Uso",
      connector: "e com a",
      privacy: "Política de Privacidade",
      suffix: ".",
    },
    security: {
      label: "Verificação de segurança",
      javascriptRequired: "A verificação de segurança requer JavaScript.",
      configurationMissing: "O formulário de contato está temporariamente indisponível.",
      emailFallback: "Envie um e-mail diretamente.",
    },
    feedback: {
      fixErrors: "Corrija os erros do formulário.",
      consentRequired: "Você deve concordar com os Termos de Uso e a Política de Privacidade.",
      turnstileFailure: "A verificação de segurança falhou. Atualize a página e tente novamente.",
      rateLimited: "Muitas tentativas. Tente novamente em 15 minutos.",
      sendFailure: "Não foi possível enviar sua mensagem. Tente novamente.",
      sentToast: "Mensagem enviada com sucesso!",
      submit: "Enviar",
      submitting: "Enviando...",
      submitted: "✓ Mensagem enviada!",
    },
  },
  card: {
    pageAriaLabel: "Cartão de contato de Juan Silva",
    portraitAlt: "Juan Silva",
    actionsAriaLabel: "Opções de contato de Juan Silva",
    portfolioAriaLabel: "Abrir o portfólio de Juan Silva",
    actions: {
      save: {
        label: "Salvar contato",
        subtitle: "Adicionar Juan Silva ao celular",
      },
      phone: {
        label: "Ligar",
      },
      whatsapp: {
        label: "WhatsApp",
        subtitle: "Enviar uma mensagem",
      },
      linkedIn: {
        label: "LinkedIn",
      },
      website: {
        label: "Portfólio",
      },
      email: {
        label: "E-mail",
      },
      github: {
        label: "GitHub",
      },
    },
  },
  footer: {
    profileAriaLabel: "Juan Silva no LinkedIn",
    profileAlt: "Perfil de Juan Silva",
    handle: "@juansilvadesign",
    stackLine: "TypeScript · Astro · Node.js · FastAPI · Python · n8n · Claude API",
    builtIn: "Desenvolvido com Astro no Rio de Janeiro, Brasil.",
    navigationHeading: "Navegação",
    legalHeading: "Legal",
    contactHeading: "Contato",
    privacyPolicy: "Política de Privacidade",
    termsOfUse: "Termos de Uso",
    cookiesPolicy: "Política de Cookies",
    linkedInHandle: "LinkedIn — @juansilvadesign",
    copyright: "Juan Silva. Todos os direitos reservados.",
    versionsLabel: "Versões do site",
    versionsToggle: "Escolher uma versão do site",
    selectorAlt: "Abrir seletor de versão",
    available: "Disponível para apoiar agências dos EUA",
    availableAlt: "Disponível",
    versionsBackgroundAlt: "Fundo das versões do site",
  },
  notFound: {
    title: "Página não encontrada",
    /** See `en.ts` — the break is authored per locale, never computed. */
    titleLines: ["Página não", "encontrada"],
    description: "Não foi possível encontrar o recurso solicitado.",
    returnHome: "Voltar ao início",
    viewProjects: "Ver projetos",
  },
  legal: {
    lastUpdated: "Última atualização",
    lastUpdatedDate: "5 de agosto de 2026",
    privacy: {
      title: "Política de Privacidade",
      introduction: {
        title: "1. Introdução",
        body:
          "Boas-vindas ao portfólio de Juan Silva. Respeitamos sua privacidade e temos o compromisso de proteger seus dados pessoais. Esta política explica como tratamos seus dados durante a visita, seus direitos de privacidade e como a lei protege você.",
      },
      data: {
        title: "2. Dados que coletamos",
        body: "Podemos coletar, usar, armazenar e transferir os seguintes tipos de dados pessoais:",
        identity: "Dados de identidade incluem seu nome e sobrenome.",
        contact: "Dados de contato incluem seu endereço de e-mail.",
        technical:
          "Dados técnicos incluem endereço IP, tipo e versão do navegador, fuso horário e localização, sistema operacional, plataforma e outras tecnologias usadas para acessar este site.",
      },
      use: {
        title: "3. Como usamos seus dados",
        body: "Usamos dados pessoais somente quando a lei permite, principalmente nestas situações:",
        contract: "Para cumprir um contrato que estamos prestes a firmar ou já firmamos com você.",
        interests:
          "Quando necessário aos nossos interesses legítimos ou aos de terceiros, desde que seus interesses e direitos fundamentais não prevaleçam.",
        obligation: "Para cumprir uma obrigação legal ou regulatória.",
      },
      contact: {
        title: "4. Fale conosco",
        body: "Se tiver dúvidas sobre esta política ou nossas práticas de privacidade, entre em contato pelo formulário deste site.",
      },
    },
    cookies: {
      title: "Política de Cookies",
      what: {
        title: "1. O que são cookies",
        body:
          "Cookies são pequenos arquivos de texto armazenados no computador ou dispositivo móvel durante a navegação. Eles ajudam sites a funcionar com eficiência e fornecem informações aos seus responsáveis.",
      },
      use: {
        title: "2. Como usamos cookies",
        body:
          "Usamos cookies para as finalidades descritas abaixo. Desativar todos os cookies também pode desativar recursos que dependem deles; por isso, mantenha-os ativos quando não tiver certeza se um serviço precisa deles.",
      },
      types: {
        title: "3. Cookies que utilizamos",
        essential: "Cookies essenciais: necessários para o funcionamento do site.",
        analytics: "Cookies analíticos/de desempenho: ajudam a entender o número de visitantes e como as pessoas navegam pelo site.",
        functionality: "Cookies de funcionalidade: ajudam a reconhecer você quando retorna ao site.",
      },
      disabling: {
        title: "4. Como desativar cookies",
        body:
          "Você pode impedir cookies nas configurações do navegador. Essa escolha pode afetar este e outros sites, inclusive recursos que dependem de cookies.",
      },
    },
    terms: {
      title: "Termos de Uso",
      agreement: {
        title: "1. Aceitação dos termos",
        body:
          "Ao acessar este site, você concorda com estes Termos de Uso e assume a responsabilidade de cumprir as leis locais aplicáveis. Se discordar de algum termo, não utilize o site.",
      },
      intellectualProperty: {
        title: "2. Direitos de propriedade intelectual",
        body:
          "Com exceção do conteúdo que pertence a você, Juan Silva e/ou seus licenciadores detêm os direitos de propriedade intelectual e os materiais deste site. Você recebe uma licença limitada apenas para visualizar o material apresentado aqui.",
      },
      restrictions: {
        title: "3. Restrições",
        introduction: "É expressamente proibido:",
        publishing: "Publicar materiais do site em outras mídias sem autorização.",
        commercializing: "Vender, sublicenciar ou comercializar materiais do site.",
        performing: "Executar ou exibir publicamente materiais do site sem autorização.",
        damaging: "Usar este site de maneira que possa danificá-lo.",
        access: "Usar este site de maneira que afete o acesso de outras pessoas.",
      },
      liability: {
        title: "4. Limitação de responsabilidade",
        body:
          "Na medida permitida pela lei, Juan Silva e seus administradores, diretores e funcionários não respondem por perdas indiretas, consequenciais ou especiais decorrentes ou relacionadas ao uso deste site.",
      },
    },
  },
} satisfies TranslationKeys;
