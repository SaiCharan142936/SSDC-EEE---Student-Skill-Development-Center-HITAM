import Reveal from "@/components/Reveal";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

const PageHero = ({ title, subtitle, bgImage }: PageHeroProps) => (
  <section className="relative w-full h-[180px] md:h-[220px] overflow-hidden bg-secondary">
    {bgImage && (
      <>
        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
      </>
    )}
    <div className={`relative z-10 container h-full flex flex-col justify-center`}>
      <Reveal>
        <h1 className={`text-2xl lg:text-3xl font-extrabold uppercase ${bgImage ? "text-white" : "text-foreground"}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-1.5 text-sm max-w-xl ${bgImage ? "text-white/85" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
      </Reveal>
    </div>
  </section>
);

export default PageHero;
