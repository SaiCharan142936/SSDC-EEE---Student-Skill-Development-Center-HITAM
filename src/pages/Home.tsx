import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import { ArrowRight, Cpu, Settings, Code, Zap, Download } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import heroImg from "@/assets/hero-students-lab.jpg";
import wheelchairImg from "@/assets/project-wheelchair.jpg";
import ebikeImg from "@/assets/project-ebike.jpg";
import hybridImg from "@/assets/project-hybrid.jpg";
import iotImg from "@/assets/project-iot.jpg";
import helmetImg from "@/assets/project-helmet.jpg";
import pdfAutonomousEv from "@/assets/pdf-autonomous-ev.jpg";
import pdfScadaWorkshop from "@/assets/pdf-scada-workshop.jpg";
import pdfIotWorkshop from "@/assets/pdf-iot-workshop.jpg";
import FacultyGrid from "@/components/FacultyGrid";
import StudentTestimonials from "@/components/StudentTestimonials";
import { ssdcEvents } from "@/data/events";
import galleryAwards from "@/assets/gallery-awards.jpg";

const slides = [
  {
    img: heroImg,
    title: "SSDC – Student Skill Development Center",
    subtitle: "Bridging academics and industry through hands-on learning in Arduino, PLC automation, and Python programming.",
    cta: { label: "Explore Courses", to: "/courses" },
  },
  {
    img: pdfScadaWorkshop,
    title: "Industrial Automation Training",
    subtitle: "PLC & SCADA hands-on workshops preparing students for real-world industrial applications.",
    cta: { label: "View Courses", to: "/courses?tab=plc" },
  },
  {
    img: ebikeImg,
    title: "Student-Built Prototypes & Projects",
    subtitle: "Smart Wheelchair, Electric Bicycle, Hybrid Two-Wheeler, and more innovative engineering solutions.",
    cta: { label: "View Projects", to: "/projects" },
  },
  {
    img: galleryAwards,
    title: "Workshops & Technical Events",
    subtitle: "Regular workshops on IoT, sensors, PLC, SCADA, and emerging technologies.",
    cta: { label: "View Events", to: "/events" },
  },
];

const stats = [
  { value: "302+", label: "PLC Certifications" },
  { value: "50+", label: "MATLAB Certifications" },
  { value: "42+", label: "Python Certifications" },
  { value: "3", label: "Patents Published" },
  { value: "24+", label: "Research Papers" },
];

const trustItems = [
  { icon: Cpu, label: "Arduino Training" },
  { icon: Settings, label: "PLC Automation" },
  { icon: Code, label: "Python Programming" },
  { icon: Zap, label: "Industry Exposure" },
];

const courses = [
  {
    title: "Arduino and Sensor Interfacing",
    desc: "Hands-on training with microcontrollers, sensors, LCD displays, and motor control using Tinkercad simulation. Duration: 16 Weeks.",
    link: "/courses?tab=arduino",
  },
  {
    title: "Industrial Automation with PLC",
    desc: "Ladder logic programming, PLC architecture, timers, counters, and real-world industrial automation. Duration: 16 Weeks.",
    link: "/courses?tab=plc",
  },
  {
    title: "Python Programming",
    desc: "Core programming concepts, data structures, file handling, and exception handling for engineering applications. Duration: 12 Weeks.",
    link: "/courses?tab=python",
  },
];

const projects = [
  { title: "Smart Mobility Wheelchair", desc: "AI-based wheelchair with obstacle detection and multi-control modes.", img: wheelchairImg },
  { title: "Electric Bicycle", desc: "Eco-friendly bicycle with pedal assist, smart display and extended range.", img: ebikeImg },
  { title: "Hybrid Two-Wheeler", desc: "Vehicle that switches between petrol and electric modes seamlessly.", img: hybridImg },
  { title: "Smart Helmet", desc: "Safety helmet with accident detection and servo-controlled safety jacket.", img: helmetImg },
  { title: "IoT Load Automation", desc: "Remote automation of electrical appliances using sensors and mobile app.", img: iotImg },
  { title: "Autonomous EV", desc: "Level-2 autonomous system on EV platform with sensor-based perception.", img: pdfAutonomousEv },
];

const timeline = [
  { year: "2018–2020", title: "PLC & SCADA Workshop", desc: "Industrial Automation with PLC & SCADA training programs." },
  { year: "2021–2022", title: "EV Awareness & PLC Programming", desc: "Awareness Program on Electric Vehicles, hands-on PLC Programming & SCADA Workshop." },
  { year: "2022–2023", title: "IoT & Design Thinking", desc: "Real-Time Applications of Sensors with IoT, Design Thinking Workshop, Remote Labs under IEEE." },
  { year: "2023–2024", title: "IoT Workshop & Guest Lectures", desc: "IoT Workshop: Build Your Own Smart System, Guest Lecture on Industrial Automation." },
  { year: "2024–2026", title: "Industry Visit & Automation Training", desc: "Industry Visit to EV Manufacturing Unit, Industrial Automation Training Program." },
];

