function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Substitui o estado atual no histórico para evitar o "Voltar"
  window.location.replace("../../../index.html");
}
