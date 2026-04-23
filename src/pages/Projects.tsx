import { useState, useEffect, useMemo } from "react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "lucide-react";
import ProjectDetailModal, { type ProjectDetail } from "@/components/ProjectDetailModal";
import { projects as staticProjects, categories } from "@/data/projects";
import wheelchairImg from "@/assets/project-wheelchair.jpg";
import { supabase } from "@/integrations/supabase/client";
import evbike from "@/assets/project-ev-bike.jpg";

interface DbProject {
  id: string;
  title: string;
  description: string | null;
  full_description: string | null;
  category: string;
  image_url: string | null;
  created_at: string;
}

const Projects = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("project" as never)
        .select("id, title, description, full_description, category, image_url, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        // Table may not exist yet — silently keep static projects
        console.warn("[Projects] DB fetch skipped:", error.message);
        return;
      }
      if (mounted) setDbProjects((data ?? []) as unknown as DbProject[]);
    };

    void load();

    const channel = supabase
      .channel("public-project-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project" },
        () => void load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  // Map DB rows into the ProjectDetail shape — preserve static cards untouched
  const dbAsProjects: ProjectDetail[] = useMemo(
    () =>
      dbProjects.map((p) => ({
        title: p.title,
        description: p.description ?? "",
        solution: p.full_description ?? "",
        features: [],
        technologies: [],
        applications: [],
        img: p.image_url ?? wheelchairImg,
        galleryImages: [],
        cat: p.category,
      })),
    [dbProjects],
  );

  // Show static projects FIRST, then dynamic appended below
  const allProjects = useMemo(
    () => [...staticProjects, ...dbAsProjects],
    [dbAsProjects],
  );

  const filtered =
    activeCat === "All"
      ? allProjects
      : allProjects.filter((p) => p.cat === activeCat);

  return (
    <>
      <PageHero
        title="Projects"
        subtitle="Innovative engineering projects developed by our students focused on real-world applications in automation and smart technologies."
        bgImage={wheelchairImg}
      />

      <section className="border-b bg-background">
        <div className="container flex gap-2 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm border transition-colors ${
                activeCat === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={i * 0.06}>
              <div className="border rounded-sm overflow-hidden bg-background h-full flex flex-col">
                <div className="relative">
                  <img src={p.img} alt={p.title} loading="lazy" width={640} height={512} className="w-full h-48 object-cover" />
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm">{p.cat}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">{p.description}</p>
                  <button
                    onClick={() => setSelectedProject(p)}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary hover:underline"
                  >
                    View Details <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Virtual Labs CTA */}
      <Section alt>
        <Reveal>
          <div className="border rounded-sm bg-background p-8 flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-foreground">Virtual Labs</h2>
            <p className="text-sm text-muted-foreground mt-2 mb-5 leading-relaxed">
              Access India's official Virtual Labs platform for Electrical Engineering — hands-on experiments hosted by IITs and premier institutes.
            </p>
            <a
              href="https://www.vlab.co.in/broad-area-electrical-engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Explore Virtual Labs <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </Section>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default Projects;
