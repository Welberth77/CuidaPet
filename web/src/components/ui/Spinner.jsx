export default function Spinner({ size = 28, className = "" }) {
  return (
    <span
      className={"inline-block animate-spin rounded-full border-marca-500/30 border-t-marca-500 " + className}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      role="status"
      aria-label="Carregando"
    />
  );
}

export function TelaCarregando({ texto = "Carregando..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-marca-500 dark:text-marca-300">
      <Spinner size={34} />
      <p className="text-sm">{texto}</p>
    </div>
  );
}
