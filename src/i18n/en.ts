export const en = {
  meta: {
    siteName: "Juan Silva",
    defaultTitle: "Juan Silva — Design Engineer | Next.js, Python & Scalable Growth Automation",
    description:
      "Design Engineer for US agency overflow and contract engineering — Next.js/TypeScript frontends, Python/FastAPI backends, and n8n growth automation. Based in Rio de Janeiro, working US Eastern hours.",
    ogImageAlt: "Juan Silva — Design Engineer",
    pages: {
      homeTitle: "Design Engineer",
      projectsTitle: "Projects",
      projectsDescription: "Selected design engineering, frontend, and automation work by Juan Silva.",
      contactTitle: "Contact",
      contactDescription: "Contact Juan Silva about agency overflow and contract engineering work.",
      cardTitle: "Contact Card",
      cardDescription:
        "Save Juan Silva's contact details or connect by phone, WhatsApp, email, LinkedIn, and GitHub.",
      privacyTitle: "Privacy Policy",
      privacyDescription: "How Juan Silva's portfolio handles personal and technical data.",
      termsTitle: "Terms of Use",
      termsDescription: "The terms that apply when using Juan Silva's portfolio website.",
      cookiesTitle: "Cookies Policy",
      cookiesDescription: "How cookies are used on Juan Silva's portfolio website.",
    },
  },
  locale: {
    switchLabel: "Change language",
    english: "English",
    portuguese: "Português",
  },
  navigation: {
    ariaLabel: "Primary navigation",
    skipToContent: "Skip to content",
    home: "Home",
    projects: "Projects",
    contact: "Contact",
    logoAlt: "Juan Silva home",
    linkedInProfile: "Juan Silva on LinkedIn",
  },
  hero: {
    location: "Juan Silva — Rio de Janeiro, Brazil",
    flagAlt: "Brazilian flag",
    portraitAlt: "Juan Silva",
    title: "Design Engineer. Next.js, Python, and scalable growth automation.",
    /**
     * The animated split of `title`. `title` stays the verbatim positioning
     * line and is what the `<h1>` actually exposes; these two only drive the
     * typing effect, which rotates and so never holds the whole line at once.
     */
    typeLead: "Design Engineer.",
    typeRotating: ["Next.js", "Python", "scalable growth automations"],
    introduction:
      "Available for US agency overflow and contract engineering. Rio runs one hour ahead of US Eastern — 100% synchronous overlap.",
    emailCta: "Get in Touch",
    emailAriaLabel: "Get in Touch, send Juan Silva an email",
    linkedInCta: "LinkedIn",
    linkedInAriaLabel: "Open Juan Silva's LinkedIn profile",
    githubAriaLabel: "Open Juan Silva's GitHub profile",
    xAriaLabel: "Open Juan Silva's X profile",
    figmaAriaLabel: "Open Juan Silva's Figma profile",
    dribbbleAriaLabel: "Open Juan Silva's Dribbble profile",
  },
  /**
   * The track-record strip under the hero. A plain array — reorder, add or drop
   * a line here and the marquee follows; it duplicates the list itself to make
   * the loop seamless, so the copy is stated exactly once.
   *
   * ⛔ Every line has to survive a prospect asking "how do you know that?".
   * "100+ projects" is the figure `_config/master-cv.md` records, evidenced by
   * the Sagitta Figma account; it counts *projects*, not companies. "Zero client
   * complaints" is the defensible reading of the same history — a measured NPS
   * would need a survey and a sample size, and there is neither.
   */
  marquee: {
    ariaLabel: "Track record",
    items: [
      "100+ projects delivered",
      "Zero client complaints",
      "2 years at agency pace",
      "Nearshore from Rio · GMT-3",
    ],
  },
  projects: {
    sectionAriaLabel: "Selected projects",
    liveProjectFallback: "Open project",
    evidenceFallback: "View evidence",
    /** Second card action when the record asserts `evidenceSignals.sourceCode`. */
    sourceFallback: "Source code",
    /** Second card action otherwise — every project has a case-study page. */
    /** Accessible name for the star count; a bare numeral reads as nothing. */
    starsOne: "1 star on GitHub",
    starsMany: "{n} stars on GitHub",
    externalLinkAlt: "Opens in a new tab",
    detail: {
      backToIndex: "All projects",
      briefLegend: "Project brief",
      roleLabel: "Role",
      timeframeLabel: "Timeframe",
      stackLabel: "Stack",
      evidenceLabel: "Evidence",
      caseInProgress: "Case study in progress",
      caseInProgressBody:
        "The long-form write-up for this project is still being drafted. Everything on this page is drawn from the project record and is accurate as it stands.",
      nextProject: "Next project",
      dateOngoing: "Since {start}",
      dateDelivered: "Delivered {end}",
      dateRange: "{start} – {end}",
    },
    index: {
      heading: "Project index",
      countOne: "1 project",
      countMany: "{n} projects",
      filterLegend: "Evidence",
      stackLegend: "Stack",
      sortLegend: "Sort",
      viewLegend: "View",
      searchLegend: "Search",
      searchPlaceholder: "Type to search...",
      sortEvidence: "Strongest evidence",
      sortRecent: "Most recent",
      viewGrid: "Grid",
      viewList: "List",
      clear: "Clear filters",
      empty: "No projects carry that combination of evidence.",
      emptyQuery: "No projects match “{q}”.",
      emptyHint: "Clear the filters",
      recommended: "Recommended",
      recommendedWhy: "Strongest evidence in view —",
      caseStudy: "Read the case study",
      caseStudySoon: "View project",
      boardTotal: "Projects",
      board: {
        boardTotal: "Projects",
        liveSite: "With a live site",
        designAndCode: "Designed and coded",
        sourceCode: "With source code",
      },
      signals: {
        liveSite: "Live site",
        designAndCode: "Designed and coded",
        sourceCode: "Source code",
        productStack: "Product stack",
        storeListing: "Shipped to a store",
        designArtifact: "Design file",
      },
      signalsShort: {
        liveSite: "Live",
        designAndCode: "Design + code",
        sourceCode: "Source",
        productStack: "Product stack",
        storeListing: "Shipped",
        designArtifact: "Design file",
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
    title: "Let's Connect",
    introduction:
      "I partner with early-stage teams to move from concept to evidence. My work spans discovery, UX/UI, and production-ready frontend engineering, with an emphasis on measurable outcomes.",
    formAriaLabel: "Contact form",
    fields: {
      firstName: {
        label: "First Name",
        required: "First name is required",
        minLength: "First name must be at least 2 characters",
      },
      lastName: {
        label: "Last Name",
        required: "Last name is required",
        minLength: "Last name must be at least 2 characters",
      },
      email: {
        label: "Email",
        required: "Email is required",
        invalid: "Please enter a valid email",
      },
      message: {
        label: "Message",
        required: "Message is required",
        minLength: "Message must be at least 10 characters",
      },
    },
    consent: {
      prefix: "I have read and agree to the",
      terms: "Terms of Use",
      connector: "and",
      privacy: "Privacy Policy",
      suffix: ".",
    },
    security: {
      label: "Security check",
      javascriptRequired: "The security check requires JavaScript.",
      configurationMissing: "The contact form is temporarily unavailable.",
      emailFallback: "Email me instead.",
    },
    feedback: {
      fixErrors: "Please fix the errors in the form.",
      consentRequired: "You must agree to the Terms of Use and Privacy Policy.",
      turnstileFailure: "The security check failed. Refresh the page and try again.",
      rateLimited: "Too many attempts. Please try again in 15 minutes.",
      sendFailure: "I couldn't send your message. Please try again.",
      sentToast: "Message sent successfully!",
      submit: "Submit",
      submitting: "Submitting...",
      submitted: "✓ Message Sent!",
    },
  },
  card: {
    pageAriaLabel: "Juan Silva contact card",
    portraitAlt: "Juan Silva",
    actionsAriaLabel: "Juan Silva's contact options",
    portfolioAriaLabel: "Open Juan Silva's portfolio",
    actions: {
      save: {
        label: "Save contact",
        subtitle: "Add Juan Silva to your phone",
      },
      phone: {
        label: "Call",
      },
      whatsapp: {
        label: "WhatsApp",
        subtitle: "Send a message",
      },
      linkedIn: {
        label: "LinkedIn",
      },
      website: {
        label: "Portfolio",
      },
      email: {
        label: "Email",
      },
      github: {
        label: "GitHub",
      },
    },
  },
  footer: {
    profileAriaLabel: "Juan Silva on LinkedIn",
    profileAlt: "Juan Silva profile",
    handle: "@juansilvadesign",
    stackLine: "TypeScript · Astro · Node.js · FastAPI · Python · n8n · Claude API",
    builtIn: "Built with Astro in Rio de Janeiro, Brazil.",
    navigationHeading: "Navigation",
    legalHeading: "Legal",
    contactHeading: "Contact",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    cookiesPolicy: "Cookies Policy",
    linkedInHandle: "LinkedIn — @juansilvadesign",
    copyright: "Juan Silva. All rights reserved.",
    versionsLabel: "Site versions",
    versionsToggle: "Choose a site version",
    selectorAlt: "Open version selector",
    available: "Available for US agency overflow",
    availableAlt: "Available",
    versionsBackgroundAlt: "Site versions background",
  },
  notFound: {
    title: "Not Found",
    /**
     * The display split of `title`, and the only thing the fuzzy canvas draws.
     * `title` stays the verbatim string the `<h1>` exposes and the document
     * title uses — the same division as `hero.title` against `hero.typeLead`.
     *
     * Canvas text cannot wrap, so the break is authored rather than computed:
     * kept on one line, the 21-character Portuguese headline renders at less
     * than half the English size at every viewport.
     * ⛔ Keep `titleLines.join(" ")` identical to `title`.
     */
    titleLines: ["Not", "Found"],
    description: "Could not find the requested resource.",
    returnHome: "Return Home",
    viewProjects: "View projects",
  },
  legal: {
    lastUpdated: "Last updated",
    lastUpdatedDate: "August 5, 2026",
    privacy: {
      title: "Privacy Policy",
      introduction: {
        title: "1. Introduction",
        body:
          "Welcome to Juan Silva's portfolio. We respect your privacy and are committed to protecting your personal data. This policy explains how we handle your data when you visit this website, your privacy rights, and how the law protects you.",
      },
      data: {
        title: "2. Data We Collect",
        body: "We may collect, use, store, and transfer the following kinds of personal data:",
        identity: "Identity Data includes your first and last name.",
        contact: "Contact Data includes your email address.",
        technical:
          "Technical Data includes your IP address, browser type and version, time zone and location, operating system, platform, and other technology used to access this website.",
      },
      use: {
        title: "3. How We Use Your Data",
        body: "We use personal data only when the law allows us to, most commonly in these circumstances:",
        contract: "To perform a contract we are about to enter into or have entered into with you.",
        interests:
          "When necessary for our legitimate interests or those of a third party, provided your interests and fundamental rights do not override them.",
        obligation: "To comply with a legal or regulatory obligation.",
      },
      contact: {
        title: "4. Contact Us",
        body: "If you have questions about this policy or our privacy practices, contact us through this website's contact form.",
      },
    },
    cookies: {
      title: "Cookies Policy",
      what: {
        title: "1. What Are Cookies",
        body:
          "Cookies are small text files placed on your computer or mobile device when you browse websites. They help websites work efficiently and provide information to site owners.",
      },
      use: {
        title: "2. How We Use Cookies",
        body:
          "We use cookies for the purposes described below. Disabling all cookies may also disable features that depend on them, so leave them enabled when you are unsure whether they are required by a service you use.",
      },
      types: {
        title: "3. The Cookies We Set",
        essential: "Essential Cookies: required for the website to operate.",
        analytics: "Analytical/Performance Cookies: help us understand visitor counts and how people move through the website.",
        functionality: "Functionality Cookies: help recognize you when you return to the website.",
      },
      disabling: {
        title: "4. Disabling Cookies",
        body:
          "You can prevent cookies through your browser settings. Be aware that disabling them may affect this website and other websites you visit, including features that rely on cookies.",
      },
    },
    terms: {
      title: "Terms of Use",
      agreement: {
        title: "1. Agreement to Terms",
        body:
          "By accessing this website, you agree to these Terms of Use and accept responsibility for complying with applicable local laws. If you disagree with any term, do not use this website.",
      },
      intellectualProperty: {
        title: "2. Intellectual Property Rights",
        body:
          "Except for content you own, Juan Silva and/or its licensors own the intellectual property rights and materials on this website. You receive a limited license solely to view the material presented here.",
      },
      restrictions: {
        title: "3. Restrictions",
        introduction: "You are specifically restricted from:",
        publishing: "Publishing website material in other media without permission.",
        commercializing: "Selling, sublicensing, or otherwise commercializing website material.",
        performing: "Publicly performing or showing website material without permission.",
        damaging: "Using this website in a way that may damage it.",
        access: "Using this website in a way that affects other people's access.",
      },
      liability: {
        title: "4. Limitation of Liability",
        body:
          "To the extent permitted by law, Juan Silva and its officers, directors, and employees are not liable for indirect, consequential, or special losses arising from or related to your use of this website.",
      },
    },
  },
};

export type TranslationKeys = typeof en;
