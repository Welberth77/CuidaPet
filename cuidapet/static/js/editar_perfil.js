async function salvarEdicao() {
  const nome = document.querySelector(".input-nome-completo").value;
  const email = document.querySelector(".input-email").value.toLowerCase();
  const senha = document.querySelector(".input-senha").value;
  const confirmacao = document.querySelector(".input-confirmacao-senha").value;

  if (senha !== confirmacao) {
    alert("As senhas não coincidem");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3200/admin/usuarios/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: nome, email, password: senha }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert("Perfil atualizado!");
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "./perfil_usuario.html";
  } else {
    alert(data.message || "Erro ao atualizar perfil");
  }
}
