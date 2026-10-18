import Logo from "./art/Logo.jsx";
import PetScene from "./art/PetScene.jsx";
import { useTema } from "../contexts/ThemeContext.jsx";

export default function AuthShell({ titulo, subtitulo, children }) {
  return (
    <div className="relative flex min-h-screen items-stretch bg-white dark:bg-slate-800">
      <BotaoTemaAuth />
      {/* Painel lateral de marca */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-marca-500 to-marca-900 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:text-white">
        <Logo tone="light" size={40} className="absolute left-14 top-10 [&_span]:text-2xl" />
        <PetScene className="mx-auto w-[82%] max-w-md" />
        <p className="mx-auto mt-4 max-w-sm text-center text-lg text-white/85">
          Tudo o que você precisa para organizar os cuidados do seu pet em um só lugar.
        </p>
      </div>

      {/* Formulario */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size={40} />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-marca-900 dark:text-slate-100">{titulo}</h1>
          {subtitulo && <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{subtitulo}</p>}
          {!subtitulo && <div className="mb-6" />}
          {children}
        </div>
      </div>
    </div>
  );
}

function BotaoTemaAuth() {
  const { tema, alternar } = useTema();
  const escuro = tema === "escuro";
  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={escuro}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    >
      {escuro ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
