// Recebendo valores
const formulario = document.getElementById("interacao-usuario"); 
const selecionarPet = document.getElementById("selecionarPet"); // select
const selecionarCategoria = document.getElementById("selecionarCategoria"); // select
const nomeMedicamentoVacina = document.getElementById("nomeMedicamentoVacina"); // input
const dataMedicamentoVacina = document.getElementById("dataMedicamentoVacina"); // date
const dataProxMedicamentoVacina = document.getElementById("dataProxMedicamentoVacina"); // select

formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Chamando validações
    checkSelecionarPet();
    checkSelecionarCategoria();
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

// Verificação em selecionar categoria
function checkSelecionarCategoria() {
    const selecionarCategoriaValue = selecionarCategoria.value;

    if (selecionarCategoriaValue === ""){
        errorInput(selecionarCategoria);
    } else {
        const formularioItem = selecionarCategoria.parentElement;
        formularioItem.className = "interacao-item"
    }
}


function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "interacao-item error";
}