async function salvarEdicao() {
  const nome = document.querySelector(".input-nome-completo");
  const email = document.querySelector(".input-email");
  const senha = document.querySelector(".input-senha");
  const confirmacao = document.querySelector(".input-confirmacao-senha");

  // Validação dos campos
  checkInputNomeCompleto(nome);
  checkInputEmail(email);
  checkInputSenha(senha);
  checkInputConfirmacaoSenha(senha, confirmacao);

  const formItems = document.querySelectorAll(".interacao-item");
  const isValido = [...formItems].every(
    (item) => item.className === "interacao-item"
  );

  if (isValido) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Criamos o objeto 'body' com nome e e-mail obrigatórios
    const body = { name: nome.value, email: email.value };

    // Verifica se o campo de senha não está vazio. Se estiver, mantemos a senha antiga
    if (senha.value.trim() !== "") {
      body.password = senha.value;
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
      alert(
        "Perfil atualizado com sucesso!\nPor segurança, você será desconectado."
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "../../../index.html"; // Redirecionamento para a tela de login
    } else {
      alert(data.message || "Erro ao atualizar perfil");
    }
  }
}

function checkInputNomeCompleto(nome) {
  const nomeValue = nome.value;

  if (/^\s/.test(nomeValue)) {
    errorInput(nome, "Não é permitido espaço no início do nome.");
    return;
  }

  const nomeSemEspacosExtras = nomeValue.trim();
  const partesNome = nomeSemEspacosExtras.split(/\s+/).filter(Boolean);

  if (nomeSemEspacosExtras === "") {
    errorInput(nome, "O nome é obrigatório.");
  } else if (/\s{2,}/.test(nomeValue)) {
    errorInput(nome, "Não use múltiplos espaços em sequência.");
  } else if (partesNome.length < 2) {
    errorInput(nome, "Digite pelo menos nome e sobrenome.");
  } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeSemEspacosExtras)) {
    errorInput(nome, "Use apenas letras no nome.");
  } else if (partesNome.some((part) => part.length < 2)) {
    errorInput(nome, "Cada parte do nome deve ter pelo menos 2 letras.");
  } else {
    nome.parentElement.className = "interacao-item";
  }
}

function checkInputEmail(email) {
  const emailRegex = /^[^\s@]{5,}@[^\s@]+\.[a-zA-Z]{2,}$/;
  const emailValue = email.value.trim();

  if (emailValue === "") {
    errorInput(email, "O e-mail é obrigatório.");
  } else if (!emailRegex.test(emailValue)) {
    errorInput(email, "Formato de e-mail inválido.");
  } else {
    email.parentElement.className = "interacao-item";
  }
}

function checkInputSenha(senha) {
  const senhaValue = senha.value;

  if (senhaValue === "") {
    errorInput(senha, "Preencha uma senha válida.");
  } else if (senhaValue.length < 8) {
    errorInput(senha, "Mínimo 8 caracteres.");
  } else if (/\s/.test(senhaValue)) {
    errorInput(senha, "Não pode conter espaços.");
  } else if (!/[A-Z]/.test(senhaValue)) {
    errorInput(senha, "Adicione pelo menos uma letra maiúscula.");
  } else if (!/[a-z]/.test(senhaValue)) {
    errorInput(senha, "Adicione pelo menos uma letra minúscula.");
  } else if (!/[0-9]/.test(senhaValue)) {
    errorInput(senha, "Adicione pelo menos um número.");
  } else {
    senha.parentElement.className = "interacao-item";
  }
}

function checkInputConfirmacaoSenha(senha, confirmacaoSenha) {
  if (confirmacaoSenha.value === "") {
    errorInput(confirmacaoSenha, "A confirmação de senha é obrigatória.");
  } else if (confirmacaoSenha.value !== senha.value) {
    errorInput(confirmacaoSenha, "As senhas não são iguais.");
  } else {
    confirmacaoSenha.parentElement.className = "interacao-item";
  }
}

function errorInput(input, message) {
  const formItem = input.parentElement;
  const textMessage = formItem.querySelector("span");
  if (textMessage) textMessage.innerText = message;
  formItem.className = "interacao-item error";
}

function toggleSenha(id) {
  const campoSenha = document.getElementById(id);
  const tipoCampo = campoSenha.type === "password" ? "text" : "password";
  const textoBotao = tipoCampo === "password" ? "Mostrar" : "Ocultar";

  campoSenha.type = tipoCampo; // Altera o tipo do campo
  const botao = campoSenha.nextElementSibling; // O botão que está ao lado do campo
  botao.textContent = textoBotao; // Altera o texto do botão
}
