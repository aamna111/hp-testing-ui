export const DOCTORS = [
  {
    id: 1, name: "Dr. Sam Wallfolk", specialty: "Clinical psychologist",
    rating: 5.0, location: "New York, USA", exp: 10, consults: "1000+",
    tags: ["Abuse", "Depression", "PTSD"], extraTags: 3,
    price: 80, status: "Online/Offline", online: true, initials: "SW",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: 2, name: "Dr. Ben Affleck", specialty: "Military psychologist",
    rating: 4.7, location: "Los Angeles, USA", exp: 4, consults: "100+",
    tags: ["Abuse", "Food", "Mental Health"], extraTags: 2,
    price: 50, status: "Online", online: true, initials: "BA",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 3, name: "Dr. Sarah Legend", specialty: "Child psychologist",
    rating: 5.0, location: "Chicago, USA", exp: 20, consults: "2500+",
    tags: ["Abuse", "Parenting", "Food"], extraTags: 4,
    price: 120, status: "Offline", online: false, initials: "SL",
    gradient: "from-sky-400 to-blue-600",
  },
  {
    id: 4, name: "Dr. Angela Braun", specialty: "Forensic psychologist",
    rating: 3.0, location: "Philadelphia, USA", exp: 2, consults: "100+",
    tags: ["Anxieties", "Depression"], extraTags: 5,
    price: 40, status: "Offline", online: false, initials: "AB",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: 5, name: "Dr. Dilan McCarter", specialty: "Industrial-Organizational",
    rating: 5.0, location: "San Diego, USA", exp: 8, consults: "500+",
    tags: ["Job and Career", "Stress"], extraTags: 3,
    price: 75, status: "Online/Offline", online: true, initials: "DM",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 6, name: "Dr. Evan Peters", specialty: "Clinical psychologist",
    rating: 4.1, location: "Houston, USA", exp: 3, consults: "100+",
    tags: ["Addictions", "Violence"], extraTags: 2,
    price: 50, status: "Online/Offline", online: true, initials: "EP",
    gradient: "from-fuchsia-400 to-purple-600",
  },
];
 
export const NAV_ITEMS : any[]  = [
  // { icon: "🏠", label: "Home", id: "home" },
  { icon: "🔍", label: "Find Specialist", id: "find" },
  { icon: "🩺", label: "Doctors", id: "doctors" },
  { icon: "📅", label: "Appointments", id: "appointments" },
  // { icon: "💬", label: "Messages", id: "messages" },
  // { icon: "👤", label: "Profile", id: "profile" },
];
 
