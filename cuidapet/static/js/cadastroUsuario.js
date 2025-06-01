const { link } = require("fs");

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
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  if (nome.value === "" || !nomeRegex.test(nome.value)) {
    errorInput(nome, "O nome deve conter apenas letras.");
  } else {
    nome.parentElement.className = "interacao-usuario-content";
  }
}

function checkInputEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const dominiosPermitidos = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "unit.com.br",
  ];
  const dominio = email.value.split("@")[1];

  if (
    email.value === "" ||
    !emailRegex.test(email.value) ||
    !dominiosPermitidos.includes(dominio)
  ) {
    errorInput(email, "Use um e-mail válido (ex: gmail.com, hotmail.com)");
  } else {
    email.parentElement.className = "interacao-usuario-content";
  }
}

function checkInputSenha(senha) {
  if (senha.value === "") {
    errorInput(senha, "Preencha uma senha válida.");
  } else if (senha.value.length < 8) {
    errorInput(senha, "A senha precisa ter no mínimo 8 caracteres.");
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
