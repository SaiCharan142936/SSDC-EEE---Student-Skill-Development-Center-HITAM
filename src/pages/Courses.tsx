import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { ChevronRight, ChevronDown, Clock } from "lucide-react";
import pdfScadaWorkshop from "@/assets/pdf-scada-workshop.jpg";
import ArduinoSimulation from "@/components/simulations/ArduinoSimulation";
import PLCSimulation from "@/components/simulations/PLCSimulation";
import PythonCompiler from "@/components/simulations/PythonCompiler";

const courseData = [
  {
    id: "arduino",
    title: "Arduino and Sensor Interfacing Fundamentals (Using Tinkercad)",
    duration: "16 Weeks",
    overview: "This course introduces students to embedded systems and sensor interfacing using Arduino. It focuses on building real-time applications through simulation and hardware integration, enabling students to understand how electronic components interact in practical systems.",
    objectives: [
      "To provide foundational knowledge of Arduino programming",
      "To enable interfacing with sensors and actuators",
      "To develop real-time embedded system applications",
      "To enhance problem-solving through hands-on experimentation",
    ],
    tools: ["Arduino UNO", "Tinkercad Simulation", "Sensors (LDR, Ultrasonic, Temperature, Smoke, PIR)", "LCD Displays", "Relay Modules", "Motor Driver (L293D)"],
    modules: [
      { title: "Introduction", topics: ["Introduction to Arduino UNO", "Overview of Tinkercad simulation environment", "Course syllabus overview"] },
      { title: "Basic Interfacing", topics: ["Interfacing LED with Arduino using Tinkercad", "Turning LED ON and OFF", "Implementing sequence of operations", "Interfacing Buzzer with Arduino"] },
      { title: "Advanced Output Control", topics: ["Interfacing Tri-Colour (RGB) LED", "Controlling individual colors", "Implementing output sequencing logic", "Review of buzzer control logic"] },
      { title: "Sensor Interfacing", topics: ["Interfacing LDR sensor using Arduino", "Designing counter logic using LDR sensor", "Interfacing soil moisture sensor", "Controlling LED/Buzzer based on sensor values"] },
      { title: "Distance Measurement", topics: ["Interfacing ultrasonic sensor using Arduino", "Writing programs for measuring specific distance", "Interfacing 16×2 LCD display", "Displaying text and sensor information on LCD"] },
      { title: "Detection Systems", topics: ["Interfacing smoke sensor", "Controlling LED/Buzzer based on smoke levels (HIGH/LOW logic)", "Interfacing PIR sensor", "Writing code for object/motion detection"] },
      { title: "Control Systems", topics: ["Interfacing relay using Arduino", "Writing programs to turn relay ON and OFF", "Load control using relay switching"] },
      { title: "Monitoring Systems", topics: ["Interfacing temperature sensor", "Writing code to measure and display temperature values", "Threshold-based temperature monitoring"] },
      { title: "Motor Control & Projects", topics: ["Interfacing L293D motor driver", "Writing code for forward and backward motor rotation", "Certification activities", "Mini-project design and implementation"] },
    ],
    outcomes: [
      "Ability to design sensor-based embedded systems",
      "Understanding of real-time hardware interfacing",
      "Development of IoT-ready applications",
      "Improved practical implementation skills",
    ],
  },
  {
    id: "plc",
    title: "Industrial Automation with PLC",
    duration: "16 Weeks",
    overview: "This course provides in-depth knowledge of industrial automation using Programmable Logic Controllers (PLC). Students gain practical experience in ladder logic programming and real-time industrial applications.",
    objectives: [
      "To understand PLC architecture and operation",
      "To develop ladder logic programs",
      "To implement industrial automation systems",
      "To gain hands-on experience in real-time applications",
    ],
    tools: ["PLC Systems", "Ladder Logic Programming Software", "Industrial Sensors and Actuators", "Control Panels"],
    modules: [
      { title: "PLC Fundamentals", topics: ["Introduction to PLC hardware", "Architectural Evolution of PLC", "Role of PLC in Automation", "Introduction to field devices attached to PLC", "AB PLC fundamental (Block Diagram)", "Detail information about PLC components: Power supply, CPU, I/O Modules", "Communication Cards", "Various range available in PLC", "Type of inputs & Outputs", "Source sink Concept in PLC", "Scan cycle execution"] },
      { title: "Programming Basics", topics: ["Introduction of PLC software", "Addressing Concepts", "Programming instruction arithmetic & logical", "Leading edge / trailing edge instructions"] },
      { title: "Control Logic", topics: ["Timer Blocks programming", "Counter block programming", "Standard procedure for writing ladder logic", "Hands-on experience on writing programs", "Creating / Editing a ladder logic", "Documenting the project"] },
      { title: "Industrial Applications", topics: ["Projects on Industrial applications"] },
    ],
    outcomes: [
      "Ability to design and implement PLC-based control systems",
      "Understanding of industrial automation workflows",
      "Hands-on experience with real-time applications",
      "Readiness for industrial automation roles",
    ],
  },
  {
    id: "python",
    title: "Python Programming",
    duration: "12 Weeks",
    overview: "This course builds strong programming fundamentals using Python. It focuses on problem-solving, data handling, and application development relevant to engineering domains.",
    objectives: [
      "To develop programming logic and problem-solving skills",
      "To understand core Python concepts",
      "To work with data structures and files",
      "To handle real-world programming scenarios",
    ],
    tools: ["Python Programming Environment", "IDEs (VS Code / IDLE)", "File Handling Systems"],
    modules: [
      { title: "Fundamentals", topics: ["Python Fundamentals & Installation", "Arithmetic Operators", "Relational/Comparison Operators", "Logical operators", "Bitwise operators", "Assignment operators", "Special operators"] },
      { title: "Flow Control", topics: ["Conditional Statements", "Transfer Statements", "Iterative Statements", "Strings data Type", "Mathematical Operators of the String", "Comparison and Removing Spaces of String", "Joining and Splitting of strings", "Formatting"] },
      { title: "Data Structures", topics: ["List data Structures – Creation, Accessing, Manipulating, Ordering", "Tuple data Structures – Len, Count, Index, Sorted, Cmp", "Set data Structure – Creation, Important Functions, Mathematical Operations", "Dictionary data Structure – Functions of Dictionary"] },
      { title: "Functions & File Handling", topics: ["Built-in Functions", "User defined Functions", "Types of Files", "Types of Errors", "Exception Handling", "Pattern Programs"] },
    ],
    outcomes: [
      "Strong programming fundamentals",
      "Ability to solve engineering problems using Python",
      "Understanding of data structures and algorithms",
      "Preparedness for software and automation applications",
    ],
  },
];

