import React from "react";
import { Toast } from "../types";

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const ToastContainer: React.FC<Props> = ({ toasts, onRemove }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <div key={toast.id} className={`toast toast--${toast.type}`}>
        <span className="toast__icon">{icons[toast.type]}</span>
        <span className="toast__message">{toast.message}</span>
        <button className="toast__close" onClick={() => onRemove(toast.id)}>✕</button>
      </div>
    ))}
  </div>
);

export default ToastContainer;
