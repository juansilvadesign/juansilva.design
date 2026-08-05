export const metadata = {
  title: {
    template: '%s | Juan Silva',
    default: 'Juan Silva — Design Engineer | Next.js, Python & Scalable Growth Automation',
  },
  description: 'Design Engineer for US agency overflow and contract engineering — Next.js/TypeScript frontends, Python/FastAPI backends, and n8n growth automation. Based in Rio de Janeiro, working US Eastern hours.',
  // Production origin. juansilva.is-a.dev is dead (serves an empty directory
  // listing); juansilva.design is not bought yet. Relative asset URLs below
  // resolve against this, so og:image follows it automatically.
  metadataBase: new URL('https://juanpablosilva.com.br'),
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://juanpablosilva.com.br',
    siteName: 'Juan Silva',
    title: 'Juan Silva — Design Engineer | Next.js, Python & Scalable Growth Automation',
    description: 'Design Engineer for US agency overflow and contract engineering — Next.js/TypeScript frontends, Python/FastAPI backends, and n8n growth automation. Based in Rio de Janeiro, working US Eastern hours.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Juan Silva — Design Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Silva — Design Engineer | Next.js, Python & Scalable Growth Automation',
    description: 'Design Engineer for US agency overflow and contract engineering — Next.js/TypeScript frontends, Python/FastAPI backends, and n8n growth automation. Based in Rio de Janeiro, working US Eastern hours.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
