import DoctorCard from "./card";

function DoctorsGrid({ doctors, onBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doc, i) => (
        <div
          key={doc.id}
          style={{ animation: `fadeUp 0.4s ease both ${i * 0.07}s` }}
        >
          <DoctorCard doctor={doc} onBook={onBook} />
        </div>
      ))}
    </div>
  );
}

export default DoctorsGrid;