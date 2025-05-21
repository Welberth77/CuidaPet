function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../../index.html"; // Redireciona para a página de login
}
