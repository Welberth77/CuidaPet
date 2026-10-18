import { Component } from "react";
import Logo from "./art/Logo.jsx";
import PetLost from "./art/PetLost.jsx";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: false };
  }

  static getDerivedStateFromError() {
    return { erro: true };
  }

  componentDidCatch(error, info) {
    // Em producao da para enviar para um servico de logs aqui.
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-5">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-suave">
            <div className="flex justify-center"><Logo size={40} /></div>
            <PetLost className="mx-auto mt-4 w-44" />
            <h1 className="mt-3 text-xl font-bold text-marca-900 dark:text-slate-100">Algo deu errado</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Tivemos um problema inesperado ao carregar esta tela. Tente recarregar — se continuar,
              volte para o início.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button onClick={() => window.location.reload()} className="btn-primario w-full">Recarregar</button>
              <a href="/" className="btn-secundario w-full">Ir para o início</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