const Courses = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeId, setActiveId] = useState(tabParam && ["arduino", "plc", "python"].includes(tabParam) ? tabParam : "arduino");
  const [expandedModule, setExpandedModule] = useState(0);
  const course = courseData.find((c) => c.id === activeId)!;

  useEffect(() => {
    if (tabParam && ["arduino", "plc", "python"].includes(tabParam)) {
      setActiveId(tabParam);
      setExpandedModule(0);
    }
  }, [tabParam]);

  return (
    <>
      <PageHero
        title={course.title}
        subtitle={`Duration: ${course.duration} · Hands-on training program`}
        bgImage={pdfScadaWorkshop}
      />

      {/* Course nav tabs */}
      <section className="border-b bg-background">
        <div className="container flex gap-0 overflow-x-auto">
          {courseData.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveId(c.id); setExpandedModule(0); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeId === c.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.id === "arduino" ? "Arduino" : c.id === "plc" ? "PLC" : "Python"}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Overview */}
            <h2 className="text-lg font-bold text-foreground mb-2">Course Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{course.overview}</p>

            {/* Objectives */}
            <h2 className="text-lg font-bold text-foreground mb-2">Course Objectives</h2>
            <ul className="space-y-1.5 mb-8">
              {course.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {o}
                </li>
              ))}
            </ul>

            {/* Modules accordion */}
            <h2 className="text-lg font-bold text-foreground mb-3">Course Modules</h2>
            <div className="space-y-2">
              {course.modules.map((m, i) => (
                <Reveal key={m.title + activeId} delay={i * 0.03}>
                  <div>
                    <button
                      onClick={() => setExpandedModule(expandedModule === i ? -1 : i)}
                      className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-sm px-4 py-3 text-sm font-medium text-left"
                    >
                      <span>Module {i + 1}: {m.title}</span>
                      {expandedModule === i ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                    </button>
                    {expandedModule === i && (
                      <div className="border border-t-0 rounded-b-sm p-4 space-y-2">
                        {m.topics.map((t, j) => (
                          <div key={j} className="flex gap-2 items-start text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/40 shrink-0" />
                            {t}
                          </div>
                        ))}
                        {activeId === "arduino" && (
                          <>
                            <div className="mt-4 border-t border-dashed border-border pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="h-4 w-1 bg-primary rounded-full" />
                                <h4 className="text-sm font-bold text-foreground">Arduino Simulation</h4>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">
                                Access real Arduino simulations for this module via the Tinkercad platform — build, wire and run circuits in your browser.
                              </p>
                              <a
                                href="https://www.tinkercad.com/circuits"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                              >
                                Open Tinkercad Simulation ↗
                              </a>
                            </div>
                            <ArduinoSimulation moduleIndex={i} />
                          </>
                        )}
                        {activeId === "plc" && <PLCSimulation moduleIndex={i} />}
                        {activeId === "python" && <PythonCompiler moduleIndex={i} />}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border rounded-sm p-5">
              <h3 className="text-sm font-bold text-foreground border-b pb-2 mb-3">Learning Outcomes</h3>
              <ul className="space-y-2">
                {course.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-sm p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Tools & Technologies</h3>
              <ul className="space-y-1.5">
                {course.tools.map((t) => (
                  <li key={t} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-foreground/40 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Practice Resources */}
      <Section alt>
        <h2 className="text-lg font-bold text-foreground mb-3">Practice Resources</h2>
        <Reveal>
          <div className="border rounded-sm p-5 bg-background max-w-xl">
            <h3 className="text-sm font-bold text-foreground mb-1">Virtual Labs – Electrical Engineering</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Access free virtual experiments in Electrical Engineering provided by the Ministry of Education, Government of India.
            </p>
            <a
              href="https://www.vlab.co.in/broad-area-electrical-engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Virtual Labs ↗
            </a>
          </div>
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
};

export default Courses;
