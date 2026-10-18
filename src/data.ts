import type { Doctor } from "./types";

const AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813566-78a8717c181f?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
];

export const SEED_DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Mitchell", specialty: "Cardiology", department: "Cardiac Care", email: "sarah.mitchell@hospital.com", phone: "+1 555 0101", experience: 12, consultationFee: 800, shift: "Morning (08:00 - 16:00)", status: "Active", avatar: AVATARS[0] },
  { id: "d2", name: "Dr. James Carter", specialty: "Neurology", department: "Neuro Sciences", email: "james.carter@hospital.com", phone: "+1 555 0102", experience: 9, consultationFee: 700, shift: "Evening (14:00 - 22:00)", status: "Active", avatar: AVATARS[1] },
  { id: "d3", name: "Dr. Priya Sharma", specialty: "Pediatrics", department: "Child Health", email: "priya.sharma@hospital.com", phone: "+1 555 0103", experience: 7, consultationFee: 500, shift: "Morning (08:00 - 16:00)", status: "On Leave", avatar: AVATARS[2] },
  { id: "d4", name: "Dr. Daniel Brooks", specialty: "Orthopedics", department: "Bone & Joint", email: "daniel.brooks@hospital.com", phone: "+1 555 0104", experience: 15, consultationFee: 600, shift: "On Call 24h", status: "Active", avatar: AVATARS[3] },
  { id: "d5", name: "Dr. Elena Rossi", specialty: "Dermatology", department: "Skin Care", email: "elena.rossi@hospital.com", phone: "+1 555 0105", experience: 5, consultationFee: 400, shift: "Night Duty (22:00 - 06:00)", status: "Inactive", avatar: AVATARS[0] },
];
