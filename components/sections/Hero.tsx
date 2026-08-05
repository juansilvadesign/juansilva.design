import { SOCIAL_LINKS } from "@/constants/links";

export default function Hero() {
  return (
    <section className="py-6 md:py-8 lg:py-24 2xl:py-[120px]">

      <div className="flex flex-col lg:flex-row mx-auto px-4 justify-center items-center gap-12 lg:gap-[104px]">

        <img src="https://i.ibb.co/4RQQ7qnw/hero.webp" alt="Juan Silva" className="w-[300px] xl:w-[400px] 2xl:w-auto" />

        <div className="flex flex-col max-w-[610px] pt-0 lg:pt-24 gap-8 items-center lg:items-start text-center lg:text-left">
          <div className="flex flex-col px-[12px] gap-2 lg:gap-4">

            <p className="text-[#94979C]">
              Juan Silva — Rio de Janeiro, Brazil <span className="inline-flex w-[14px]"><img src="/assets/icons/BR.svg" alt="Brazil Flag" /></span>
            </p>
            <h1 className="text-[2rem] leading-[2.75rem] lg:text-[2.75rem] lg:leading-[3.75rem]">
              Design Engineer. Next.js, Python, and scalable growth automation.
            </h1>
            <p>
              Available for US agency overflow and contract engineering. Rio runs one hour ahead of US Eastern — 100% synchronous overlap.
            </p>

          </div>

          <div className="flex flex-col md:flex-row w-full px-[12px] gap-3 justify-center lg:justify-start">
            <a
              href={SOCIAL_LINKS.MAIL_CTA}
              className="flex flex-row justify-center items-center text-center gap-[6px] px-[18px] py-[12px] rounded-[8px] bg-[rgba(255,255,255,0.10)] border-2 border-[rgba(255,255,255,0.12)] text-[#F7F7F7] font-semibold hover:bg-[rgba(255,255,255,0.25)] transition-colors duration-300"
              aria-label="Send me an email"
            >
              Email me
            </a>
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="flex flex-row justify-center items-center text-center gap-[6px] px-[18px] py-[12px] rounded-[8px] bg-[rgba(255,255,255,0)] text-[#CECFD2] font-semibold border-2 border-[rgba(255,255,255,0)] hover:bg-[rgba(255,255,255,0.25)] hover:border-[rgba(255,255,255,0.25)] transition-colors duration-300"
              aria-label="LinkedIn Profile"
            >
              LinkedIn
              <img src="/assets/icons/link-external-02.svg" alt="" className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-row w-full gap-2 h-auto justify-center lg:justify-start">

            <a
              href={SOCIAL_LINKS.GITHUB}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 flex items-center justify-center"
              aria-label="GitHub Profile"
            >
              <img src="/assets/icons/github.svg" alt="GitHub" className="w-[28px] h-[28px] opacity-100 group-hover:opacity-70 transition-opacity duration-200" />
            </a>

            <a
              href={SOCIAL_LINKS.X}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 flex items-center justify-start"
              aria-label="Twitter Profile"
            >
              <img src="/assets/icons/twitter.svg" alt="Twitter" className="ml-[10px] w-[28px] h-[28px] opacity-100 group-hover:opacity-0" />
              <img src="/assets/icons/twitter-hover.svg" alt="Twitter" className="mr-[10px] w-[28px] h-[28px] opacity-0 group-hover:opacity-100 -translate-x-[28px]" />
            </a>

            <a
              href={SOCIAL_LINKS.FIGMA}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 flex items-center justify-start"
              aria-label="Figma Profile"
            >
              <img src="/assets/icons/figma-outlined.svg" alt="Figma" className="ml-[10px] w-[28px] h-[28px] opacity-100 group-hover:opacity-0" />
              <img src="/assets/icons/figma-outlined-hover.svg" alt="Figma" className="mr-[10px] w-[28px] h-[28px] opacity-0 group-hover:opacity-100 -translate-x-[28px]" />
            </a>

            <a
              href={SOCIAL_LINKS.DRIBBBLE}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 flex items-center justify-start"
              aria-label="Dribbble Profile"
            >
              <img src="/assets/icons/dribbble.svg" alt="Dribbble" className="ml-[10px] w-[28px] h-[28px] opacity-100 group-hover:opacity-0" />
              <img src="/assets/icons/dribbble-hover.svg" alt="Dribbble" className="mr-[10px] w-[28px] h-[28px] opacity-0 group-hover:opacity-100 -translate-x-[28px]" />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
