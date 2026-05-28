const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tour", label: "Tours" },
  { id: "destination", label: "Destinations" },
  { id: "promotion", label: "Promotions" },
  { id: "user", label: "Users" },
  { id: "booking", label: "Bookings" },
  { id: "contact-message", label: "Messages" },
  { id: "review", label: "Reviews" },
  { id: "tour-type", label: "Tour Types" },
];

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 px-4 py-6 text-white">
      <div className="px-3 text-xl font-black">ViVuGo Admin</div>
      <nav className="mt-8 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveMenu(item.id)}
            className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
              activeMenu === item.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
