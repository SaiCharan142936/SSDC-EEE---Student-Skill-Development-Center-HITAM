import { Mail, Phone } from "lucide-react";

const TopStrip = () => (
  <div className="bg-secondary border-b border-border text-xs">
    <div className="container flex flex-wrap items-center justify-between gap-2 py-1.5">
      <div>
        <div className="font-semibold text-foreground">Hyderabad Institute of Technology and Management</div>
        <div className="text-muted-foreground">Department of Electrical and Electronics Engineering</div>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground">
        <span className="hidden sm:flex items-center gap-1"><Mail className="h-3 w-3" /> ssdceee.hitam@gmail.com</span>
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +91 90303 39001</span>
      </div>
    </div>
  </div>
);

export default TopStrip;
