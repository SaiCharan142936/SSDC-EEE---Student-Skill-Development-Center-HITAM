import { useEffect, useState } from "react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import gallerySeminar from "@/assets/gallery-seminar.jpg";
import galleryIndustry from "@/assets/gallery-industry-visit.jpg";
import galleryAwards from "@/assets/gallery-awards.jpg";
import galleryGroup from "@/assets/gallery-group.jpg";

import pdfWheelchairGroup from "@/assets/pdf-wheelchair-group.jpg";
import pdfEbikeGroup from "@/assets/pdf-ebike-group.jpg";
import pdfTricycleGroup from "@/assets/pdf-tricycle-group.jpg";
import pdfSmartHelmet from "@/assets/pdf-smart-helmet.jpg";
import pdfHybridScooter from "@/assets/pdf-hybrid-scooter.jpg";
import pdfAutonomousEv from "@/assets/pdf-autonomous-ev.jpg";
import pdfIotAutomation from "@/assets/pdf-iot-automation.jpg";
import pdfIotWorkshop from "@/assets/pdf-iot-workshop.jpg";
import pdfScadaWorkshop from "@/assets/pdf-scada-workshop.jpg";
import pdfWorkshopCerts from "@/assets/pdf-workshop-certificates.jpg";
import pdfEvTalk from "@/assets/pdf-ev-talk.jpg";
import pdfEapCitd from "@/assets/pdf-eap-citd.jpg";
import pdfPlcCert from "@/assets/pdf-plc-cert.jpg";
import pdfBestPaper from "@/assets/pdf-best-paper.jpg";
import pdfBestProjectTeam from "@/assets/pdf-best-project-team.jpg";
import pdfStudentsGroup from "@/assets/pdf-students-group.jpg";

const albums: Record<string, { src: string; caption: string }[]> = {
  Projects: [
    { src: pdfWheelchairGroup, caption: "Smart Mobility Wheelchair – Team with prototype" },
    { src: pdfEbikeGroup, caption: "Multifunctional Electric Bicycle – Team presentation" },
    { src: pdfTricycleGroup, caption: "Electric Tricycle – Team with working model" },
    { src: pdfSmartHelmet, caption: "Smart Helmet – Modified safety helmet with electronics" },
    { src: pdfHybridScooter, caption: "Hybrid Two-Wheeler – Prototype on street" },
    { src: pdfAutonomousEv, caption: "Autonomous EV – System architecture diagram" },
    { src: pdfIotAutomation, caption: "IoT Load Automation – Circuit with NodeMCU and relay" },
  ],
  Workshops: [
    { src: pdfIotWorkshop, caption: "Two-Day Workshop on Real Time Applications of Sensors with IoT" },
    { src: pdfScadaWorkshop, caption: "Hands-on SCADA Workshop – Students working with equipment" },
    { src: pdfWorkshopCerts, caption: "Workshop Completion – Participants receiving certificates" },
    { src: galleryGroup, caption: "Workshop Completion – Group photo with faculty" },
  ],
  Events: [
    { src: pdfEvTalk, caption: "Technical Talk on Electric Mobility Wheelchair" },
    { src: pdfEapCitd, caption: "Entrepreneurship for Economic Empowerment (EAP) with CITD, Hyderabad" },
    { src: gallerySeminar, caption: "Guest Lecture – Industry expert session on automation" },
    { src: galleryIndustry, caption: "Industry Visit – Manufacturing plant tour" },
    { src: pdfStudentsGroup, caption: "SSDC Students – Group photo" },
  ],
  Awards: [
    { src: pdfPlcCert, caption: "Receiving Top Performer – PLC Certification" },
    { src: pdfBestPaper, caption: "Receiving Best Paper Award – NCRCEST" },
    { src: pdfBestProjectTeam, caption: "Receiving Best Project Team – PLC Certification" },
    { src: galleryAwards, caption: "Award Ceremony – Students receiving certificates" },
  ],
};

const albumKeys = Object.keys(albums);

// Map DB lowercase categories -> static album keys
const categoryMap: Record<string, string> = {
  projects: "Projects",
  workshops: "Workshops",
  events: "Events",
  awards: "Awards",
};

interface DbGalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

const Gallery = () => {
  const [activeAlbum, setActiveAlbum] = useState(albumKeys[0]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [dbItems, setDbItems] = useState<DbGalleryItem[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("gallery_items" as never)
        .select("id, title, image_url, category, created_at")
        .order("created_at", { ascending: false });

      console.log("[Gallery] Fetch response:", { data, error });

      if (!active) return;
      if (error) {
        console.error("[Gallery] Failed to load gallery items:", error.message);
        return;
      }
      setDbItems((data ?? []) as unknown as DbGalleryItem[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Merge static photos with DB-uploaded images for the active album
  const dbPhotosForAlbum = dbItems
    .filter((it) => categoryMap[it.category] === activeAlbum)
    .map((it) => ({ src: it.image_url, caption: it.title }));

  const photos = [...dbPhotosForAlbum, ...albums[activeAlbum]];

  // Counts include DB items per category
  const countFor = (album: string) =>
    albums[album].length +
    dbItems.filter((it) => categoryMap[it.category] === album).length;

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Photos from our projects, workshops, events, industry visits, and student activities."
        bgImage={pdfWheelchairGroup}
      />

      {/* Album tabs */}
      <section className="border-b bg-background">
        <div className="container flex gap-2 py-3 overflow-x-auto">
          {albumKeys.map((album) => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm border transition-colors whitespace-nowrap ${
                activeAlbum === album
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {album} ({countFor(album)})
            </button>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.caption} delay={i * 0.05}>
              <button
                onClick={() => setLightboxImg(photo.src)}
                className="border rounded-sm overflow-hidden bg-background w-full text-left hover:shadow-md transition-shadow"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  width={640}
                  height={512}
                  className="w-full h-52 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{photo.caption}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4" onClick={() => setLightboxImg(null)}>
          <button onClick={() => setLightboxImg(null)} className="absolute top-4 right-4 p-2 bg-background rounded-sm">
            <X className="h-5 w-5" />
          </button>
          <img src={lightboxImg} alt="Gallery full view" className="max-h-[85vh] max-w-full object-contain rounded-sm" />
        </div>
      )}
    </>
  );
};

export default Gallery;
