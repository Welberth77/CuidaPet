async function salvarEdicao() {
  const nome = document.querySelector(".input-nome-completo").value;
  const senha = document.querySelector(".input-senha").value;
  const confirmacao = document.querySelector(".input-confirmacao-senha").value;

  if (senha !== confirmacao) {
    alert("As senhas não coincidem");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const body = {
    name: nome,
  };

  if (senha.trim() !== "") {
    body.password = senha;
  }

  const response = await fetch(
    `http://localhost:3200/admin/usuarios/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert("Perfil atualizado!");
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href =
      "../../templates/perfil_usuario/perfil_usuario.htmll";
  } else {
    alert(data.message || "Erro ao atualizar perfil");
  }
}
