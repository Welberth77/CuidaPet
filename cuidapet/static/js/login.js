async function logar() {
  const email = document.getElementById("e-mail").value.toLowerCase();
  const password = document.getElementById("senha").value;

  const response = await fetch("http://localhost:3200/auth/autenticar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href =
      "./cuidapet/templates/pagina_principal/pagina_principal.html";
  } else {
    alert(data.message || "Falha ao fazer login");
  }
}

function toggleSenha(idCampo, btn) {
  const campo = document.getElementById(idCampo);
  const mostrar = campo.type === "password";

  campo.type = mostrar ? "text" : "password";
  btn.innerHTML = mostrar
    ? "👁️‍🗨️" //'<img src="../css/imagens/olho-de-perto.png" alt="Ocultar senha" style="width: 20px;">'
    : "😑"; //'<img src="../css/images/olho-fechado.png" alt="Mostrar senha" style="width: 20px;">';
}
