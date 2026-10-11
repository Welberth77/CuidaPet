import { useEffect, useRef, useState, useCallback } from "react";

const V = 260;   // tamanho do visor (px)
const OUT = 420; // tamanho da imagem final (px)

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

export default function FotoEditor({ file, onConcluir, onCancelar }) {
  const imgRef = useRef(null);
  const [url, setUrl] = useState("");
  const [nat, setNat] = useState(null); // {w,h}
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const arrasto = useRef(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const limites = useCallback(() => {
    if (!nat) return { dw: V, dh: V, maxX: 0, maxY: 0 };
    const cover = Math.max(V / nat.w, V / nat.h);
    const ds = cover * zoom;
    const dw = nat.w * ds;
    const dh = nat.h * ds;
    return { dw, dh, maxX: Math.max(0, (dw - V) / 2), maxY: Math.max(0, (dh - V) / 2) };
  }, [nat, zoom]);

  useEffect(() => {
    const { maxX, maxY } = limites();
    setOffset((o) => ({ x: clamp(o.x, -maxX, maxX), y: clamp(o.y, -maxY, maxY) }));
  }, [zoom, nat, limites]);

  function onDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onMove(e) {
    if (!arrasto.current) return;
    const { maxX, maxY } = limites();
    const nx = arrasto.current.ox + (e.clientX - arrasto.current.px);
    const ny = arrasto.current.oy + (e.clientY - arrasto.current.py);
    setOffset({ x: clamp(nx, -maxX, maxX), y: clamp(ny, -maxY, maxY) });
  }
  function onUp() { arrasto.current = null; }

  function salvar() {
    if (!nat || !imgRef.current) return;
    const cover = Math.max(V / nat.w, V / nat.h);
    const ds = cover * zoom;
    const sSize = V / ds;
    const sx = nat.w / 2 + (-V / 2 - offset.x) / ds;
    const sy = nat.h / 2 + (-V / 2 - offset.y) / ds;
    const canvas = document.createElement("canvas");
    canvas.width = OUT; canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, OUT, OUT);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const f = new File([blob], "foto.jpg", { type: "image/jpeg" });
      onConcluir(f, URL.createObjectURL(blob));
    }, "image/jpeg", 0.9);
  }

  const { dw, dh } = limites();

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4" onClick={onCancelar}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-suave" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-1 text-lg font-bold text-marca-900">Ajustar foto</h2>
        <p className="mb-4 text-sm text-slate-500">Arraste para posicionar e use o controle para dar zoom.</p>

        <div
          className="relative mx-auto touch-none overflow-hidden rounded-full bg-slate-100 ring-2 ring-marca-500/30"
          style={{ width: V, height: V, cursor: "grab" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {url && (
            <img
              ref={imgRef}
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) => setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
              style={{
                position: "absolute",
                width: dw, height: dh,
                left: V / 2 - dw / 2 + offset.x,
                top: V / 2 - dh / 2 + offset.y,
                maxWidth: "none",
                userSelect: "none",
              }}
            />
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs text-slate-400">Zoom</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-marca-500" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="btn-primario" onClick={salvar}>Usar foto</button>
        </div>
      </div>
    </div>
  );
}
