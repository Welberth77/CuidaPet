import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#conteudo" className="sr-only rounded-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-marca-700 focus:shadow dark:focus:bg-slate-800 dark:focus:text-marca-200">Pular para o conteúdo</a>
      <Header />
      <div className="h-16" aria-hidden="true" />
      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none">{children}</main>
      <Footer />
    </div>
  );
}
