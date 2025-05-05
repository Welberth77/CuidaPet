// Cadastrar novo usuário
// Recebendo dados do usuário
const form = document.getElementById("form-cadastrar-usuario");
const nome = document.getElementById("nome-completo");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmacaoSenha = document.getElementById("confirma-senha");

// Após clicar no botão de cadastrar
form.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Enviar formulário apenas após as verificações
    checkform();
});


// Verificação do nome 
function checkInputNomeCompleto() {
    const nomeCompletoValue = nome.value;

    // Se o campo estiver vazio
    if (nomeCompletoValue === "") {
        // Mostrar aviso e mostrar a mensagem de erro
        errorInput(nome, "Preencha um nome válido.");
    } else {
        const formItem = nome.parentElement;
        formItem.className = "interacao-usuario-content";
    }
}

// Verificação de email vazio
function checkInputEmail(){
    const emailValue = email.value;

    if (emailValue === "") {
        // Mostra a mensagem de erro
        errorInput(email, "Preencha um email válido.");
    } else {
        const formItem = email.parentElement;
        formItem.className = "interacao-usuario-content";
    }
}

// Verificação de senha vazia e no mínimo 8 caracteres
function checkInputSenha() {
    const senhaValue = senha.value;

    if (senhaValue === "") {
        errorInput(senha, "Preencha uma senha válida.");
    } else if (senhaValue.length < 8) {
        errorInput(senha, "A senha precisa ter no mínimo 8 caracteres.")
    } else {
        const formItem = senha.parentElement;
        formItem.className = "interacao-usuario-content";
    }
}


// Verificação de confirmação de senha
function checkInputConfirmacaoSenha() {
    const senhaValue = senha.value;
    const confirmacaoSenhaValue = confirmacaoSenha.value;

    if (confirmacaoSenhaValue === "") {
        errorInput(confirmacaoSenha, "A confirmação de senha é obrigatória.")
    } else if (confirmacaoSenhaValue !== senhaValue) {
        errorInput(confirmacaoSenha, "As senhas não são iguais.");
    } else {
        const formItem = confirmacaoSenha.parentElement;
        formItem.className = "interacao-usuario-content";
    }
}


function checkform() {
    // Chamando as funções de verificação
    checkInputNomeCompleto();
    checkInputEmail();
    checkInputSenha();
    checkInputConfirmacaoSenha();

    const formItems = form.querySelectorAll(".interacao-usuario-content");
    const isValido = [...formItems].every( (item) => {
        // Se todos elemento tiver essa classe  
        return item.className === "interacao-usuario-content";
    });

    if (isValido) {
        alert("Cadastrado com sucesso!");
    }
}


// Erro de input
function errorInput(input, message) {
    // Pega o item pai do input
    const formItem = input.parentElement;
    // Seleciona a tag <a>
    const textMessage = formItem.querySelector("a");

    // Escreve a mensagem
    textMessage.innerText = message;

    // Adiciona a classe de error
    formItem.className = "interacao-usuario-content error";
}
