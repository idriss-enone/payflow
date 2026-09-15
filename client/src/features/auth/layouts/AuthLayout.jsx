import { Outlet } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-5 bg-pf-bg select-none relative">
      <LanguageSwitcher />

      {/* CADRE CENTRAL DE SAISIE */}
      <main className="w-full max-w-[420px] bg-pf-surface border border-pf-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <Outlet />
      </main>
    </div>
  );
}