const achievements = [
  "302 students certified in PLC programming",
  "50 students certified in MATLAB (MathWorks)",
  "42 students certified in Python programming",
  "3 Indian patents published in Electric Vehicle technologies",
  "5 students selected for Internship at IIIT Hyderabad (2023)",
  "Best Project Awards at Project Expo (Tamil Nadu, 2021)",
  "First Prize at Synergia-2025, Hyderabad",
  "24+ research papers published in IEEE and SCOPUS journals",
];

const focusAreas = [
  "Industrial Automation and Control Systems",
  "Embedded Systems and Sensor Integration",
  "Electric Vehicles and Smart Mobility",
  "Internet of Things (IoT) Applications",
  "Programming and Data Handling",
];

const researchHighlights = [
  "Smart Bag for Women's Safety (IEEE Xplore)",
  "IoT-based College Bus Tracking System (IEEE Xplore)",
  "Prediction of Power and Current for Self Charging E-Bicycle Using ML (IEEE Xplore, 2024)",
  "RADAR-Driven Automation (Industrial Engineering Journal, 2025)",
  "Smart Laboratory Real Time Monitoring and Prediction (IJESAT, 2025)",
];

const Home = () => (
  <>
    {/* Hero Slider */}
    <HeroSlider slides={slides} interval={4000} />

    {/* Trust Bar */}
    <section className="border-b border-border bg-background">
      <div className="container">
        <Reveal>
          <div className="flex flex-wrap items-center gap-6 lg:gap-10 py-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-border bg-background">
      <div className="container">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border py-8">
            {stats.map((s) => (
              <div key={s.label} className="px-4 first:pl-0">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* About Preview */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3">About SSDC</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-3">
            The Student Skill Development Center (SSDC) under the Department of Electrical and Electronics Engineering at HITAM is established to bridge the gap between academic learning and industry requirements through practical, hands-on training in core and emerging technologies. Established on 22-01-2018, it has trained hundreds of students across Arduino, PLC, and Python programs.
          </p>
          <Link to="/about" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Read more about SSDC <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>

    {/* Key Focus Areas */}
    <section className="bg-secondary py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">Core Areas of Focus</h2>
        </Reveal>
        <ul className="space-y-2 max-w-3xl">
          {focusAreas.map((a, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <li className="flex gap-2 items-start text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>

    {/* Core Training Programs */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Core Training Programs</h2>
        </Reveal>
        <div className="space-y-4">
          {courses.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="border border-border rounded-sm p-5 hover:border-primary/40 transition-colors">
                <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                <Link to={c.link} className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:underline">
                  View Curriculum <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Student Innovations */}
    <section className="bg-secondary py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Student Innovations</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="border border-border rounded-sm overflow-hidden bg-background">
                <img src={p.img} alt={p.title} loading="lazy" width={640} height={512} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-6">
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View All Projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Latest SSDC Events */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Latest SSDC Events</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ssdcEvents().slice(0, 3).map((ev, i) => (
            <Reveal key={ev.id} delay={i * 0.05}>
              <div className="border border-border rounded-sm overflow-hidden bg-background h-full flex flex-col">
                <img src={ev.image} alt={ev.title} loading="lazy" className="w-full h-40 object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary">SSDC</span>
                  <h3 className="text-sm font-bold text-foreground mt-1">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5">{ev.displayDate}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-6">
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View All Events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Events Timeline */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Workshops & Events</h2>
        </Reveal>
        <div className="relative pl-6 border-l-2 border-border space-y-6">
          {timeline.map((e, i) => (
            <Reveal key={e.year} delay={i * 0.05}>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                <div className="text-xs font-bold text-primary">{e.year}</div>
                <h3 className="text-sm font-semibold text-foreground mt-0.5">{e.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-6">
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View All Events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Achievements */}
    <section className="bg-secondary py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">Achievements</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-4">
            <Link to="/achievements" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View All Achievements <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Research Highlights */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">Research Highlights</h2>
          <p className="text-sm text-muted-foreground mb-3 max-w-3xl">24+ research papers published in IEEE, SCOPUS, and peer-reviewed journals. Notable works include:</p>
        </Reveal>
        <ul className="space-y-2 max-w-3xl">
          {researchHighlights.map((r, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <li className="flex gap-2 items-start text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{r}
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2}>
          <div className="mt-4">
            <Link to="/research" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View Research & Publications <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Student Testimonials */}
    <StudentTestimonials />

    {/* Faculty Preview */}
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Faculty Coordinators</h2>
        </Reveal>
        <FacultyGrid compact />
      </div>
    </section>

    {/* CTA */}
    <section className="bg-[hsl(var(--primary-dark))] text-primary-foreground">
      <div className="container py-10 lg:py-12">
        <Reveal>
          <h2 className="text-lg lg:text-xl font-bold">Explore Full SSDC Report and Activities</h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Download the complete report covering training programs, projects, research, and achievements.
          </p>
          <a
            href="/ssdc_report.pdf"
            download
            className="inline-flex items-center gap-1.5 mt-4 rounded-sm bg-background text-foreground px-5 py-2 text-sm font-medium hover:bg-background/90 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download Report
          </a>
        </Reveal>
      </div>
    </section>
  </>
);

export default Home;
