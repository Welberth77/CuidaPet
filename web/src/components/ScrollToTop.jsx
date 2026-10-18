import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Rola para o topo sempre que a rota muda.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}
