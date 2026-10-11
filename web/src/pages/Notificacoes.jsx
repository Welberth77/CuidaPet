import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useNotif } from "../contexts/NotifContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { aceitarConvite, removerConvite } from "../services/shares.js";
import PetAvatar from "../components/art/PetAvatar.jsx";
import { IconBell } from "../components/art/Icons.jsx";
import { formatar } from "../utils/datas.js";

export default function Notificacoes() {
  const { notificacoes, atualizar } = useNotif();
  const toast = useToast();
  const [ocupado, setOcupado] = useState(null);

  async function aceitar(n) {
    setOcupado(n.id);
    try {
      await aceitarConvite(n.id);
      toast.sucesso(`${n.pet_nome} agora está no seu perfil!`);
      await atualizar();
    } catch {
      toast.erro("Não foi possível aceitar. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  async function recusar(n) {
    setOcupado(n.id);
    try {
      await removerConvite(n.id);
      toast.info("Solicitação recusada.");
      await atualizar();
    } catch {
      toast.erro("Não foi possível recusar. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Notificações</h1>

      {notificacoes.length === 0 ? (
        <div className="cartao flex flex-col items-center py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-marca-500/10 text-marca-500">
            <IconBell width="26" height="26" />
          </span>
          <p className="mt-4 font-medium text-marca-900">Nenhuma notificação por aqui</p>
          <p className="mt-1 text-sm text-slate-500">
            Quando alguém compartilhar um pet com você, a solicitação aparece aqui.
          </p>
          <Link to="/meus-pets" className="btn-secundario mt-5">Ver meus pets</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((n) => (
            <div key={n.id} className="cartao flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <PetAvatar especie="cachorro" size={44} />
                <div>
                  <p className="text-marca-900">
                    <strong>{n.owner_nome || n.owner_email}</strong> quer compartilhar o pet{" "}
                    <strong>{n.pet_nome}</strong> com você.
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {n.owner_email} · {formatar((n.created_at || "").split("T")[0])}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Ao aceitar, o pet aparece em “Meus Pets” e você poderá ver e registrar os cuidados dele.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-primario px-4 py-2 text-sm" disabled={ocupado === n.id} onClick={() => aceitar(n)}>
                  Aceitar
                </button>
                <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" disabled={ocupado === n.id} onClick={() => recusar(n)}>
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
