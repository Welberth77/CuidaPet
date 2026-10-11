import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { TelaCarregando } from "./components/ui/Spinner.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import Confirmado from "./pages/Confirmado.jsx";
import VerifiqueEmail from "./pages/VerifiqueEmail.jsx";
import Root from "./pages/Root.jsx";
import Home from "./pages/Home.jsx";
import MeusPets from "./pages/MeusPets.jsx";
import FormPet from "./pages/FormPet.jsx";
import MedicamentosVacinas from "./pages/MedicamentosVacinas.jsx";
import BanhoTosa from "./pages/BanhoTosa.jsx";
import Perfil from "./pages/Perfil.jsx";
import Notificacoes from "./pages/Notificacoes.jsx";
import NaoEncontrado from "./pages/NaoEncontrado.jsx";

export default function App() {
  const { carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <TelaCarregando />
      </div>
    );
  }

  const protegida = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/confirmado" element={<Confirmado />} />
      <Route path="/verifique-email" element={<VerifiqueEmail />} />

      <Route path="/" element={<Root />} />
      <Route path="/meus-pets" element={protegida(<MeusPets />)} />
      <Route path="/pets/novo" element={protegida(<FormPet />)} />
      <Route path="/pets/:id/editar" element={protegida(<FormPet />)} />
      <Route path="/medicamentos-vacinas" element={protegida(<MedicamentosVacinas />)} />
      <Route path="/banho-tosa" element={protegida(<BanhoTosa />)} />
      <Route path="/perfil" element={protegida(<Perfil />)} />
      <Route path="/notificacoes" element={protegida(<Notificacoes />)} />

      <Route path="*" element={<NaoEncontrado />} />
    </Routes>
  );
}
