import React, { useState, useEffect } from "react";
import { Doctor, DoctorFormData } from "../types";

interface Props {
  editingDoctor: Doctor | null;
  onSubmit: (data: DoctorFormData) => Promise<boolean>;
  onCancel: () => void;
}

const SPECIALIZATIONS = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
  "Oncology", "Dermatology", "Psychiatry", "Radiology", "General Medicine",
];

const EMPTY_FORM: DoctorFormData = {
  name: "", specialization: "", email: "", phone: "", experience: 0, available: true,
};

interface Errors {
  name?: string;
  specialization?: string;
  email?: string;
  phone?: string;
  experience?: string;
}

const DoctorForm: React.FC<Props> = ({ editingDoctor, onSubmit, onCancel }) => {
  const [form, setForm] = useState<DoctorFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingDoctor) {
      const { id, ...rest } = editingDoctor;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingDoctor]);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!form.specialization) newErrors.specialization = "Specialization is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) newErrors.phone = "Invalid phone number";
    if (form.experience < 0) newErrors.experience = "Experience cannot be negative";
    else if (form.experience > 60) newErrors.experience = "Experience seems too high";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked
               : name === "experience" ? Number(value)
               : value,
    }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const success = await onSubmit(form);
    setSubmitting(false);
    if (success && !editingDoctor) setForm(EMPTY_FORM);
  };

  return (
    <div className="card form-card">
      <div className="card__header">
        <div className="card__header-icon">
          {editingDoctor ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          )}
        </div>
        <h2 className="card__title">{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="doctor-form" noValidate>
        <div className="form-grid">
          <div className={`form-group ${errors.name ? "form-group--error" : ""}`}>
            <label className="form-label">Full Name *</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Dr. John Smith" className="form-input"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.specialization ? "form-group--error" : ""}`}>
            <label className="form-label">Specialization *</label>
            <select name="specialization" value={form.specialization} onChange={handleChange} className="form-input form-select">
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.specialization && <span className="form-error">{errors.specialization}</span>}
          </div>

          <div className={`form-group ${errors.email ? "form-group--error" : ""}`}>
            <label className="form-label">Email Address *</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="doctor@hospital.com" className="form-input"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.phone ? "form-group--error" : ""}`}>
            <label className="form-label">Phone Number *</label>
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="+1 234 567 8900" className="form-input"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className={`form-group ${errors.experience ? "form-group--error" : ""}`}>
            <label className="form-label">Years of Experience</label>
            <input
              type="number" name="experience" value={form.experience} onChange={handleChange}
              min="0" max="60" className="form-input"
            />
            {errors.experience && <span className="form-error">{errors.experience}</span>}
          </div>

          <div className="form-group form-group--checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox" name="available"
                checked={form.available}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">Available for Appointments</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
            {submitting ? <><span className="spinner" /> Saving...</> : editingDoctor ? "Update Doctor" : "Add Doctor"}
          </button>
          {editingDoctor && (
            <button type="button" className="btn btn--ghost btn--lg" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
