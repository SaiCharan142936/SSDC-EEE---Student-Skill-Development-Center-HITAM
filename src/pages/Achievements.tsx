import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import pdfPlcCert from "@/assets/pdf-plc-cert.jpg";
import pdfBestPaper from "@/assets/pdf-best-paper.jpg";
import pdfBestProjectTeam from "@/assets/pdf-best-project-team.jpg";

const certifications = [
  { label: "Industrial Automation with PLC", count: 302 },
  { label: "MATLAB Onramp (MathWorks)", count: 50 },
  { label: "Python Programming", count: 42 },
];

const patents = [
  "Indian Patent on Smart Mobility Electric Wheelchair with AI-driven performance optimization",
  "Indian Patent on Multifunctional Electric Bicycle with pedal-assist and smart display",
  "Indian Patent on Electric Tricycle for empowered handicapped travel",
];

const awards = [
  "Two Projects received Best Project awards in the Project Expo held at Tamil Nadu in 2021",
  "Two Projects received Certificate of Merit in the Project Expo held at Tamil Nadu in 2021",
  "Won First Prize at Synergia-2025, Hyderabad",
  "Won Third Prize at National Level Technical Symposium & Idea Pitching, BVRIT, Narsapur (August 2025)",
  "Won Third Prize at Innofiesta, HITAM (November 2024)",
  "Recognition for innovative projects: Smart Dustbin, Electric Bicycle, IoT-based Monitoring Systems",
];

const participationEvents = [
  "IEEE E-Jigyasa Project Expo, NIT Warangal (April 2025)",
  "BUILDATHON-2025 Model Showcase Competition, Anurag University (September 2025)",
  "IEEE Section Student Congress-2025, Vardhaman College of Engineering (December 2025)",
  "IGNITE-2k26 National Level Project Expo, Narsimha Reddy Engineering College (February 2026)",
  "Paper Presentation in ADVAYA-2k24 National Level Management Fest (December 2024)",
  "Technopilla, MIT Academy, Pune – Smart Bag for Women's Safety, Electric Bicycle (March 2023)",
  "VALORUS 2023, MLRIT – Multiple project presentations (March 2023)",
  "VIDYUT-2023, Vardhaman College of Engineering (March 2023)",
];

const researchAreas = [
  "Electric Vehicles and Smart Mobility",
  "IoT-based Automation and Monitoring",
  "Power Systems and Energy Management",
  "Machine Learning Applications in EE",
];

const facultyAchievements = [
  "Faculty certified in PLC and Industrial Automation",
  "One faculty completed PG Diploma in Automation and two faculties got certified in PLC",
  "Active contribution to research publications and patents",
  "20+ publications by Mr. S.V. Satyanarayana in reputed journals",
  "15+ publications by Ms. P. Madhavi in IEEE and SCOPUS journals",
];

const impact = [
  "Improved employability through industry-relevant skills",
  "Strong foundation in practical engineering applications",
  "Increased student participation in research and innovation",
  "Development of problem-solving and critical thinking abilities",
];

