import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Download } from "lucide-react";
import ssdcLogo from "@/assets/ssdc-logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src={ssdcLogo} alt="SSDC EEE Logo" className="h-12 w-auto object-contain bg-background/5 rounded-sm p-1" />
            <h3 className="text-base font-bold">SSDC EEE</h3>
          </div>
          <p className="text-xs text-background/60 leading-relaxed">
            Hyderabad Institute of Technology and Management<br />
            Department of Electrical and Electronics Engineering<br />
            Student Skill Development Center (SSDC)
          </p>
          <p className="text-xs text-background/40 mt-2">Established: 22-01-2018</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-background/80">Quick Links</h4>
          <div className="space-y-1.5 text-xs text-background/50">
            <Link to="/about" className="block hover:text-background">About SSDC</Link>
            <Link to="/courses" className="block hover:text-background">Courses</Link>
            <Link to="/projects" className="block hover:text-background">Projects</Link>
            <Link to="/achievements" className="block hover:text-background">Achievements</Link>
            <Link to="/research" className="block hover:text-background">Research</Link>
            <Link to="/events" className="block hover:text-background">Events</Link>
            <Link to="/gallery" className="block hover:text-background">Gallery</Link>
            <a href="https://www.vlab.co.in/broad-area-electrical-engineering" target="_blank" rel="noopener noreferrer" className="block hover:text-background">Virtual Labs ↗</a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-background/80">Faculty</h4>
          <div className="space-y-1.5 text-xs text-background/50">
            <p>Reporting Head: Dr. O.P. Suresh</p>
            <p>Center I/C: Mr. S.V. Satyanarayana</p>
            <p>Faculty I/C: Ms. P. Madhavi</p>
          </div>
          <a
            href="/ssdc_report.pdf"
            download
            className="inline-flex items-center gap-1.5 mt-4 rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-3 w-3" />
            Download Report
          </a>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-background/80">Contact</h4>
          <div className="space-y-2 text-xs text-background/50">
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
              <span>Gowdavelly (Village), Medchal (Mandal), Ranga Reddy (Dist.) – 501401, TS, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 shrink-0" />
              <span>ssdceee.hitam@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+91 90303 39001</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Link to="/contact" className="text-xs text-background/50 hover:text-background">
              Contact Us →
            </Link>
            <a
              href="https://youtube.com/@eeethepowerofindia6654?si=J60sD4UUcctusEn3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-background/50 hover:text-background"
            >
              YouTube ↗
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-background/10">
      <div className="container py-3 text-center text-xs text-background/30">
        © {new Date().getFullYear()} HITAM – Department of EEE. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
