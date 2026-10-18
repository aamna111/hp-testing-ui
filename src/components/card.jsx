import { useState } from "react";
import Avatar from "./avatar";
import RatingBadge from "./ratingBadge";
import StatusDot from "./statusDot";

function DoctorCard({ doctor, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 cursor-pointer
        ${hovered ? "border-indigo-400 shadow-lg shadow-indigo-100 -translate-y-1" : "border-gray-100 shadow-sm"}`}
    >
      {/* Card Top */}
      <div className="flex items-start gap-3">
        <Avatar initials={doctor.initials} gradient={doctor.gradient} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{doctor.specialty}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <RatingBadge rating={doctor.rating} />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {doctor.location}
            </span>
          </div>
        </div>
      </div>
 
      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span><span className="font-semibold text-gray-800">{doctor.exp} yrs</span> of exp.</span>
        <span><span className="font-semibold text-gray-800">{doctor.consults}</span> consultations</span>
      </div>
 
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {doctor.tags.map((tag) => (
          <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium">
            {tag}
          </span>
        ))}
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-full text-xs font-medium">
          +{doctor.extraTags}
        </span>
      </div>
 
      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <p className="font-extrabold text-gray-900 text-lg">${doctor.price}<span className="text-xs font-normal text-gray-400">/h</span></p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
            <StatusDot online={doctor.online} />
            {doctor.status}
          </div>
        </div>
        <button
          onClick={() => onBook(doctor)}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 whitespace-nowrap"
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;