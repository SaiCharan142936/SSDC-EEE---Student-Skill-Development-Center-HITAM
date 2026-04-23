import TopStrip from "@/components/TopStrip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingEventsMarquee from "@/components/UpcomingEventsMarquee";
import { Outlet } from "react-router-dom";
import bannerImg from "@/assets/hitam-banner.png";

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <div className="w-full bg-primary">
      <img
        src={bannerImg}
        alt="Hyderabad Institute of Technology and Management - HITAM Banner"
        className="w-full h-auto object-cover"
      />
    </div>
    <TopStrip />
    <Navbar />
    {/* Upcoming Events Marquee — appears on every page below the navbar */}
    <UpcomingEventsMarquee />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
