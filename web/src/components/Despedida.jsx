import { useState } from "react";
import { createPortal } from "react-dom";
import { marcarFalecido } from "../services/pets.js";
import { useToast } from "./ui/Toast.jsx";
import PetAvatar from "./art/PetAvatar.jsx";
import { duracaoTexto, formatar, hoje, DATA_MINIMA } from "../utils/datas.js";

function femea(pet) {
  return String(pet?.sexo || "").toLowerCase().startsWith("f");
}

export default function Despedida({ pet, cuidados = {}, onConcluir, onFechar }) {
  const toast = useToast();
  const [etapa, setEtapa] = useState("confirmar"); // confirmar | homenagem
  const [data, setData] = useState(hoje());
  const [salvando, setSalvando] = useState(false);

  const dataMin = pet.nascimento && pet.nascimento > DATA_MINIMA ? pet.nascimento : DATA_MINIMA;

  async function confirmar() {
    if (pet.nascimento && data && data < pet.nascimento) {
      toast.erro("A data da partida não pode ser anterior ao nascimento do pet.");
      return;
    }
    if (data && data > hoje()) {
      toast.erro("A data da partida não pode ser no futuro.");
      return;
    }
    setSalvando(true);
    try {
      await marcarFalecido(pet.id, data);
      setEtapa("homenagem");
    } catch {
      toast.erro("Não foi possível concluir agora. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function fechar() {
    if (etapa === "homenagem") onConcluir?.();
    onFechar();
  }

  const f = femea(pet);
  const dele = f ? "dela" : "dele";
  const Ele = f ? "Ela" : "Ele";
  const amado = f ? "amada, protegida e feliz" : "amado, protegido e feliz";
  const inicio = pet.nascimento || (pet.created_at ? String(pet.created_at).slice(0, 10) : null);
  const duracao = duracaoTexto(inicio, data);
  const saude = cuidados.saude || 0;
  const banho = cuidados.banho || 0;

  const partes = [];
  if (duracao) partes.push(`${duracao} ao seu lado`);
  if (saude > 0) partes.push(`${saude} ${saude === 1 ? "registro de saúde" : "registros de saúde"}`);
  if (banho > 0) partes.push(`${banho} ${banho === 1 ? "cuidado de banho e tosa" : "cuidados de banho e tosa"}`);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" style={{ animation: "popar 0.18s ease-out" }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {etapa === "confirmar" ? (
          <div className="p-6">
            <div className="mb-3 text-center text-3xl">🕊️</div>
            <h3 className="text-center text-lg font-bold text-marca-900">Prestar homenagem a {pet.nome}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sentimos muito pela sua perda. 💙 Ao confirmar, criamos um memorial para {pet.nome}: o perfil e
              todas as memórias continuam guardadas com você, e pausamos os lembretes e as comemorações.
              Você pode desfazer isso quando quiser.
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium text-marca-700">Data da partida (opcional)</span>
              <input type="date" className="campo" min={dataMin} max={hoje()} value={data} onChange={(e) => setData(e.target.value)} />
            </label>
            <div className="mt-6 flex gap-2">
              <button onClick={confirmar} disabled={salvando} className="btn-primario flex-1">
                {salvando ? "Criando..." : "Criar memorial"}
              </button>
              <button onClick={onFechar} className="btn-secundario">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-marca-50 to-white p-7 text-center">
            <div className="mb-2 text-2xl">🕊️</div>
            <p className="text-xs font-medium uppercase tracking-wide text-marca-500">Em memória de</p>
            <h3 className="text-xl font-bold text-marca-900">{pet.nome}</h3>
            <div className="my-4 flex justify-center">
              <PetAvatar especie={pet.especie} fotoUrl={pet.foto_url} size={110} className="ring-4 ring-white shadow-suave" />
            </div>
            <p className="text-[15px] font-medium text-marca-900">{pet.nome} teve uma vida muito bem cuidada.</p>
            {partes.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">{partes.join(" · ")}</p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Cada vacina, cada banho e cada detalhe que você registrou foi prova do seu carinho.
              {" "}{Ele} foi {amado} ao seu lado. Obrigado por ter cuidado tão bem {dele} — as boas memórias
              ficam para sempre. 🐾
            </p>
            <button onClick={fechar} className="btn-primario mt-6 w-full">Guardar memória</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
