import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "lucide-react";
import facultySvs from "@/assets/faculty-svs.jpg";
import facultyPm from "@/assets/faculty-pm.jpg";
import heroImg from "@/assets/hero-students-lab.jpg";

const focusAreas = [
  "Electric Vehicles and Smart Mobility Systems",
  "Industrial Automation and Control Systems",
  "Internet of Things (IoT) Applications",
  "Power Systems and Energy Management",
  "Machine Learning Applications in Electrical Engineering",
];

const contributions = [
  "24+ Research Papers Published in reputed journals and conferences",
  "Publications in IEEE, SCOPUS, and peer-reviewed journals",
  "Research focused on practical implementation and real-time systems",
  "3 Indian Patents published on Electric Vehicle technologies",
];

const selectedWorks = [
  { title: "Smart Bag for Women's Safety", journal: "IEEE Xplore", year: "2023" },
  { title: "IoT-based College Bus Tracking System", journal: "IEEE Xplore", year: "2023" },
  { title: "Multifunctional Electric Bicycle", journal: "Int. Conf. Advances in EE", year: "2023" },
  { title: "Big Data Analytics for Electrical Systems using ML", journal: "TEMSTET & W3S", year: "2023" },
  { title: "Prediction of Power and Current for Self Charging E-Bicycle Using ML", journal: "IEEE Xplore (ICPEEV-2024)", year: "2024" },
  { title: "Prediction of Voltage Discharge for Electric Tricycle Using ML", journal: "IEEE Xplore (ICPEEV-2024)", year: "2024" },
  { title: "Life Guardian: Enhancing Health Awareness Through Sensor Fusion", journal: "ICSGET-2024", year: "2024" },
  { title: "Solar Wireless Electric Vehicle Charging System", journal: "ICSGET-2024", year: "2024" },
  { title: "IoT & Sensor-Driven Automation in Streamlined Lab", journal: "PICET 2024", year: "2024" },
  { title: "Effectiveness of PBL Curriculum in Preparing EE Students through SSDC", journal: "RRSPBL-2024 & JEET", year: "2024" },
  { title: "RADAR-Driven Automation", journal: "Industrial Engineering Journal", year: "2025" },
  { title: "Compact High Efficiency Power Inverter System", journal: "Industrial Engineering Journal", year: "2025" },
  { title: "Creation of Web Page for SSDC", journal: "Industrial Engineering Journal", year: "2025" },
  { title: "Smart Laboratory Real Time Monitoring and Prediction", journal: "IJESAT", year: "2025" },
  { title: "Prediction of Energy Requirement and Supply Using Supervised ML", journal: "AIP Conference Proceedings", year: "2025" },
];

const researchImpact = [
  "Development of innovative engineering solutions",
  "Enhancement of student research capabilities",
  "Strengthening of academic and industry collaboration",
  "Publication in reputed journals and conferences",
];

const Research = () => (
  <>
    <PageHero
      title="Research and Publications"
      subtitle="The SSDC actively promotes research, innovation, and publication among students and faculty in emerging domains."
      bgImage={heroImg}
    />

    {/* Research Focus Areas */}
    <Section>
      <SectionHeader title="Research Focus Areas" />
      <ul className="space-y-2 max-w-3xl">
        {focusAreas.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Research Contributions */}
    <Section alt>
      <SectionHeader title="Research Contributions" />
      <ul className="space-y-2 max-w-3xl">
        {contributions.map((c, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{c}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Selected Research Works - now with journal and year */}
    <Section>
      <SectionHeader title="Selected Research Works" />
      <div className="max-w-3xl space-y-3">
        {selectedWorks.map((w, i) => (
          <Reveal key={i} delay={i * 0.03}>
            <div className="border rounded-sm p-4 bg-background">
              <h4 className="text-sm font-medium text-foreground">{w.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{w.journal} · {w.year}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    {/* Faculty Research Profile */}
    <Section alt>
      <SectionHeader title="Faculty Research Profile" />
      <div className="space-y-4 max-w-3xl">
        <Reveal>
          <div className="border rounded-sm p-5 bg-background flex gap-4 items-start">
            <img src={facultySvs} alt="Mr. S.V. Satyanarayana" className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Mr. Salava V. Satyanarayana</h3>
              <p className="text-xs text-primary font-medium">Associate Professor, EEE | Pursuing Ph.D., Acharya Nagarjuna University</p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs text-muted-foreground">• Expertise in Power Systems, High Voltage Engineering, and Machine Learning</li>
                <li className="text-xs text-muted-foreground">• 20+ research publications in reputed journals and conferences</li>
                <li className="text-xs text-muted-foreground">• 3 patents related to Electric Vehicle technologies</li>
                <li className="text-xs text-muted-foreground">• Research: Smart grids, renewable integration, ML-based prediction, IoT-enabled energy</li>
              </ul>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="border rounded-sm p-5 bg-background flex gap-4 items-start">
            <img src={facultyPm} alt="Ms. P. Madhavi" className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Ms. P. Madhavi</h3>
              <p className="text-xs text-primary font-medium">Assistant Professor, EEE | Pursuing Ph.D., JNTUH</p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs text-muted-foreground">• Expertise in Power Electronics, Electric Vehicles, and AI-based prediction models</li>
                <li className="text-xs text-muted-foreground">• 15+ research publications in reputed journals and conferences</li>
                <li className="text-xs text-muted-foreground">• 3 patents related to Electric Vehicle technologies</li>
                <li className="text-xs text-muted-foreground">• Research: Renewable energy and EV integration with AI applications</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>

    {/* Research Impact */}
    <Section>
      <SectionHeader title="Research Impact" />
      <Reveal>
        <p className="text-sm text-muted-foreground mb-3 max-w-3xl">The research activities under SSDC have contributed to:</p>
      </Reveal>
      <ul className="space-y-2 max-w-3xl">
        {researchImpact.map((r, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{r}
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={0.16}>
        <p className="text-sm text-muted-foreground mt-4 max-w-3xl font-medium">The center plays a vital role in fostering a research-driven academic environment.</p>
      </Reveal>
    </Section>

    {/* CTA */}
    <section className="bg-[hsl(var(--primary-dark))] text-primary-foreground">
      <div className="container py-10">
        <Reveal>
          <h2 className="text-xl font-bold mb-4">Explore Full SSDC Report</h2>
          <a href="/ssdc_report.pdf" download className="inline-flex items-center gap-1.5 rounded-sm border border-primary-foreground/40 px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            Download PDF →
          </a>
        </Reveal>
      </div>
    </section>
  </>
);

export default Research;
