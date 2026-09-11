import { Outlet } from "react-router-dom";


export default function DashboardLayout() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-pf-bg select-none relative">

      {/* CADRE CENTRAL DE SAISIE */}
      <div className="w-full max-w-[420px] bg-pf-surface border border-pf-border rounded-2xl p-8 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}
