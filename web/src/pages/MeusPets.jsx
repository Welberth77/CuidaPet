import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useConfirm } from "../components/ui/Confirm.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { listarPets, removerPet } from "../services/pets.js";
import { sairDoCompartilhamento } from "../services/shares.js";
import { listarSaude } from "../services/saude.js";
import { listarBanhoTosa } from "../services/banhoTosa.js";
import { IconVaccine, IconBath } from "../components/art/Icons.jsx";
import PetAvatar from "../components/art/PetAvatar.jsx";
import EmptyArt from "../components/art/EmptyArt.jsx";
import CompartilharModal from "../components/CompartilharModal.jsx";
import { formatar } from "../utils/datas.js";

export default function MeusPets() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmar = useConfirm();
  const [pets, setPets] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [compartilhando, setCompartilhando] = useState(null);
  const [saude, setSaude] = useState([]);
  const [banho, setBanho] = useState([]);

  const ehDono = (pet) => pet && pet.owner_id === usuario.uid;

  const eventos = useMemo(() => {
    if (!selecionado) return [];
    const s = saude.filter((x) => x.petId === selecionado.id).map((x) => ({ id: "s" + x.id, titulo: x.nome, tipo: x.categoria || "Saúde", data: x.data, k: "vacina" }));
    const b = banho.filter((x) => x.petId === selecionado.id).map((x) => ({ id: "b" + x.id, titulo: x.servico, tipo: "Banho e tosa", data: x.data, k: "banho" }));
    return [...s, ...b].sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [saude, banho, selecionado]);

  async function carregar() {
    setCarregando(true);
    try {
      const [lista, s, b] = await Promise.all([
        listarPets(usuario.uid),
        listarSaude(usuario.uid).catch(() => []),
        listarBanhoTosa(usuario.uid).catch(() => []),
      ]);
      setPets(lista);
      setSaude(s);
      setBanho(b);
      setSelecionado((atual) => lista.find((p) => p.id === atual?.id) || lista[0] || null);
    } catch {
      toast.erro("Não foi possível carregar seus pets.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  async function handleRemover(pet) {
    const ok = await confirmar({
      titulo: `Remover ${pet.nome}?`,
      mensagem: "Todos os registros de saúde e banho desse pet também serão apagados. Esta ação não pode ser desfeita.",
      confirmarTexto: "Remover",
    });
    if (!ok) return;
    try {
      await removerPet(pet.id);
      toast.sucesso(`${pet.nome} removido.`);
      carregar();
    } catch {
      toast.erro("Não foi possível remover o pet.");
    }
  }

  async function handleSair(pet) {
    const ok = await confirmar({
      titulo: `Sair do compartilhamento?`,
      mensagem: `Você deixará de ver ${pet.nome} e os cuidados dele. O dono pode te convidar novamente depois.`,
      confirmarTexto: "Sair",
    });
    if (!ok) return;
    try {
      await sairDoCompartilhamento(pet.id, usuario.uid);
      toast.sucesso("Você saiu do compartilhamento.");
      carregar();
    } catch {
      toast.erro("Não foi possível sair do compartilhamento.");
    }
  }

  return (
    <Layout>
      {compartilhando && (
        <CompartilharModal pet={compartilhando} onFechar={() => setCompartilhando(null)} />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-marca-900">Meus Pets</h1>
        <Link to="/pets/novo" className="btn-primario">+ Cadastrar pet</Link>
      </div>

      {carregando ? (
        <TelaCarregando />
      ) : pets.length === 0 ? (
        <div className="cartao flex flex-col items-center text-center">
          <EmptyArt className="w-56" />
          <p className="mt-2 font-medium text-marca-900">Você ainda não tem pets cadastrados</p>
          <p className="mt-1 text-sm text-slate-500">Cadastre seu primeiro pet para começar.</p>
          <Link to="/pets/novo" className="btn-primario mt-5">Cadastrar meu primeiro pet</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <ul className="space-y-2">
            {pets.map((pet) => (
              <li key={pet.id}>
                <button
                  onClick={() => setSelecionado(pet)}
                  className={
                    "flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left transition " +
                    (selecionado?.id === pet.id
                      ? "border-marca-500 bg-marca-500/10 font-semibold text-marca-700"
                      : "border-slate-200 bg-white hover:border-marca-500/50")
                  }
                >
                  <PetAvatar especie={pet.especie} size={28} fotoUrl={pet.foto_url} />
                  <span className="flex-1 truncate">{pet.nome}</span>
                  {!ehDono(pet) && (
                    <span className="rounded-full bg-marca-100 px-2 py-0.5 text-[10px] font-medium text-marca-700">compartilhado</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {selecionado && (
            <div className="cartao">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-3 text-xl font-bold text-marca-900">
                    <PetAvatar especie={selecionado.especie} size={44} fotoUrl={selecionado.foto_url} />
                    {selecionado.nome}
                  </h2>
                  {!ehDono(selecionado) && (
                    <span className="mt-2 inline-block rounded-full bg-marca-100 px-2.5 py-0.5 text-xs font-medium text-marca-700">
                      Compartilhado com você
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ehDono(selecionado) && (
                    <button onClick={() => setCompartilhando(selecionado)} className="btn-secundario px-3 py-1.5 text-sm">
                      Compartilhar
                    </button>
                  )}
                  <button onClick={() => navigate(`/pets/${selecionado.id}/carteira`)} className="btn-secundario px-3 py-1.5 text-sm">
                    Carteira (PDF)
                  </button>
                  <button onClick={() => navigate(`/pets/${selecionado.id}/editar`)} className="btn-secundario px-3 py-1.5 text-sm">
                    Editar
                  </button>
                  {ehDono(selecionado) ? (
                    <button onClick={() => handleRemover(selecionado)} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                      Remover
                    </button>
                  ) : (
                    <button onClick={() => handleSair(selecionado)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                      Sair
                    </button>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <Info rotulo="Espécie" valor={cap(selecionado.especie)} />
                <Info rotulo="Raça" valor={cap(selecionado.raca)} />
                <Info rotulo="Sexo" valor={selecionado.sexo} />
                <Info rotulo="Peso" valor={selecionado.peso ? `${selecionado.peso} kg` : "-"} />
                <Info rotulo="Nascimento" valor={formatar(selecionado.nascimento)} />
                <Info rotulo="Cor da pelagem" valor={cap(selecionado.cor)} />
                <Info rotulo="Pelagem" valor={cap(selecionado.pelagem)} />
              </dl>

              {selecionado.sobre && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-marca-700">Sobre o pet</p>
                  <p className="mt-1 text-slate-600">{selecionado.sobre}</p>
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="mb-3 text-sm font-medium text-marca-700">Linha do tempo</p>
                {eventos.length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhum registro de saúde ou banho ainda.</p>
                ) : (
                  <ol className="relative space-y-4 border-l-2 border-slate-100 pl-6">
                    {eventos.map((ev) => (
                      <li key={ev.id} className="relative">
                        <span className={"absolute -left-[31px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white " + (ev.k === "banho" ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600")}>
                          {ev.k === "banho" ? <IconBath width="15" height="15" /> : <IconVaccine width="15" height="15" />}
                        </span>
                        <p className="text-sm font-medium text-marca-900">{ev.titulo}</p>
                        <p className="text-xs text-slate-500">{ev.tipo} · {formatar(ev.data)}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

function Info({ rotulo, valor }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{rotulo}</dt>
      <dd className="text-slate-800">{valor || "-"}</dd>
    </div>
  );
}

function cap(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
