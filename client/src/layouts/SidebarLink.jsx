import { NavLink } from "react-router-dom";

// Un seul lien : son style actif/inactif, rien d'autre.
// NavLink pose déjà aria-current="page" tout seul sur le lien actif.
export default function SidebarLink({
  to,
  end,
  icon: Icon,
  label,
  onNavigate,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-pf-teal-dim text-pf-teal-dark"
            : "text-pf-ink-dim hover:bg-pf-surface-alt hover:text-pf-ink"
        }`
      }
    >
      <Icon size={18} aria-hidden="true" />
      {label}
    </NavLink>
  );
}
