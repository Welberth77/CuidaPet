import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import Logo from "../components/art/Logo.jsx";
import PetAvatar from "../components/art/PetAvatar.jsx";
import { obterPet } from "../services/pets.js";
import { listarSaude } from "../services/saude.js";
import { listarBanhoTosa } from "../services/banhoTosa.js";
import { formatar, idadeTexto } from "../utils/datas.js";
import { useToast } from "../components/ui/Toast.jsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function CarteiraPet() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const folhaRef = useRef(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [pet, setPet] = useState(null);
  const [saude, setSaude] = useState([]);
  const [banho, setBanho] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, b] = await Promise.all([
          obterPet(id),
          listarSaude(usuario.uid).catch(() => []),
          listarBanhoTosa(usuario.uid).catch(() => []),
        ]);
        setPet(p);
        setSaude(s.filter((x) => x.petId === id));
        setBanho(b.filter((x) => x.petId === id));
        if (p?.nome) document.title = "Carteira de " + p.nome;
      } finally {
        setCarregando(false);
      }
    })();
    return () => { document.title = "CuidaPet"; };
  }, [id, usuario]);

  async function gerarCanvas() {
    return html2canvas(folhaRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  }

  async function arquivoPng() {
    const canvas = await gerarCanvas();
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    return new File([blob], `Carteira de ${pet.nome}.png`, { type: "image/png" });
  }

  async function arquivoPdf() {
    const canvas = await gerarCanvas();
    const img = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pw) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, "JPEG", 0, position, pw, imgH);
    heightLeft -= ph;
    while (heightLeft > 0) {
      position -= ph;
      pdf.addPage();
      pdf.addImage(img, "JPEG", 0, position, pw, imgH);
      heightLeft -= ph;
    }
    const blob = pdf.output("blob");
    return new File([blob], `Carteira de ${pet.nome}.pdf`, { type: "application/pdf" });
  }

  async function compartilhar(tipo) {
    setMenuAberto(false);
    setGerando(true);
    try {
      const file = tipo === "pdf" ? await arquivoPdf() : await arquivoPng();
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Carteira de ${pet.nome}` });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        toast.info("Compartilhamento direto não é suportado aqui — o arquivo foi baixado.");
      }
    } catch (e) {
      if (e?.name !== "AbortError") toast.erro("Não foi possível gerar o arquivo.");
    } finally {
      setGerando(false);
    }
  }

  if (carregando) return <div className="min-h-screen bg-slate-100 py-10"><TelaCarregando /></div>;
  if (!pet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
        <p className="text-slate-600">Pet não encontrado.</p>
        <Link to="/meus-pets" className="btn-primario">Voltar</Link>
      </div>
    );
  }

  const cap = (x) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "-");
  const vacinas = saude.filter((s) => s.categoria === "Vacina");
  const medicamentos = saude.filter((s) => s.categoria !== "Vacina");

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      {/* Barra de acoes (nao sai na impressao) */}
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between px-4">
        <button onClick={() => navigate(-1)} className="btn-secundario">← Voltar</button>
        <div className="relative">
          <button onClick={() => setMenuAberto((a) => !a)} className="btn-primario" disabled={gerando}>
            {gerando ? "Gerando..." : "Compartilhar"}
          </button>
          {menuAberto && (
            <div className="absolute right-0 z-10 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-suave">
              <button onClick={() => compartilhar("pdf")} className="block w-full px-4 py-2.5 text-left text-sm text-marca-900 hover:bg-slate-50">Compartilhar como PDF</button>
              <button onClick={() => compartilhar("png")} className="block w-full px-4 py-2.5 text-left text-sm text-marca-900 hover:bg-slate-50">Compartilhar como imagem (PNG)</button>
            </div>
          )}
        </div>
      </div>

      {/* Folha */}
      <div ref={folhaRef} className="folha mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-suave sm:p-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Logo />
          <div className="text-right">
            <h1 className="text-lg font-bold text-marca-900">Carteira de Saúde</h1>
            <p className="text-xs text-slate-400">Emitida em {formatar(new Date().toISOString().split("T")[0])}</p>
          </div>
        </div>

        {/* Dados do pet */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-7">
          <PetAvatar especie={pet.especie} fotoUrl={pet.foto_url} size={160} className="ring-4 ring-marca-500/15" />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-marca-900">{pet.nome}</h2>
            <p className="mt-1 text-slate-500">
              {cap(pet.especie)}{pet.raca ? ` · ${cap(pet.raca)}` : ""}{pet.sexo ? ` · ${pet.sexo}` : ""}
            </p>
            {idadeTexto(pet.nascimento) && (
              <p className="mt-0.5 text-sm text-slate-400">{idadeTexto(pet.nascimento)}</p>
            )}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          <Linha rotulo="Idade" valor={idadeTexto(pet.nascimento) || "-"} />
          <Linha rotulo="Nascimento" valor={formatar(pet.nascimento)} />
          <Linha rotulo="Peso" valor={pet.peso ? `${pet.peso} kg` : "-"} />
          <Linha rotulo="Cor" valor={cap(pet.cor)} />
          <Linha rotulo="Pelagem" valor={cap(pet.pelagem)} />
        </dl>
        {pet.sobre && <p className="mt-3 text-sm text-slate-600"><strong>Sobre:</strong> {pet.sobre}</p>}

        <Secao titulo="Vacinas" vazio="Nenhuma vacina registrada.">
          {vacinas.length > 0 && (
            <Tabela colunas={["Vacina", "Aplicação", "Próxima"]}
              linhas={vacinas.map((v) => [v.nome, formatar(v.data), v.proxima ? formatar(v.proxima) : "-"])} />
          )}
        </Secao>

        <Secao titulo="Medicamentos" vazio="Nenhum medicamento registrado.">
          {medicamentos.length > 0 && (
            <Tabela colunas={["Medicamento", "Data", "Próxima"]}
              linhas={medicamentos.map((m) => [m.nome, formatar(m.data), m.proxima ? formatar(m.proxima) : "-"])} />
          )}
        </Secao>

        <Secao titulo="Banho e Tosa" vazio="Nenhum registro de banho ou tosa.">
          {banho.length > 0 && (
            <Tabela colunas={["Serviço", "Data", "Observações"]}
              linhas={banho.map((b) => [b.servico, formatar(b.data), b.observacoes || "-"])} />
          )}
        </Secao>

        <p className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          Documento gerado pelo CuidaPet — não substitui a orientação de um médico veterinário.
        </p>
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{rotulo}</dt>
      <dd className="text-slate-800">{valor || "-"}</dd>
    </div>
  );
}

function Secao({ titulo, vazio, children }) {
  const temConteudo = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <div className="mt-7">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-marca-700">{titulo}</h3>
      {temConteudo ? children : <p className="text-sm text-slate-400">{vazio}</p>}
    </div>
  );
}

function Tabela({ colunas, linhas }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
          {colunas.map((c) => <th key={c} className="py-2 pr-4">{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l, i) => (
          <tr key={i} className="border-b border-slate-100">
            {l.map((celula, j) => <td key={j} className="py-2 pr-4 text-slate-700">{celula}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
