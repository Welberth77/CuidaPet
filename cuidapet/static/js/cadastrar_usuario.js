async function cadastrar() {
  const nome = document.querySelector(".input-nome-completo").value;
  const email = document.querySelector(".input-e-mail").value.toLowerCase();
  const senha = document.querySelector(".input-senha").value;
  const confirmacao = document.querySelector(".input-confirmacao-senha").value;

  if (senha !== confirmacao) {
    alert("As senhas não coincidem!");
    return;
  }

  const response = await fetch("http://localhost:3200/auth/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nome,
      email: email,
      password: senha,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Usuário cadastrado com sucesso!");
    window.location.href = "../../../index.html";
  } else {
    alert(data.message || "Erro ao cadastrar usuário.");
  }
}
