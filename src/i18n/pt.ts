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
      privacyTitle: "Política de Privacidade",
      termsTitle: "Termos de Uso",
      cookiesTitle: "Política de Cookies",
    },
  },
  locale: {
    switchLabel: "Mudar idioma",
    english: "English",
    portuguese: "Português",
  },
  navigation: {
    ariaLabel: "Navegação principal",
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
    introduction:
      "Disponível para apoiar agências dos EUA e projetos por contrato. O Rio está uma hora à frente do horário do leste dos EUA — 100% de sobreposição síncrona.",
    emailCta: "Enviar e-mail",
    emailAriaLabel: "Enviar um e-mail para Juan Silva",
    linkedInCta: "LinkedIn",
    linkedInAriaLabel: "Abrir o perfil de Juan Silva no LinkedIn",
    githubAriaLabel: "Abrir o perfil de Juan Silva no GitHub",
    xAriaLabel: "Abrir o perfil de Juan Silva no X",
    figmaAriaLabel: "Abrir o perfil de Juan Silva no Figma",
    dribbbleAriaLabel: "Abrir o perfil de Juan Silva no Dribbble",
  },
  projects: {
    sectionAriaLabel: "Projetos selecionados",
    liveProjectFallback: "Abrir projeto",
    evidenceFallback: "Ver evidência",
    externalLinkAlt: "Abre em uma nova aba",
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
    feedback: {
      fixErrors: "Corrija os erros do formulário.",
      consentRequired: "Você deve concordar com os Termos de Uso e a Política de Privacidade.",
      sendFailure: "Não foi possível enviar sua mensagem. Tente novamente.",
      sentToast: "Mensagem enviada com sucesso!",
      submit: "Enviar",
      submitting: "Enviando...",
      submitted: "✓ Mensagem enviada!",
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
    description: "Não foi possível encontrar o recurso solicitado.",
    returnHome: "Voltar ao início",
  },
  legal: {
    lastUpdated: "Última atualização",
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
