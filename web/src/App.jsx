import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Home from "./pages/Home.jsx";
import MeusPets from "./pages/MeusPets.jsx";
import FormPet from "./pages/FormPet.jsx";
import MedicamentosVacinas from "./pages/MedicamentosVacinas.jsx";
import BanhoTosa from "./pages/BanhoTosa.jsx";
import Perfil from "./pages/Perfil.jsx";

export default function App() {
  const { carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-marca-500">
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meus-pets"
        element={
          <ProtectedRoute>
            <MeusPets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/novo"
        element={
          <ProtectedRoute>
            <FormPet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:id/editar"
        element={
          <ProtectedRoute>
            <FormPet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicamentos-vacinas"
        element={
          <ProtectedRoute>
            <MedicamentosVacinas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banho-tosa"
        element={
          <ProtectedRoute>
            <BanhoTosa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
