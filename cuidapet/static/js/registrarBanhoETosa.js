// Recebendo valores
const formulario = document.getElementById("interacao-usuario");
const selecionarPet = document.getElementById("selecionarPet");
const selecionarServico = document.getElementById("selecionarServico");
const dataNovoBanho = document.getElementById("dataNovoBanho");
const dataProximoBanho = document.getElementById("dataProximoBanho");
const observacoes = document.getElementById("observacoes");

// Envio do formulário
formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Checando validações
    checkSelecionarPet();
})


// Verificação no select do pet
function checkSelecionarPet() {
    const selecionarPetValue = selecionarPet.value;

    if (selecionarPetValue === "") {
        errorInput(selecionarPet);
    } else {
        // Voltando a classe para normal
        const formularioItem = selecionarPet.parentElement;
        formularioItem.className = "interacao-item";
    }
}


// Erro na entrada do usuário
function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "interacao-item error";
}