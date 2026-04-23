import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Download, ChevronDown, LogOut, ShieldCheck, LogIn } from "lucide-react";
import ssdcLogo from "@/assets/ssdc-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Courses",
    path: "/courses",
    dropdown: [
      { label: "Arduino and Sensor Interfacing", path: "/courses?tab=arduino" },
      { label: "Industrial Automation with PLC", path: "/courses?tab=plc" },
      { label: "Python Programming", path: "/courses?tab=python" },
    ],
  },
  { label: "Projects", path: "/projects" },
  { label: "Achievements", path: "/achievements" },
  { label: "Research", path: "/research" },
  { label: "Events", path: "/events" },
  { label: "Gallery", path: "/gallery" },
  { label: "VirtualLabs", path: "https://www.vlab.co.in/broad-area-electrical-engineering", external: true },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={ssdcLogo} alt="SSDC EEE Logo" width={64} height={64} className="h-14 w-auto object-contain" />
          <span className="text-lg font-bold text-foreground">SSDC <span className="text-primary">EEE</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-0">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.path} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`relative px-3 py-4 text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronDown className="h-3 w-3" />
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 bg-background border rounded-sm shadow-sm min-w-[260px] z-50">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-b last:border-b-0"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (link as any).external ? (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-3 py-4 text-sm font-medium transition-colors flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-4 text-sm font-medium transition-colors flex items-center gap-1 ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
                )}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/ssdc_report.pdf"
            download
            className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Download Report</span>
          </a>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-sm border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 rounded-sm border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
          )}

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-2">
            {navLinks.map((link) => (
              <div key={link.path}>
                {(link as any).external ? (
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-2.5 text-sm font-medium border-l-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label} ↗
                  </a>
                ) : (
                  <>
                    <Link
                      to={link.path}
                      onClick={() => { if (!link.dropdown) setOpen(false); }}
                      className={`block px-2 py-2.5 text-sm font-medium border-l-2 transition-colors ${
                        location.pathname === link.path
                          ? "text-primary border-primary bg-secondary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="block pl-6 py-2 text-xs text-muted-foreground hover:text-foreground border-l-2 border-transparent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <a
              href="/ssdc_report.pdf"
              download
              className="block px-2 py-2.5 text-sm font-medium text-primary border-l-2 border-transparent"
            >
              Download Report
            </a>
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium text-primary border-l-2 border-transparent"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="block w-full text-left px-2 py-2.5 text-sm font-medium text-destructive border-l-2 border-transparent"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-2 py-2.5 text-sm font-medium text-primary border-l-2 border-transparent"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
