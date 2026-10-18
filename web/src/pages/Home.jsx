import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import HeroArt from "../components/art/HeroArt.jsx";
import EmptyArt from "../components/art/EmptyArt.jsx";
import PetAvatar from "../components/art/PetAvatar.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { IconPaw, IconVaccine, IconBath, IconArrow } from "../components/art/Icons.jsx";
import { listarPets } from "../services/pets.js";
import { listarSaude } from "../services/saude.js";
import { listarBanhoTosa } from "../services/banhoTosa.js";
import { statusData, rotuloPrazo, formatar, idadeTexto, ehAniversarioHoje, anosFazendo } from "../utils/datas.js";
import Onboarding from "../components/Onboarding.jsx";
import Aniversario from "../components/Aniversario.jsx";

export default function Home() {
  const { usuario, perfil } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const chaveOnb = usuario ? `cuidapet:onboarding:${usuario.uid}` : null;
  const [mostrarOnb, setMostrarOnb] = useState(() => {
    try { return chaveOnb ? !localStorage.getItem(chaveOnb) : false; } catch { return false; }
  });

  function fecharOnb() {
    try { if (chaveOnb) localStorage.setItem(chaveOnb, "1"); } catch { /* ignore */ }
    setMostrarOnb(false);
  }
  const [carregando, setCarregando] = useState(true);
  const [pets, setPets] = useState([]);
  const [lembretes, setLembretes] = useState([]);
  const [festaFila, setFestaFila] = useState([]);

  function fecharFesta() {
    const atual = festaFila[0];
    if (atual) {
      try { localStorage.setItem(`cuidapet:bday:${atual.id}:${new Date().getFullYear()}`, "1"); } catch { /* ignore */ }
    }
    setFestaFila((f) => f.slice(1));
  }

  useEffect(() => {
    (async () => {
      try {
        const [p, saude, banho] = await Promise.all([
          listarPets(usuario.uid),
          listarSaude(usuario.uid),
          listarBanhoTosa(usuario.uid),
        ]);
        setPets(p);

        const ano = new Date().getFullYear();
        const niver = p
          .filter((x) => ehAniversarioHoje(x.nascimento))
          .filter((x) => {
            try { return !localStorage.getItem(`cuidapet:bday:${x.id}:${ano}`); } catch { return true; }
          });
        setFestaFila(niver);

        const deSaude = saude
          .filter((s) => s.proxima)
          .map((s) => ({ id: "s" + s.id, tipo: s.categoria || "Saúde", titulo: s.nome, pet: s.petNome, data: s.proxima, icone: "vacina" }));
        const deBanho = banho
          .filter((b) => b.proxima)
          .map((b) => ({ id: "b" + b.id, tipo: b.servico || "Banho e Tosa", titulo: b.servico, pet: b.petNome, data: b.proxima, icone: "banho" }));

        const todos = [...deSaude, ...deBanho]
          .map((l) => ({ ...l, status: statusData(l.data) }))
          .filter((l) => l.status === "atrasado" || l.status === "proximo")
          .sort((a, b) => a.data.localeCompare(b.data));

        setLembretes(todos);
      } catch {
        toast.erro("Não foi possível carregar seus dados. Tente recarregar a página.");
      } finally {
        setCarregando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const primeiroNome = (perfil?.nome || "").split(" ")[0];
  const atrasados = lembretes.filter((l) => l.status === "atrasado");
  const proximos = lembretes.filter((l) => l.status === "proximo");

  return (
    <Layout>
      {mostrarOnb && (
        <Onboarding
          onCadastrar={() => { fecharOnb(); navigate("/pets/novo"); }}
          onDepois={fecharOnb}
        />
      )}
      {!mostrarOnb && festaFila.length > 0 && (
        <Aniversario pet={festaFila[0]} anos={anosFazendo(festaFila[0].nascimento)} onFechar={fecharFesta} />
      )}
      {/* Hero */}
      <section className="mb-8 grid items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-marca-500 to-marca-900 px-6 py-8 text-white shadow-suave sm:px-10 md:grid-cols-[1fr_220px]">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Olá{primeiroNome ? `, ${primeiroNome}` : ""}! 🐾</h1>
          <p className="mt-2 max-w-xl text-white/85">
            Aqui está um resumo dos cuidados dos seus pets.
          </p>
        </div>
        <HeroArt className="mx-auto hidden w-48 md:block" />
      </section>

      {carregando ? (
        <TelaCarregando />
      ) : pets.length === 0 ? (
        <div className="cartao flex flex-col items-center text-center">
          <EmptyArt className="w-56" />
          <p className="mt-2 font-medium text-marca-900">Comece cadastrando seu primeiro pet</p>
          <p className="mt-1 text-sm text-slate-500">
            Depois você poderá registrar vacinas, medicamentos e banhos — e receber lembretes aqui.
          </p>
          <Link to="/pets/novo" className="btn-primario mt-5">Cadastrar meu primeiro pet</Link>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard valor={pets.length} rotulo={pets.length === 1 ? "pet cadastrado" : "pets cadastrados"} cor="marca" to="/meus-pets" />
            <StatCard valor={proximos.length} rotulo="cuidados nos próximos 7 dias" cor="amber" to="/medicamentos-vacinas" />
            <StatCard valor={atrasados.length} rotulo="cuidados atrasados" cor="red" to="/medicamentos-vacinas" />
          </div>

          {/* Seus pets */}
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-marca-900">Seus pets</h2>
              <Link to="/meus-pets" className="text-sm font-medium text-marca-500 hover:underline">Ver todos</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((p) => {
                const idade = idadeTexto(p.nascimento);
                const compartilhado = p.owner_id !== usuario.uid;
                const niverHoje = ehAniversarioHoje(p.nascimento);
                return (
                  <Link key={p.id} to="/meus-pets" className="cartao flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-suave">
                    <PetAvatar especie={p.especie} fotoUrl={p.foto_url} size={56} ampliavel />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-marca-900">{p.nome}</p>
                      <p className="truncate text-sm text-slate-500">
                        {idade || (p.especie === "gato" ? "Gato" : "Cachorro")}
                      </p>
                      {niverHoje && (
                        <span className="mt-1 mr-1 inline-block rounded-full bg-acento-50 px-2 py-0.5 text-[10px] font-medium text-acento-600">🎂 Aniversário hoje!</span>
                      )}
                      {compartilhado && (
                        <span className="mt-1 inline-block rounded-full bg-marca-100 px-2 py-0.5 text-[10px] font-medium text-marca-700">compartilhado</span>
                      )}
                    </div>
                  </Link>
                );
              })}
              <Link to="/pets/novo" className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-5 text-sm font-medium text-slate-500 transition hover:border-marca-500/50 hover:text-marca-600">
                + Cadastrar pet
              </Link>
            </div>
          </section>

          {/* Atrasados */}
          {atrasados.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-red-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-sm">!</span>
                Atrasados
              </h2>
              <div className="space-y-2">
                {atrasados.map((l) => <LinhaLembrete key={l.id} l={l} />)}
              </div>
            </section>
          )}

          {/* Próximos */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-marca-900">Próximos cuidados</h2>
            {proximos.length === 0 ? (
              <div className="cartao text-sm text-slate-500">
                Nenhum cuidado agendado para os próximos dias. Registre a próxima data ao adicionar
                uma vacina ou banho para ver os lembretes aqui.
              </div>
            ) : (
              <div className="space-y-2">
                {proximos.map((l) => <LinhaLembrete key={l.id} l={l} />)}
              </div>
            )}
          </section>

          {/* Atalhos */}
          <h2 className="mb-3 text-lg font-bold text-marca-900">Ações rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Atalho to="/pets/novo" Icone={IconPaw} titulo="Cadastrar pet" />
            <Atalho to="/medicamentos-vacinas" Icone={IconVaccine} titulo="Registrar vacina" />
            <Atalho to="/banho-tosa" Icone={IconBath} titulo="Registrar banho" />
          </div>
        </>
      )}
    </Layout>
  );
}

function StatCard({ valor, rotulo, cor, to }) {
  const cores = {
    marca: "text-marca-500",
    amber: "text-amber-500",
    red: "text-red-500",
  };
  return (
    <Link to={to} className="cartao transition hover:-translate-y-0.5 hover:shadow-suave">
      <div className={"text-4xl font-black " + cores[cor]}>{valor}</div>
      <div className="mt-1 text-sm text-slate-500">{rotulo}</div>
    </Link>
  );
}

function LinhaLembrete({ l }) {
  const atrasado = l.status === "atrasado";
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={"flex h-9 w-9 items-center justify-center rounded-lg " + (atrasado ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>
          {l.icone === "banho" ? <IconBath width="18" height="18" /> : <IconVaccine width="18" height="18" />}
        </span>
        <div>
          <p className="font-medium text-marca-900">{l.titulo} <span className="font-normal text-slate-400">· {l.pet}</span></p>
          <p className="text-xs text-slate-500">{l.tipo}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-700">{formatar(l.data)}</p>
        <p className={"text-xs font-medium " + (atrasado ? "text-red-600" : "text-amber-600")}>{rotuloPrazo(l.data)}</p>
      </div>
    </div>
  );
}

function Atalho({ to, Icone, titulo }) {
  return (
    <Link to={to} className="cartao group flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-suave">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-500/10 text-marca-500 transition group-hover:bg-marca-500 group-hover:text-white">
        <Icone />
      </span>
      <span className="font-semibold text-marca-900">{titulo}</span>
      <IconArrow width="18" height="18" className="ml-auto text-slate-300 group-hover:text-marca-500" />
    </Link>
  );
}
