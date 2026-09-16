import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDisclosure } from "@/hooks/useDisclosure";

export default function DashboardLayout() {
  const { isOpen, close, open } = useDisclosure(false);
  return (
    <div className="min-h-screen bg-pf-bg md:flex">
      <Sidebar isOpen={isOpen} onClose={close} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenSidebar={open} isSidebarOpen={isOpen} />
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      {/* CADRE CENTRAL DE SAISIE */}
    </div>
  );
}
