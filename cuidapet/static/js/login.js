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
