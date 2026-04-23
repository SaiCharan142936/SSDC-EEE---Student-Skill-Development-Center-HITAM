import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15).regex(/^\d+$/, "Phone must contain only digits"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be under 2000 characters"),
});

// EmailJS configuration
// Template variables expected: {{name}}, {{email}}, {{phone}}, {{message}}, {{to_email}}
const EMAILJS_SERVICE_ID = "service_3ve2byl";
const EMAILJS_TEMPLATE_ID = "template_38ja2ee";
const EMAILJS_PUBLIC_KEY = "uobuscfVow1xtiJ-Z";
const RECIPIENT = "ssdceee.hitam@gmail.com";

const isConfigured = true;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!isConfigured) {
      toast.error("Email service is not configured yet. Please add your EmailJS keys.");
      return;
    }

    setSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          message: result.data.message,
          to_email: RECIPIENT,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      formRef.current?.reset();
      toast.success("Message sent successfully! We'll get back to you soon.");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with SSDC – EEE Department"
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3 items-start">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Address</div>
                    <div className="text-muted-foreground">
                      Department of EEE, HITAM<br />
                      Hyderabad Institute of Technology and Management<br />
                      Gowdavelly, Medchal, Hyderabad<br />
                      Telangana 501401, India
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <div className="text-muted-foreground">+91 90303 39001</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <div className="text-muted-foreground">{RECIPIENT}</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Office Hours</div>
                    <div className="text-muted-foreground">Monday – Saturday, 9:00 AM – 4:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form ref={formRef} className="border rounded-sm p-6 space-y-4" onSubmit={handleSubmit}>
              <h3 className="text-base font-bold text-foreground">Send a Message</h3>

              {!isConfigured && (
                <div className="flex items-start gap-2 bg-secondary border text-foreground rounded-sm p-3 text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <span className="text-muted-foreground">
                    EmailJS is not yet configured. Add <code className="font-mono text-foreground">VITE_EMAILJS_SERVICE_ID</code>,
                    <code className="font-mono text-foreground"> VITE_EMAILJS_TEMPLATE_ID</code> and
                    <code className="font-mono text-foreground"> VITE_EMAILJS_PUBLIC_KEY</code> in your project to enable sending.
                  </span>
                </div>
              )}

              {submitted && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-sm p-3 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Your message has been sent successfully!
                </div>
              )}

              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full border rounded-sm bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className="w-full border rounded-sm bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  className="w-full border rounded-sm bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <textarea
                  rows={4}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message *"
                  className="w-full border rounded-sm bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              <div className="border-t pt-4 mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Office Hours: 9:00 AM – 4:00 PM (Mon–Sat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>+91 90303 39001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{RECIPIENT}</span>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  );
};

export default Contact;
