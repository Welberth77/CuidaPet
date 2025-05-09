// Validações para cadastrar pet
// Recebendo ids
const formulario = document.getElementById("interacao-usuario");
const nomePet = document.getElementById("nomePet");
const racaPet = document.getElementById("racaPet");
const pesoPet = document.getElementById("pesoPet");
const nascimentoPet = document.getElementById("nascimentoPet");
const corPelagem = document.getElementById("corPelagem");

// Submit do formulario
formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Chamando verificação
    checkNomePet();
});


// Verificando nome do pet
function checkNomePet() {
    const nomPetValue = nomePet.value;

    if (nomePet == "") {
        errorInput(nomePet);
    } else {
        const formularioitem = nomePet.parentElement;
        formularioitem.className = "input-item";
    }
}


// Erro de input, deixa apenas a borda vermelha
function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "input-item error";
}