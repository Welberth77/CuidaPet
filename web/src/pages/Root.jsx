import { lazy } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const Landing = lazy(() => import("./Landing.jsx"));
const Home = lazy(() => import("./Home.jsx"));

export default function Root() {
  const { usuario } = useAuth();
  return usuario ? <Home /> : <Landing />;
}
