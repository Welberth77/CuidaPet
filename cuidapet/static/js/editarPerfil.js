// Recebendo valores
const formulario = document.getElementById("interacao-usuario");
const nomeCompleto = document.getElementById("nomeCompleto");
const senha = document.getElementById("senha");
const confirmacaoSenha = document.getElementById("confirmacaoSenha");

formulario.addEventListener("submit", (event) => {
    // Atualiza apenas quando envia o formulário
    event.preventDefault();

    // Chamando validações
    checkformulario();
})


// Verificação do nome completo
function checkNomeCompleto() {
    const nomeCompletoValue = nomeCompleto.value;

    if (nomeCompletoValue === ""){
        errorInput(nomeCompleto,  "Preencha um nome válido.");
    } else {
        const formularioItem = nomeCompleto.parentElement;
        formularioItem.className = "interacao-item";
    }
}


// Verificação de senha vazia e no mínimo 8 caracteres
function checkSenha() {
    const senhaValue = senha.value;

    if (senhaValue === "") {
        errorInput(senha, "Preencha uma senha válida.");
    } else if (senhaValue.length < 8) {
        errorInput(senha, "A senha precisa ter no mínimo 8 caracteres.")
    } else {
        const formularioItem = senha.parentElement;
        formularioItem.className = "interacao-item";
    }
}


// Verificação de confirmação de senha
function checkConfirmacaoSenha() {
    const senhaValue = senha.value;
    const confirmacaoSenhaValue = confirmacaoSenha.value;

    if (confirmacaoSenhaValue === "") {
        errorInput(confirmacaoSenha, "A confirmação de senha é obrigatória.")
    } else if (confirmacaoSenhaValue !== senhaValue) {
        errorInput(confirmacaoSenha, "As senhas não são iguais.");
    } else {
        const formularioItem = confirmacaoSenha.parentElement;
        formularioItem.className = "interacao-item";
    }
}


// Erro de input
function errorInput(input, message) {
    // Pega o item pai do input
    const formularioItem = input.parentElement;
    // Seleciona a tag <span>
    const textMessage = formularioItem.querySelector("span");

    // Escreve a mensagem
    textMessage.innerText = message;

    // Adiciona a classe de error
    formularioItem.className = "interacao-item error";
}

// Validação do formulário por completo
function checkformulario() {
    // Chamando as funções de verificação
    checkNomeCompleto();
    checkSenha();
    checkConfirmacaoSenha();

    // Seleciona tudo que tenha essa classe
    const formularioItems = formulario.querySelectorAll(".interacao-item");
    const isValido = [...formularioItems].every( (item) => {
        // Se todos elemento tiver essa classe  
        return item.className === "interacao-item";
    });

    if (isValido) {
        alert("Dados atualizados com sucesso!");
    }
}