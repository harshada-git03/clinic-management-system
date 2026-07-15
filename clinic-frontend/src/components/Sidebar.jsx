import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role, navItems, active, onNavClick }) {
  const { user, logout } = useAuth();
  const initials = user?.fullName?.split(" ").map((w) => w[0]).slice(0, 2).join("") || "?";

  return (
    <div className="bg-ink text-paper flex md:flex-col items-center md:items-stretch overflow-x-auto md:overflow-visible px-3.5 md:px-4 py-3 md:py-6.5 gap-1">
      <div className="hidden md:flex items-center gap-2 pb-6 mb-4.5 border-b border-[#2C3B33] px-2">
        <div className="w-2 h-2 rounded-full bg-clay" />
        <span className="text-sm tracking-wider uppercase font-medium">Smart Clinic</span>
      </div>
      <div className="hidden md:block text-[11px] uppercase tracking-wide text-clay px-2 mb-3.5">{role}</div>
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavClick(item.key)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm whitespace-nowrap ${
            active === item.key ? "bg-[#2C3B33] text-white" : "text-[#C9D0C6] hover:bg-[#26332C]"
          }`}
        >
          {item.label}
        </button>
      ))}
      <div className="hidden md:flex mt-auto pt-3 border-t border-[#2C3B33] px-2 items-center gap-2.5">
        <div className="w-7.5 h-7.5 rounded-full bg-moss text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
          {initials}
        </div>
        <div className="text-xs">
          <div>{user?.fullName}</div>
          <button onClick={logout} className="text-[#9DA89C] hover:text-clay">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}