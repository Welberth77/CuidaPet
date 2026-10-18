import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useConfirm } from "../components/ui/Confirm.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import BadgePrazo from "../components/ui/BadgePrazo.jsx";
import { listarPets } from "../services/pets.js";
import { listarBanhoTosa, criarBanhoTosa, atualizarBanhoTosa, removerBanhoTosa } from "../services/banhoTosa.js";
import { SERVICOS_BANHO } from "../data/opcoesPet.js";
import { ListaRegistros, Campo, cls, SemPets } from "./MedicamentosVacinas.jsx";
import { hoje, formatar, DATA_MINIMA, maxFuturo } from "../utils/datas.js";

const inicial = { petId: "", servico: "", data: "", proxima: "", observacoes: "" };

export default function BanhoTosa() {
  const { usuario } = useAuth();
  const toast = useToast();
  const confirmar = useConfirm();
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    try {
      const [p, r] = await Promise.all([listarPets(usuario.uid), listarBanhoTosa(usuario.uid)]);
      setPets(p);
      setRegistros(r);
    } catch {
      toast.erro("Não foi possível carregar os registros.");
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function editar(r) {
    setForm({ petId: r.petId || "", servico: r.servico || "", data: r.data || "", proxima: r.proxima || "", observacoes: r.observacoes || "" });
    setEditandoId(r.id);
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setForm(inicial);
    setEditandoId(null);
    setErros({});
  }

  function validar() {
    const e = {};
    if (!form.petId) e.petId = true;
    if (!form.servico) e.servico = true;
    if (!form.data) e.data = true;
    else if (form.data < DATA_MINIMA || form.data > hoje()) e.data = true;
    if (form.proxima && (form.proxima < (form.data || hoje()) || form.proxima > maxFuturo())) e.proxima = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      const pet = pets.find((p) => p.id === form.petId);
      const dados = { ...form, petNome: pet?.nome || "" };
      if (editandoId) {
        await atualizarBanhoTosa(editandoId, dados);
        toast.sucesso("Registro atualizado!");
      } else {
        await criarBanhoTosa(usuario.uid, dados);
        toast.sucesso("Registro salvo!");
      }
      cancelar();
      carregar();
    } catch {
      toast.erro("Não foi possível salvar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    const ok = await confirmar({ titulo: "Remover registro?", mensagem: "Esta ação não pode ser desfeita.", confirmarTexto: "Remover" });
    if (!ok) return;
    try {
      await removerBanhoTosa(id);
      if (editandoId === id) cancelar();
      toast.sucesso("Registro removido.");
      carregar();
    } catch {
      toast.erro("Não foi possível remover.");
    }
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Banho e Tosa</h1>

      {carregando ? (
        <TelaCarregando />
      ) : pets.length === 0 ? (
        <SemPets texto="Você precisa ter ao menos um pet para registrar banho e tosa." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className={"cartao h-fit space-y-4 " + (editandoId ? "ring-2 ring-marca-500/40" : "")} noValidate>
            <h2 className="font-semibold text-marca-900">{editandoId ? "Editar registro" : "Registrar novo"}</h2>

            <Campo rotulo="Pet" erro={erros.petId}>
              <select className={cls(erros.petId)} value={form.petId} onChange={(e) => set("petId", e.target.value)}>
                <option value="">Selecione o pet</option>
                {pets.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Serviço" erro={erros.servico}>
              <select className={cls(erros.servico)} value={form.servico} onChange={(e) => set("servico", e.target.value)}>
                <option value="">Selecione</option>
                {SERVICOS_BANHO.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Data" erro={erros.data}>
              <input type="date" min={DATA_MINIMA} max={hoje()} className={cls(erros.data)} value={form.data} onChange={(e) => set("data", e.target.value)} />
            </Campo>

            <Campo rotulo="Próximo (opcional)" erro={erros.proxima}>
              <input type="date" min={form.data || hoje()} max={maxFuturo()} className={cls(erros.proxima)} value={form.proxima} onChange={(e) => set("proxima", e.target.value)} />
            </Campo>

            <Campo rotulo="Observações (opcional)">
              <textarea rows="2" maxLength={300} className="campo" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Ex.: usar shampoo hipoalergênico" />
            </Campo>

            <div className="flex gap-2">
              <button type="submit" className="btn-primario flex-1" disabled={enviando}>
                {enviando ? "Salvando..." : editandoId ? "Salvar alterações" : "Salvar registro"}
              </button>
              {editandoId && (
                <button type="button" className="btn-secundario" onClick={cancelar}>Cancelar</button>
              )}
            </div>
          </form>

          <ListaRegistros
            registros={registros}
            onEditar={editar}
            onRemover={handleRemover}
            selecionadoId={editandoId}
            colunas={[
              { titulo: "Serviço", render: (r) => <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">{r.servico}</span> },
              { titulo: "Pet", render: (r) => r.petNome },
              { titulo: "Feito em", render: (r) => formatar(r.data) },
              { titulo: "Próximo", render: (r) => <BadgePrazo iso={r.proxima} /> },
              { titulo: "Obs.", render: (r) => r.observacoes || "-" },
            ]}
            vazio="Nenhum banho ou tosa registrado ainda."
          />
        </div>
      )}
    </Layout>
  );
}
