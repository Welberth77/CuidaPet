import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useConfirm } from "../components/ui/Confirm.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { listarPets, removerPet } from "../services/pets.js";
import PetAvatar from "../components/art/PetAvatar.jsx";
import EmptyArt from "../components/art/EmptyArt.jsx";
import { formatar } from "../utils/datas.js";

export default function MeusPets() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmar = useConfirm();
  const [pets, setPets] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const lista = await listarPets(usuario.uid);
      setPets(lista);
      setSelecionado((atual) => lista.find((p) => p.id === atual?.id) || lista[0] || null);
    } catch {
      toast.erro("Não foi possível carregar seus pets.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

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

  return (
    <Layout>
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
                    "w-full rounded-lg border px-4 py-3 text-left transition " +
                    (selecionado?.id === pet.id
                      ? "border-marca-500 bg-marca-500/10 font-semibold text-marca-700"
                      : "border-slate-200 bg-white hover:border-marca-500/50")
                  }
                >
                  <span className="flex items-center gap-2">
                    <PetAvatar especie={pet.especie} size={28} />
                    {pet.nome}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {selecionado && (
            <div className="cartao">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold text-marca-900">
                  <PetAvatar especie={selecionado.especie} size={44} />
                  {selecionado.nome}
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/pets/${selecionado.id}/editar`)} className="btn-secundario px-3 py-1.5 text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleRemover(selecionado)} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                    Remover
                  </button>
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
