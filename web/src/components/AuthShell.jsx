import Logo from "./art/Logo.jsx";
import PetScene from "./art/PetScene.jsx";

export default function AuthShell({ titulo, subtitulo, children }) {
  return (
    <div className="flex min-h-screen items-stretch bg-white">
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
          <h1 className="mb-1 text-2xl font-bold text-marca-900">{titulo}</h1>
          {subtitulo && <p className="mb-6 text-sm text-slate-500">{subtitulo}</p>}
          {!subtitulo && <div className="mb-6" />}
          {children}
        </div>
      </div>
    </div>
  );
}
