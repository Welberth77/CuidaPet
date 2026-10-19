import { Link } from "react-router-dom";
import Logo from "./art/Logo.jsx";
import Footer from "./Footer.jsx";

export function H2({ children }) {
  return <h2 className="mt-7 text-lg font-semibold text-marca-900 dark:text-slate-100">{children}</h2>;
}
export function P({ children }) {
  return <p className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>;
}
export function UL({ children }) {
  return <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{children}</ul>;
}

export default function LegalShell({ titulo, atualizado, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="bg-gradient-to-r from-marca-500 to-marca-700 text-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link to="/" aria-label="CuidaPet - início"><Logo tone="light" /></Link>
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10">Voltar ao início</Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold text-marca-900 dark:text-slate-100">{titulo}</h1>
        {atualizado && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Última atualização: {atualizado}</p>}
        <div className="mt-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
