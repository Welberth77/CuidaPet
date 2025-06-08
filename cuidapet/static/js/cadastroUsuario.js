const form = document.getElementById("form-cadastrar-usuario");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  checkform();
});

function checkform() {
  const nome = document.querySelector(".input-nome-completo");
  const email = document.querySelector(".input-e-mail");
  const senha = document.querySelector(".input-senha");
  const confirmacaoSenha = document.querySelector(".input-confirmacao-senha");

  checkInputNomeCompleto(nome);
  checkInputEmail(email);
  checkInputSenha(senha);
  checkInputConfirmacaoSenha(senha, confirmacaoSenha);

  const formItems = form.querySelectorAll(".interacao-usuario-content");
  const isValido = [...formItems].every(
    (item) => item.className === "interacao-usuario-content"
  );

  if (isValido) {
    const userData = {
      name: nome.value,
      email: email.value.toLowerCase(),
      password: senha.value,
    };

    fetch("http://localhost:3200/auth/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao registrar.");
        alert("Usuário cadastrado com sucesso!");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        window.location.href =
          "../../templates/pagina_principal/pagina_principal.html";
      })
      .catch((error) => {
        alert(`Erro: ${error.message}`);
      });
  }
}
function checkInputNomeCompleto(nome) {
  const nomeValue = nome.value;

  // Verifica se começa com espaço
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
    nome.parentElement.className = "interacao-usuario-content";
  }
}

function checkInputEmail(email) {
  const emailRegex = /^[^\s@]{5,}@[^\s@]+\.[a-zA-Z]{2,}$/;

  const dominiosPermitidos = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "unit.com.br",
  ];

  const emailValue = email.value.trim();
  const partesEmail = emailValue.split("@");
  const prefixo = partesEmail[0] || "";
  const dominio = partesEmail[1];

  if (emailValue === "") {
    errorInput(email, "O e-mail é obrigatório.");
  } else if (emailValue.length < 5) {
    errorInput(email, "O e-mail deve ter no mínimo 5 caracteres.");
  } else if (!/[a-zA-Z]/.test(prefixo)) {
    errorInput(email, "O e-mail deve conter pelo menos uma letra antes do @.");
  } else if (!emailRegex.test(emailValue)) {
    errorInput(email, "Formato de e-mail inválido.");
  } else if (!dominiosPermitidos.includes(dominio)) {
    errorInput(email, "Use um e-mail válido (ex: gmail.com, hotmail.com)");
  } else {
    email.parentElement.className = "interacao-usuario-content";
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
    senha.parentElement.className = "interacao-usuario-content";
  }
}

function checkInputConfirmacaoSenha(senha, confirmacaoSenha) {
  if (confirmacaoSenha.value === "") {
    errorInput(confirmacaoSenha, "A confirmação de senha é obrigatória.");
  } else if (confirmacaoSenha.value !== senha.value) {
    errorInput(confirmacaoSenha, "As senhas não são iguais.");
  } else {
    confirmacaoSenha.parentElement.className = "interacao-usuario-content";
  }
}

function errorInput(input, message) {
  const formItem = input.parentElement;
  const textMessage =
    formItem.querySelector("a") || formItem.querySelector("span");
  if (textMessage) textMessage.innerText = message;
  formItem.className = "interacao-usuario-content error";
}

//function toggleSenha(idCampo, btn) {
//const campo = document.getElementById(idCampo);
//const mostrar = campo.type === "password";

//campo.type = mostrar ? "text" : "password";
//btn.textContent = mostrar ? "🙈" : "👁️";}
