import ProjectCard from '../ui/ProjectCard'
import { StackId } from '../ui/Stacks'

const projects: {
  title: string
  description: string
  stacks: StackId[]
  primaryLink?: { href: string; label?: string; icon?: string }
  secondaryLink?: { href: string; label?: string; icon?: string }
  preview: { src: string; alt: string }
}[] = [
    {
      title: 'High-Performance Next.js Architecture',
      description:
        'Engineered a fully custom Next.js frontend to bypass the limitations of standard no-code builders, delivered in 3 days, replacing a 1-month no-code development bottleneck.',
      stacks: ['typescript', 'tailwind', 'figma'],
      primaryLink: { href: 'https://spaceapps.com.br/', label: 'Live Project', icon: '/assets/icons/link-external-02.svg' },
      secondaryLink: { href: 'https://github.com/ZokuWebDesign/spaceapps', label: 'Source on GitHub', icon: '/assets/icons/github.svg' },
      preview: { src: 'https://i.ibb.co/0jbN3VkW/spaceapps-preview.webp', alt: 'SpaceApps landing page preview' },
    },
    {
      title: 'High-Conversion Funnel Engineering',
      description:
        'Production marketing site for a Brazilian healthcare-growth consultancy. Astro with React islands, an interactive self-diagnosis quiz and ROI-calculator funnels, bot-protected capture wired straight into an automated WhatsApp follow-up pipeline.',
      stacks: ['typescript', 'tailwind'],
      primaryLink: { href: 'https://psiativa.com.br/', label: 'Live Project', icon: '/assets/icons/link-external-02.svg' },
      secondaryLink: { href: 'https://psiativa.com.br/quiz/', label: 'Try the quiz funnel', icon: '/assets/icons/link-external-02.svg' },
      preview: { src: '/assets/images/calculadora.webp', alt: 'PsiAtiva ROI-calculator funnel — live interactive tool' },
    },
    {
      title: 'AI Agent Orchestration & Sales Automation',
      description:
        'Engineered an AI-powered acquisition engine: n8n orchestration, a WhatsApp SDR agent with RAG memory on Postgres + pgvector, and Claude-driven lead enrichment and routing. Replacing ~15 hours of manual qualification work per week.',
      stacks: ['javascript', 'python'],
      primaryLink: { href: 'https://psiativa.com.br/', label: 'In production — PsiAtiva', icon: '/assets/icons/link-external-02.svg' },
      preview: { src: '/assets/images/n8n.webp', alt: 'n8n agent-orchestration canvas — AI sales automation in production' },
    },
  ]

export default function Projects() {
  return (
    <section className="pt-24 md:pt-28 xl:pt-40 pb-16 px-6 md:px-12 2xl:px-[170px]">
      <div className="flex flex-col mx-auto max-w-screen-2xl gap-16 xl:gap-24">

        {projects.map((p) => (
          <div key={p.title} className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-6 lg:gap-12 2xl:gap-[104px]">

            <div className="flex flex-col w-full xl:max-w-[550px]">
              <ProjectCard
                title={p.title}
                description={p.description}
                stacks={p.stacks}
                primaryLink={p.primaryLink}
                secondaryLink={p.secondaryLink}
              />
            </div>

            <div className="w-full xl:flex-1">
              <img src={p.preview.src} alt={p.preview.alt} className="rounded-[12px]" loading="lazy" />
            </div>

          </div>
        ))}

      </div>
    </section>
  )
}
