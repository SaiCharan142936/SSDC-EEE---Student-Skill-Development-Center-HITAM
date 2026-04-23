import { useState } from "react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonialRajasri from "@/assets/pdf-testimonial-rajasri.jpg";
import testimonialAshish from "@/assets/pdf-testimonial-ashish.jpg";

const testimonials = [
  {
    name: "G. Sai Rajasri",
    img: testimonialRajasri,
    feedback: "It's a great place to grab knowledge with the experience teacher and with proper guide lines. Specially in PLC course we learned how to work on actual industrial projects. Now I am very confident to face the interviews of core companies. Thanks to SSDC.",
  },
  {
    name: "Ashish",
    img: testimonialAshish,
    feedback: "SSDC helped me to learn the new electrical technologies like MATLAB and PLC. It gave me a confidence to do my mini and major projects in my academic curriculum. I personally suggest to all if you want to learn and get your first job in electrical industry, be a student of SSDC training.",
  },
];

const StudentTestimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="container">
        <Reveal>
          <SectionHeader title="Student Testimonials" subtitle="What our students say about SSDC training programs" />
        </Reveal>

        {/* Cards view for desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-3xl">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="border rounded-sm p-5 bg-background h-full flex flex-col">
                <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">"{t.feedback}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">SSDC Student</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Slider for mobile */}
        <div className="md:hidden">
          <Reveal>
            <div className="border rounded-sm p-5 bg-background">
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{testimonials[current].feedback}"</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <img
                  src={testimonials[current].img}
                  alt={testimonials[current].name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{testimonials[current].name}</p>
                  <p className="text-xs text-muted-foreground">SSDC Student</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={prev} className="p-2 border rounded-sm hover:bg-background transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground">{current + 1} / {testimonials.length}</span>
              <button onClick={next} className="p-2 border rounded-sm hover:bg-background transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
