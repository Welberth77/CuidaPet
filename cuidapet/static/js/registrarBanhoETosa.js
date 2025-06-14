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
    checkformulario();
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

// Verificalção no select do serviço
function checkSelecionarServico() {
    const selecionarServicoValue = selecionarServico.value;

    if (selecionarServicoValue === "") {
        errorInput(selecionarServico);
    } else {
        // Voltando a classe para a forma normal
        const formularioItem = selecionarServico.parentElement;
        formularioItem.className = "interacao-item";
    }
}

// Verificação da data do banho e tosa
function checkData() {
    // Recebendo valor no tipo string
    const dataNovoBanhoValue = dataNovoBanho.value;

    // Verificando se está vazio
    if (dataNovoBanhoValue === "") {
        errorInput(dataNovoBanho);
        return
    }

    // Tranformando no formato de data
    const dataNovoBanhoValueData = new Date(dataNovoBanho.value);
    // Data atual do usuário
    const dataAtual = new Date();

    // Descosiderar horas e minutos 
    dataAtual.setHours(0, 0, 0, 0);

    // Verificando se a data é maio que a atual
    if (dataNovoBanhoValueData > dataAtual) {
        errorInput(dataNovoBanho);
    } else {
        // Voltando a classe para a forma normal
        const formularioItem = dataNovoBanho.parentElement;
        formularioItem.className = "interacao-item";
    }
}

// Verificação data do próximo banho
function checkDataProximoBanho() {
    const dataProximoBanhoValue = dataProximoBanho.value;

    if (dataProximoBanhoValue === "") {
        errorInput(dataProximoBanho);
    } else {
        // Voltando a classe para a forma normal
        const formularioItem = dataProximoBanho.parentElement;
        formularioItem.className = "interacao-item"
    }
}


// Erro na entrada do usuário
function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "interacao-item error";
}


// Verificação do formulário por completo
function checkformulario() {
    // Chamando as verificações
    checkSelecionarPet();
    checkSelecionarServico();
    checkData();
    checkDataProximoBanho();


    // Pega todas as divs que tem a classe "input-item"
    const formularioItems = document.querySelectorAll(".interacao-item");
    // Verifica se todos os elementos possuem essa classe
    const isValido = [...formularioItems].every( (item) => {
        // Se todos elemento tiver essa classe  
        return item.className === "interacao-item";
    })

    if (isValido) {
        alert("Salvo com sucesso!");
    }
}
