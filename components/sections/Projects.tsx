import ProjectCard from '../ui/ProjectCard'
import { StackId } from '../ui/Stacks'
import psiativaAiOperations from '../../src/content/projects/psiativa-ai-operations.json'
import psiativaFunnel from '../../src/content/projects/psiativa-funnel.json'
import spaceapps from '../../src/content/projects/spaceapps.json'

const projectEntries = [spaceapps, psiativaFunnel, psiativaAiOperations]

const projects: {
  title: string
  description: string
  stacks: StackId[]
  primaryLink?: { href: string; label?: string; icon?: string }
  secondaryLink?: { href: string; label?: string; icon?: string }
  preview: { src: string; alt: string }
}[] = projectEntries.map((project) => ({
  title: project.copy.en.title,
  description: project.copy.en.description,
  stacks: project.stack as StackId[],
  primaryLink: {
    href: project.liveUrl,
    label: project.copy.en.liveLabel,
    icon: '/assets/icons/link-external-02.svg',
  },
  secondaryLink: {
    href: project.evidenceLink,
    label: project.copy.en.evidenceLabel,
    icon: project.evidenceLink.includes('github.com')
      ? '/assets/icons/github.svg'
      : '/assets/icons/link-external-02.svg',
  },
  preview: {
    src: project.preview,
    alt: project.copy.en.previewAlt,
  },
}))

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
