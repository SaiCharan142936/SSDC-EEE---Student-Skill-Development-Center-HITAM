import Reveal from "@/components/Reveal";
import { User } from "lucide-react";
import facultySvs from "@/assets/faculty-svs.jpg";
import facultyPm from "@/assets/faculty-pm.jpg";
import facultyOps from "@/assets/faculty-ops.png";

interface FacultyMember {
  name: string;
  qualification: string;
  designation: string;
  role: string;
  img: string | null;
  expertise?: string;
  publications?: string;
}

const faculty: FacultyMember[] = [
  {
    name: "Dr. Pedda Suresh Ogeti",
    qualification: "Ph.D",
    designation: "Professor & HOD",
    role: "Reporting Head",
    img: facultyOps,
    expertise: "Power Electronics, Electric Vehicles",
  },
  {
    name: "Mr. Salava V. Satyanarayana",
    qualification: "M.E / M.Tech",
    designation: "Associate Professor",
    role: "Center In-Charge",
    img: facultySvs,
    expertise: "Power Systems, High Voltage Engineering, Machine Learning",
    publications: "20+ research publications · 3 patents in EV technologies",
  },
  {
    name: "Ms. Pillalamarri Madhavi",
    qualification: "M.E / M.Tech",
    designation: "Assistant Professor",
    role: "Faculty In-Charge",
    img: facultyPm,
    expertise: "Power Electronics, Electric Vehicles, AI-based Prediction Models",
    publications: "15+ research publications · 3 patents in EV technologies",
  },
];

interface FacultyGridProps {
  compact?: boolean;
}

const FacultyGrid = ({ compact = false }: FacultyGridProps) => (
  <div className={`grid gap-6 md:grid-cols-3 ${compact ? "max-w-3xl" : "max-w-4xl"}`}>
    {faculty.map((f, i) => (
      <Reveal key={f.name} delay={i * 0.06}>
        <div className="border rounded-sm p-5 bg-background text-center h-full flex flex-col items-center">
          {f.img ? (
            <img
              src={f.img}
              alt={f.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-primary/20 mb-3"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-3 border-2 border-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <h3 className="text-sm font-bold text-foreground">{f.name}</h3>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-0.5">{f.designation}</p>
          )}
          {!compact && (
            <p className="text-xs text-muted-foreground">{f.qualification}</p>
          )}
          <span className="inline-block mt-2 bg-primary/10 text-primary text-[11px] font-semibold px-3 py-1 rounded-sm">
            {f.role}
          </span>
          {!compact && f.expertise && (
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{f.expertise}</p>
          )}
          {!compact && f.publications && (
            <p className="text-xs text-muted-foreground mt-1">{f.publications}</p>
          )}
        </div>
      </Reveal>
    ))}
  </div>
);

export default FacultyGrid;
