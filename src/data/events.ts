import pdfIotWorkshop from "@/assets/pdf-iot-workshop.jpg";
import pdfScadaWorkshop from "@/assets/pdf-scada-workshop.jpg";
import pdfEvTalk from "@/assets/pdf-ev-talk.jpg";
import pdfEapCitd from "@/assets/pdf-eap-citd.jpg";
import pdfWorkshopPoster from "@/assets/pdf-workshop-poster.jpg";
import eventIndustryVisit from "@/assets/event-industry-visit.jpg";
import eventPlcScada from "@/assets/event-plc-scada.jpg";
import eventAutomation from "@/assets/event-automation.jpg";

export type EventType = "SSDC" | "External";

export interface SsdcEvent {
  id: string;
  title: string;
  date: string;          // ISO yyyy-mm-dd (used for sorting)
  displayDate: string;   // Human-readable
  image: string;
  type: EventType;
  caption?: string;
}

// All entries are SSDC events. Add new SSDC events here — they auto-appear
// on the Events page and on the Home preview.
export const events: SsdcEvent[] = [
  {
    id: "plc-scada-2026",
    title: "Training Program on Industrial Automation with PLC & SCADA",
    date: "2026-03-04",
    displayDate: "04 March 2026",
    image: eventPlcScada,
    type: "SSDC",
  },
  {
    id: "eap-citd-2025",
    title: "Lecture on Entrepreneurship for Economic Empowerment (EAP) with CITD",
    date: "2025-10-11",
    displayDate: "11 October 2025",
    image: pdfEapCitd,
    type: "SSDC",
  },
  {
    id: "industry-visit-olectra-2024",
    title: "Industry Visit to Olectra Greentech Ltd – EV Manufacturing Unit",
    date: "2024-08-02",
    displayDate: "02 August 2024",
    image: eventIndustryVisit,
    type: "SSDC",
  },
  {
    id: "scada-workshop-2024",
    title: "Two-Day Workshop on Optimizing Industrial Process: Hands-on SCADA",
    date: "2024-05-31",
    displayDate: "31 May – 01 June 2024",
    image: pdfScadaWorkshop,
    type: "SSDC",
  },
  {
    id: "iot-workshop-2024",
    title: "Workshop on IoT: Build Your Own Smart World with Arduino",
    date: "2024-01-10",
    displayDate: "10 January 2024",
    image: pdfIotWorkshop,
    type: "SSDC",
  },
  {
    id: "automation-talk-2024",
    title: "Guest Lecture on Industrial Automation and Career Opportunities",
    date: "2024-01-03",
    displayDate: "03 January 2024",
    image: eventAutomation,
    type: "SSDC",
  },
  {
    id: "ev-talk-2021",
    title: "Electric Vehicles – Your Opportunity to Grow",
    date: "2021-06-16",
    displayDate: "16 June 2021",
    image: pdfEvTalk,
    type: "SSDC",
  },
  {
    id: "automation-poster-2020",
    title: "Industrial Automation with PLC – Workshop",
    date: "2020-02-13",
    displayDate: "13 – 15 February 2020",
    image: pdfWorkshopPoster,
    type: "SSDC",
  },
];

export const ssdcEvents = (): SsdcEvent[] =>
  events
    .filter((e) => e.type === "SSDC")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
