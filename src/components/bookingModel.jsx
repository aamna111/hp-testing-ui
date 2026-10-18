import Avatar from "./avatar";
import RatingBadge from "./ratingBadge";
import StatusDot from "./statusDot";

function BookingModal({ doctor, onClose }) {
  if (!doctor) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-5">
          <Avatar initials={doctor.initials} gradient={doctor.gradient} size="lg" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">{doctor.name}</h3>
            <p className="text-sm text-gray-400">{doctor.specialty}</p>
            <RatingBadge rating={doctor.rating} />
          </div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 mb-5">
          <p className="text-sm text-indigo-700 font-medium">Session rate: <span className="font-extrabold">${doctor.price}/h</span></p>
          <div className="flex items-center gap-1.5 mt-1">
            <StatusDot online={doctor.online} />
            <span className="text-xs text-gray-500">{doctor.status}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
