import React, { useState } from "react";
import "./index.css";
import DoctorsGrid from "./components/doctorsgrid";
import DoctorsPage from "./doctors-page";
import AppointmentsPage from "./appointments/appointments-page";
//  import {BookingModal} from "./components/components/bookingModal";
// import Sidebar from "./components/components/sidebar.js";
// import TopBar from "./components/components/TopBar.js";
// import HeroBanner from "./components/components/hero-banner";
 import SectionHeader from "./components/Sectionheader";
import BookingModal from "./components/bookingModel";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import HeroBanner from "./components/heroBanner";
import { DOCTORS } from "./mock-data";
import { useAuth } from "./auth/auth-context";
import LoginPage from "./auth/login-page";



const Dashboard: React.FC = () => {
 const [activeNav, setActiveNav] = useState("home");
  const [filters, setFilters] = useState({ type: "All types", city: "All Cities", age: "35+", gender: "All" });
  const [visibleDocs, setVisibleDocs] = useState(DOCTORS);
  const [bookingDoc, setBookingDoc] = useState(null);
 
  const handleFilterChange = (key: string, value: string) => setFilters((f) => ({ ...f, [key]: value }));
 
  const handleSearch = () => {
    const filtered = DOCTORS.filter((d) => {
      if (filters.city !== "All Cities" && !d.location.includes(filters.city)) return false;
      return true;
    });
    setVisibleDocs(filtered.length ? filtered : DOCTORS);
  };
 
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>
 
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
 
        <main className={`ml-56 min-w-0 flex-1 p-8 ${activeNav === "appointments" ? "" : "max-w-6xl"}`}>
          {activeNav === "doctors" ? (
            <DoctorsPage />
          ) : activeNav === "appointments" ? (
            <AppointmentsPage />
          ) : (
            <>
              <TopBar />
              <HeroBanner filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />
              <SectionHeader
                title="Best for you"
                count={visibleDocs.length}
                onSeeAll={() => setVisibleDocs(DOCTORS)}
              />
              <DoctorsGrid doctors={visibleDocs} onBook={setBookingDoc} />
            </>
          )}
        </main>
      </div>
 
      <BookingModal doctor={bookingDoc} onClose={() => setBookingDoc(null)} />
    </>
  );
};

/** Shows the login page until someone is signed in. */
const App: React.FC = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
};

export default App;
