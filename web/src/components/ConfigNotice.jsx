import Logo from "./art/Logo.jsx";

export default function ConfigNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-suave">
        <Logo size={40} />
        <h1 className="mt-6 text-xl font-bold text-marca-900">
          Configure o Supabase para começar
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          As credenciais do Supabase ainda não foram definidas. Crie um arquivo
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-marca-700">.env</code>
          na pasta do projeto (use o
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-marca-700">.env.example</code>
          como base) e preencha com os dados do seu projeto Supabase.
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Crie um projeto em supabase.com</li>
          <li>Rode o schema (supabase/schema.sql) no SQL Editor</li>
          <li>Copie a URL e a chave anon em Project Settings → API para o <code>.env</code></li>
          <li>Reinicie o <code>npm run dev</code></li>
        </ol>
        <p className="mt-4 text-xs text-slate-400">Passo a passo completo no arquivo README.md.</p>
      </div>
    </div>
  );
}
