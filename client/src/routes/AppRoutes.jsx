import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import AuthLayout from "@/features/auth/layouts/AuthLayout";
import LoginView from "@/features/auth/views/LoginView";
import RegisterView from "@/features/auth/views/RegisterView";

import TransferView from "@/features/wallet/views/TransferView";

import MainLayout from "@/layouts/MainLayout";
import { WalletProvider } from "@/features/wallet/context/WalletProvider";
import DashboardHome from "@/features/wallet/views/DashboardHome";

// Seule responsabilité : décrire l'arbre de routes. La logique de garde
// vit dans PublicRoute/ProtectedRoute, pas ici.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <WalletProvider>
              <MainLayout />
            </WalletProvider>
        }>
          <Route
            index
            element={
              <DashboardHome />
            }
          />
          <Route
            path="transfer"
            element={<TransferView/>}
          />
          <Route
            path="bill"
            element={
              <div className="text-sm text-pf-ink-dim">
                Module Facture (À venir)
              </div>
            }
          />
          <Route
            path="recharge"
            element={
              <div className="text-sm text-pf-ink-dim">
                Module Recharge (À venir)
              </div>
            }
          />
          <Route
            path="withdraw"
            element={
              <div className="text-sm text-pf-ink-dim">
                Module Retrait (À venir)
              </div>
            }
          />
          <Route
            path="history"
            element={
              <div className="text-sm text-pf-ink-dim">
                Module Historique (À venir)
              </div>
            }
          />
          <Route
            path="switch"
            element={
              <div className="text-sm text-pf-ink-dim">
                Console Kessa Switch (À venir)
              </div>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
