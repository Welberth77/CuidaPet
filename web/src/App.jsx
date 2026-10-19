import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { TelaCarregando } from "./components/ui/Spinner.jsx";

// Carregamento sob demanda (code-splitting) de cada tela
const Root = lazy(() => import("./pages/Root.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.jsx"));
const EsqueciSenha = lazy(() => import("./pages/EsqueciSenha.jsx"));
const RedefinirSenha = lazy(() => import("./pages/RedefinirSenha.jsx"));
const Confirmado = lazy(() => import("./pages/Confirmado.jsx"));
const VerifiqueEmail = lazy(() => import("./pages/VerifiqueEmail.jsx"));
const MeusPets = lazy(() => import("./pages/MeusPets.jsx"));
const FormPet = lazy(() => import("./pages/FormPet.jsx"));
const CarteiraPet = lazy(() => import("./pages/CarteiraPet.jsx"));
const MedicamentosVacinas = lazy(() => import("./pages/MedicamentosVacinas.jsx"));
const BanhoTosa = lazy(() => import("./pages/BanhoTosa.jsx"));
const Despesas = lazy(() => import("./pages/Despesas.jsx"));
const Perfil = lazy(() => import("./pages/Perfil.jsx"));
const Notificacoes = lazy(() => import("./pages/Notificacoes.jsx"));
const Relatorios = lazy(() => import("./pages/Relatorios.jsx"));
const NaoEncontrado = lazy(() => import("./pages/NaoEncontrado.jsx"));
const Termos = lazy(() => import("./pages/Termos.jsx"));
const Privacidade = lazy(() => import("./pages/Privacidade.jsx"));

function Carregando() {
  return <div className="flex min-h-screen items-center justify-center"><TelaCarregando /></div>;
}

export default function App() {
  const { carregando } = useAuth();
  if (carregando) return <Carregando />;

  const protegida = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

  return (
    <>
    <ScrollToTop />
    <Suspense fallback={<Carregando />}>
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
        <Route path="/pets/:id/carteira" element={protegida(<CarteiraPet />)} />
        <Route path="/medicamentos-vacinas" element={protegida(<MedicamentosVacinas />)} />
        <Route path="/banho-tosa" element={protegida(<BanhoTosa />)} />
        <Route path="/despesas" element={protegida(<Despesas />)} />
        <Route path="/perfil" element={protegida(<Perfil />)} />
        <Route path="/notificacoes" element={protegida(<Notificacoes />)} />
        <Route path="/relatorios" element={<ProtectedRoute admin>{<Relatorios />}</ProtectedRoute>} />

        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />

        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </Suspense>
    </>
  );
}
