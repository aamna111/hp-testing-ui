import { useState } from "react";
import { useAuth } from "../auth/auth-context";
function TopBar() {
  const [hasNotif] = useState(true);
  const { user } = useAuth();
  const firstName = user ? user.name.split(" ")[0] : "";
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome, <span className="text-indigo-500">{firstName}!</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" />
            <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
          </svg>
          {hasNotif && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
          {firstName.charAt(0)}
        </div>
      </div>
    </div>
  );
}

export default TopBar;