// Recebendo valores
const formulario = document.getElementById("interacao-usuario");
const nomeCompleto = document.getElementById("nomeCompleto");
const senha = document.getElementById("senha");
const confirmacaoSenha = document.getElementById("confirmacaoSenha");

formulario.addEventListener("submit", (event) => {
    // Atualiza apenas quando envia o formulário
    event.preventDefault();

    // Chamando validações
    checkNomeCompleto();
})


// Verificação do nome completo
function checkNomeCompleto() {
    const nomeCompletoValue = nomeCompleto.value;

    if (nomeCompletoValue === ""){
        errorInput(nomeCompleto);
    } else {
        const formularioItem = nomeCompleto.parentElement;
        formularioItem.className = "interacao-item";
    }
}

// Erro no input
function errorInput(input) {
    const formularioItem = nomeCompleto.parentElement;
    formularioItem.className = "interacao-item error";
}