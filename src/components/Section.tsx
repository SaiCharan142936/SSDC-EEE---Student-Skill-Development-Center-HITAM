import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  alt?: boolean;
  id?: string;
}

const Section = ({ children, className = "", alt = false, id }: SectionProps) => (
  <section id={id} className={`py-16 lg:py-20 ${alt ? "bg-secondary" : "bg-background"} ${className}`}>
    <div className="container">{children}</div>
  </section>
);

export default Section;
