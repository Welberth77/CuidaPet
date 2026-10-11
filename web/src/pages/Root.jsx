import { useAuth } from "../contexts/AuthContext.jsx";
import Landing from "./Landing.jsx";
import Home from "./Home.jsx";

export default function Root() {
  const { usuario } = useAuth();
  return usuario ? <Home /> : <Landing />;
}
