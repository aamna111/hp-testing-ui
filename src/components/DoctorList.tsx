import React, { useState } from "react";
import { Doctor } from "../types";

interface Props {
  doctors: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
}

const specialColors: Record<string, string> = {
  Cardiology: "#e74c3c",
  Neurology: "#9b59b6",
  Orthopedics: "#3498db",
  Pediatrics: "#2ecc71",
  Oncology: "#e67e22",
  Dermatology: "#f39c12",
  Psychiatry: "#1abc9c",
  Radiology: "#34495e",
  "General Medicine": "#27ae60",
};

const DoctorList: React.FC<Props> = ({ doctors, loading, onEdit, onDelete }) => {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="loading-pulse" />
          <div className="loading-pulse" />
          <div className="loading-pulse" />
          <div className="loading-pulse" />
          <div className="loading-pulse" />
        </div>
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="card empty-state">
        <div className="empty-state__icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3 className="empty-state__title">No doctors found</h3>
        <p className="empty-state__text">Add a new doctor or adjust your search filters</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2 className="card__title">Doctors</h2>
        <span className="badge">{doctors.length}</span>
      </div>

      <div className="table-wrapper">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Contact</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="doctor-row">
                <td>
                  <div className="doctor-info">
                    <div
                      className="doctor-avatar"
                      style={{ background: `${specialColors[doctor.specialization] || "#64748b"}22`, color: specialColors[doctor.specialization] || "#64748b" }}
                    >
                      {doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="doctor-name">{doctor.name}</div>
                      <div className="doctor-id">ID #{doctor.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className="spec-badge"
                    style={{ background: `${specialColors[doctor.specialization] || "#64748b"}18`, color: specialColors[doctor.specialization] || "#64748b", borderColor: `${specialColors[doctor.specialization] || "#64748b"}40` }}
                  >
                    {doctor.specialization}
                  </span>
                </td>
                <td>
                  <div className="contact-info">
                    <span className="contact-email">{doctor.email}</span>
                    <span className="contact-phone">{doctor.phone}</span>
                  </div>
                </td>
                <td>
                  <div className="experience">
                    <span className="experience__years">{doctor.experience}</span>
                    <span className="experience__label">yrs</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-badge--${doctor.available ? "available" : "unavailable"}`}>
                    <span className="status-dot" />
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn--icon btn--edit"
                      onClick={() => onEdit(doctor)}
                      title="Edit doctor"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      className={`btn btn--icon ${confirmId === doctor.id ? "btn--confirm" : "btn--delete"}`}
                      onClick={() => handleDelete(doctor.id)}
                      title={confirmId === doctor.id ? "Click again to confirm" : "Delete doctor"}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      {confirmId === doctor.id ? "Confirm?" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorList;
