interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
    <div className="mt-3 h-0.5 w-12 bg-primary" />
  </div>
);

export default SectionHeader;
