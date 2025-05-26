// auth_guard.js
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../../../index.html"; // redireciona para login
  }
})();
