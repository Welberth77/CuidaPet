import { useEffect } from "react";
import { createPortal } from "react-dom";

// Mostra uma imagem em tela cheia. Fecha no clique fora, no botao ou com Esc.
export default function Lightbox({ src, alt = "Foto do pet", onFechar }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onFechar(); }
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [onFechar]);

  return createPortal(
    <div
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      style={{ animation: "popar 0.15s ease-out" }}
    >
      <button
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-colors hover:bg-white/20"
      >
        &times;
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="aspect-square overflow-hidden rounded-full ring-4 ring-white/90 shadow-2xl"
        style={{ width: "min(85vw, 85vh)", height: "min(85vw, 85vh)" }}
      >
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>,
    document.body
  );
}
