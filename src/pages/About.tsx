import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { Eye, Target, BookOpen, Wrench, Lightbulb, Building } from "lucide-react";
import FacultyGrid from "@/components/FacultyGrid";
import heroImg from "@/assets/hero-students-lab.jpg";
import teamSaicharan from "@/assets/team-saicharan.jpg";
import teamAkanksha from "@/assets/team-akanksha.jpg";

const objectives = [
  "To train students in emerging technologies relevant to the EEE domain.",
  "To enhance practical knowledge through simulations and real-time implementation.",
  "To cultivate analytical thinking and engineering problem-solving skills.",
  "To align academic curriculum with current industry requirements.",
  "To encourage continuous learning and technical adaptability.",
];

const programStructure = [
  {
    icon: Wrench,
    title: "Technical Training",
    items: ["Arduino and Sensor Interfacing", "Industrial Automation with PLC", "Python Programming"],
  },
  {
    icon: Lightbulb,
    title: "Project-Based Learning",
    items: ["Smart Mobility Systems", "Electric Vehicles", "IoT-based Automation"],
  },
  {
    icon: BookOpen,
    title: "Workshops & Technical Sessions",
    items: ["PLC & SCADA training", "IoT and sensor-based workshops", "Guest lectures by industry experts"],
  },
  {
    icon: Building,
    title: "Industry Exposure",
    items: ["Industrial visits", "Internship opportunities", "Participation in technical events"],
  },
];

const coreAreas = [
  "Industrial Automation and Control Systems",
  "Embedded Systems and Sensor Integration",
  "Electric Vehicles and Smart Mobility",
  "Internet of Things (IoT) Applications",
  "Programming and Data Handling",
];

const outcomes = [
  "Bridging the theory-practice gap, the center equips students with hands-on skills for immediate industry impact.",
  "Programming and automation courses foster critical problem-solving abilities, empowering students to tackle engineering challenges.",
  "Mastering in-demand skills builds student confidence, allowing them to approach careers with a strong foundation.",
  "The center ignites lifelong learning, as programming skills continuously adapt to the evolving engineering landscape.",
  "Addressing the industry gap directly, the program ensures graduates possess the specific skills and technologies currently used by companies.",
];

const benefits = [
  "Exposure to real-time industrial tools and technologies.",
  "Opportunity to work on practical and innovative projects.",
  "Strengthening of resumes with certifications and project experience.",
  "Improved problem-solving and analytical abilities.",
  "Better preparedness for core engineering careers.",
];

const whySsdc = [
  "Industry-Relevant Curriculum",
  "Focus on Practical Skills",
  "Flexible Learning Options",
  "Practical Teaching Methodologies",
  "Continuous Skill Upgradation",
];

