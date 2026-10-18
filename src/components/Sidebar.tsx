import { useState } from "react";
import { NAV_ITEMS } from "../mock-data";
import { useAuth } from "../auth/auth-context";
import { LogoutDialog } from "../auth/logout-dialog";

// export default function Sidebar({ activeNav, setActiveNav }) {
//   return (
//     <aside className="w-56 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col p-5 z-20">
//       {/* Logo */}
//       <div className="flex items-center gap-2.5 mb-10">
//         <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
//           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
//           </svg>
//         </div>
//         <span className="font-extrabold text-indigo-600 text-lg tracking-tight">MindBridge</span>
//       </div>
 
//       {/* Nav */}
//       <nav className="flex flex-col gap-1 flex-1">
//         {NAV_ITEMS.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveNav(item.id)}
//             className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full
//               ${activeNav === item.id
//                 ? "bg-indigo-50 text-indigo-600 font-semibold"
//                 : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
//           >
//             <span>{item.icon}</span>
//             {item.label}
//           </button>
//         ))}
//       </nav>
 
//       {/* Logout */}
//       <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all duration-150 w-full text-left">
//         <span>🚪</span> Logout
//       </button>
//     </aside>
//   );
// }

type SidebarProps = {
  activeNav: string;
  setActiveNav: (nav: string) => void;
};

export default function Sidebar({
  activeNav,
  setActiveNav,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <aside className="w-56 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col p-5 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <span className="font-extrabold text-indigo-600 text-lg tracking-tight">MindBridge</span>
      </div>
 
      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item : any) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full
              ${activeNav === item.id
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
 
      {/* Signed-in user */}
      {user && (
        <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
            <p className="truncate text-[11px] text-slate-400">{user.role}</p>
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all duration-150 w-full text-left">
        <span>🚪</span> Logout
      </button>
      <LogoutDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={signOut} />
    </aside>
  );
}