import { X } from "lucide-react";
import { useState } from "react";

export interface ProjectDetail {
  title: string;
  description: string;
  solution: string;
  features: string[];
  technologies: string[];
  applications: string[];
  img: string;
  galleryImages?: string[];
  cat: string;
}

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  const [activeImg, setActiveImg] = useState(0);

  if (!project) return null;

  const allImages = [project.img, ...(project.galleryImages || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/50 overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-background border rounded-sm max-w-3xl w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2">{project.cat}</span>
            <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-sm transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Image Gallery */}
        <div>
          <img src={allImages[activeImg]} alt={project.title} className="w-full h-56 object-cover" />
          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 border-b overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 h-14 w-20 rounded-sm overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt={`${project.title} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">Problem Description & Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {project.solution && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Solution / Working</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
            </div>
          )}

          {project.features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Features</h3>
              <ul className="space-y-1.5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.technologies.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, i) => (
                  <span key={i} className="bg-secondary text-foreground text-xs px-3 py-1 rounded-sm border">{t}</span>
                ))}
              </div>
            </div>
          )}

          {project.applications.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Applications / Use Cases</h3>
              <ul className="space-y-1.5">
                {project.applications.map((a, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-5">
          <button onClick={onClose} className="rounded-sm bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