const Achievements = () => (
  <>
    <PageHero
      title="Achievements and Recognitions"
      subtitle="The SSDC has consistently contributed to student development through certifications, research, innovation, and active participation in technical events."
      bgImage={pdfPlcCert}
    />

    {/* Certification Achievements */}
    <Section>
      <SectionHeader title="Certification Achievements" />
      <div className="max-w-3xl space-y-4">
        {certifications.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="font-bold text-foreground">{c.count} Students</span>
              </div>
              <div className="h-3 bg-secondary rounded-sm overflow-hidden">
                <div className="h-full bg-primary rounded-sm" style={{ width: `${(c.count / 302) * 100}%` }} />
              </div>
            </div>
          </Reveal>
        ))}
        <p className="text-xs text-muted-foreground mt-2">These certifications enhance students' technical competencies and improve their readiness for industry roles.</p>
      </div>
    </Section>

    {/* Patents */}
    <Section alt>
      <SectionHeader title="Patents Published" />
      <Reveal>
        <p className="text-sm text-muted-foreground mb-3 max-w-3xl">Three Indian Patents published by students and faculty on Electric Vehicle technologies:</p>
      </Reveal>
      <ul className="space-y-2 max-w-3xl">
        {patents.map((p, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{p}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Internship */}
    <Section>
      <SectionHeader title="Internship and Industry Exposure" />
      <Reveal>
        <div className="border rounded-sm p-5 bg-background max-w-3xl">
          <h4 className="text-sm font-bold text-foreground">IIIT Hyderabad Internship (2023)</h4>
          <p className="text-xs text-muted-foreground mt-1">5 students selected for Internship at IIIT Hyderabad as a part of college research affiliated Program in 2023. This reflects the practical skill level and research capability developed through SSDC training programs.</p>
        </div>
      </Reveal>
    </Section>

    {/* Awards with images */}
    <Section alt>
      <SectionHeader title="Awards and Recognitions" />
      <div className="grid gap-4 md:grid-cols-3 max-w-3xl mb-6">
        <Reveal>
          <div className="border rounded-sm overflow-hidden bg-background">
            <img src={pdfPlcCert} alt="PLC Certification Award" loading="lazy" className="w-full h-40 object-cover" />
            <div className="p-3"><p className="text-xs text-muted-foreground">Top Performer – PLC Certification</p></div>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="border rounded-sm overflow-hidden bg-background">
            <img src={pdfBestPaper} alt="Best Paper Award" loading="lazy" className="w-full h-40 object-cover" />
            <div className="p-3"><p className="text-xs text-muted-foreground">Best Paper Award – NCRCEST</p></div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="border rounded-sm overflow-hidden bg-background">
            <img src={pdfBestProjectTeam} alt="Best Project Team" loading="lazy" className="w-full h-40 object-cover" />
            <div className="p-3"><p className="text-xs text-muted-foreground">Best Project Team – PLC Certification</p></div>
          </div>
        </Reveal>
      </div>
      <ul className="space-y-2 max-w-3xl">
        {awards.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Student Participation */}
    <Section>
      <SectionHeader title="Student Participation in Technical Events" />
      <Reveal>
        <p className="text-sm text-muted-foreground mb-3 max-w-3xl">Students actively participate in national-level technical fests, symposiums, and project expos:</p>
      </Reveal>
      <ul className="space-y-2 max-w-3xl">
        {participationEvents.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Research Publications */}
    <Section alt>
      <SectionHeader title="Research Publications" />
      <div className="max-w-3xl">
        <Reveal>
          <div className="border rounded-sm p-5 bg-background mb-4">
            <div className="text-2xl font-bold text-foreground">24+</div>
            <div className="text-xs text-muted-foreground mt-1">Research Papers Published in peer-reviewed journals and international conferences</div>
            <div className="text-xs text-muted-foreground">IEEE and SCOPUS-indexed contributions</div>
          </div>
        </Reveal>
        <p className="text-sm text-muted-foreground mb-2">Research areas include:</p>
        <ul className="space-y-1.5">
          {researchAreas.map((a, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <li className="flex gap-2 items-start text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>

    {/* Faculty Achievements */}
    <Section>
      <SectionHeader title="Faculty Achievements" />
      <ul className="space-y-2 max-w-3xl">
        {facultyAchievements.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>

    {/* Impact */}
    <Section alt>
      <SectionHeader title="Impact of SSDC" />
      <ul className="space-y-2 max-w-3xl">
        {impact.map((a, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <li className="flex gap-2 items-start text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={0.16}>
        <p className="text-sm text-muted-foreground mt-4 max-w-3xl font-medium">The center plays a crucial role in transforming students into industry-ready engineers.</p>
      </Reveal>
    </Section>
  </>
);

export default Achievements;