const About = () => (
  <>
    <PageHero
      title="About SSDC – EEE"
      subtitle="Bridging the gap between academic learning and industry requirements through hands-on training."
      bgImage={heroImg}
    />

    {/* Introduction */}
    <Section>
      <Reveal>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          The Student Skill Development Center (SSDC) under the Department of Electrical and Electronics Engineering at Hyderabad Institute of Technology and Management is established to bridge the gap between academic learning and industry requirements. The center focuses on imparting practical, hands-on training in core and emerging technologies such as Arduino, Industrial Automation with PLC, and Python programming. It enables students to apply theoretical concepts to real-world engineering problems, thereby enhancing technical competence and industry readiness.
        </p>
      </Reveal>
    </Section>

    {/* Vision & Mission */}
    <Section alt>
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        <Reveal>
          <div className="border rounded-sm overflow-hidden bg-background">
            <div className="bg-primary py-4 px-5 flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-bold text-primary-foreground">Our Vision</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                To develop technically competent engineers equipped with practical skills, innovation capability, and industry-oriented knowledge in emerging electrical and electronics domains.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="border rounded-sm overflow-hidden bg-background">
            <div className="bg-primary py-4 px-5 flex items-center gap-3">
              <Target className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-bold text-primary-foreground">Our Mission</span>
            </div>
            <div className="p-5">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2 items-start"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />To provide structured training in core technologies such as Arduino, PLC, and Python.</li>
                <li className="flex gap-2 items-start"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />To bridge the gap between theoretical knowledge and practical application.</li>
                <li className="flex gap-2 items-start"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />To promote problem-solving skills through project-based learning.</li>
                <li className="flex gap-2 items-start"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />To prepare students for industry demands through hands-on exposure.</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>

    {/* Objectives */}
    <Section>
      <SectionHeader title="Objectives" />
      <ul className="space-y-2 max-w-3xl">
        {objectives.map((o, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {o}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Program Structure */}
    <Section alt>
      <SectionHeader title="Program Structure" />
      <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
        {programStructure.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="border rounded-sm p-5 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <p.icon className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {p.items.map((item, j) => (
                  <li key={j} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-foreground/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    {/* Core Areas of Focus */}
    <Section>
      <SectionHeader title="Core Areas of Focus" />
      <ul className="space-y-2 max-w-3xl">
        {coreAreas.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {a}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Outcomes */}
    <Section alt>
      <SectionHeader title="Outcomes" />
      <ul className="space-y-2 max-w-3xl">
        {outcomes.map((o, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {o}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Benefits to Students */}
    <Section>
      <SectionHeader title="Benefits to Students" />
      <Reveal>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-4">
          The Skill Development Center benefits students by equipping them with in-demand skills like Arduino programming and Python, bridging the gap between theory and practical applications in the electrical and electronics engineering industry. This not only strengthens their resumes but also fosters critical thinking and problem-solving abilities.
        </p>
      </Reveal>
      <ul className="space-y-2 max-w-3xl">
        {benefits.map((b, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {b}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Why SSDC */}
    <Section alt>
      <SectionHeader title="Why SSDC?" />
      <Reveal>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-4">
          The SSDC stands as a platform where students move beyond theoretical learning and engage in practical implementation. By integrating technical training, projects, and industry exposure, the center ensures that students are not only academically strong but also professionally competent.
        </p>
      </Reveal>
      <ul className="space-y-2 max-w-3xl">
        {whySsdc.map((w, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {w}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Faculty Section */}
    <Section>
      <SectionHeader title="Faculty" />
      <FacultyGrid />
    </Section>

    {/* SSDC Technical Team */}
    <Section alt>
      <SectionHeader title="SSDC Technical Team" />
      <div className="grid gap-5 md:grid-cols-2 max-w-3xl">
        {[
          {
            img: teamSaicharan,
            name: "R. Chandra Sai Charan",
            roll: "Roll No: 23E51A0210",
            role: "Designer & Developer",
            workedOn: "Website / Simulations / Backend",
            desc: "Designed and developed the SSDC EEE platform end-to-end, including interactive Arduino, PLC and Python simulation modules.",
          },
          {
            img: teamAkanksha,
            name: "L. Akanksha",
            roll: "Roll No: 24E55A0213",
            role: "Research & Documentation Lead",
            workedOn: "Research / Content / Documentation",
            desc: "Led research, content curation and documentation across courses, projects and events to ensure accurate, high-quality information.",
          },
        ].map((m, i) => (
          <Reveal key={m.name} delay={i * 0.06}>
            <div className="border rounded-sm overflow-hidden bg-background flex items-center gap-4 p-4">
              <img
                src={m.img}
                alt={m.name}
                loading="lazy"
                className="w-28 h-28 rounded-full object-cover object-center shrink-0 border-2 border-primary/20"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">{m.name}</h3>
                <p className="text-[11px] text-primary font-medium mt-0.5">{m.role}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.roll}</p>
                <p className="text-[11px] text-foreground mt-2">
                  <span className="font-semibold">Worked on:</span> {m.workedOn}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
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

export default About;
