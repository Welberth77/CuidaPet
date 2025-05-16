// Validações para cadastrar pet
// Recebendo ids
const formulario = document.getElementById("interacao-usuario");
const nomePet = document.getElementById("nomePet");
const especiePet = document.getElementById("especiePet"); // Select
const racaPet = document.getElementById("racaPet"); // Select
const sexoPet = document.getElementById("sexoPet"); // Select
const pesoPet = document.getElementById("pesoPet");
const nascimentoPet = document.getElementById("nascimentoPet");
const corPelagem = document.getElementById("corPelagem"); //Select dinâmico
const pelagemPet = document.getElementById("pelagemPet");

// Submit do formulario
formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Chamando verificação do formulário
    checkformulario();
});


// Verificando nome do pet
function checkNomePet() {
    const nomePetValue = nomePet.value;

    if (nomePetValue === "") {
        errorInput(nomePet);
    } else {
        const formularioitem = nomePet.parentElement;
        formularioitem.className = "input-item";
    }
}


// Verificação Espécie Pet
function checkEspeciePet() {
    const especiePetValue = especiePet.value;

    if (especiePetValue === "") {
        errorInput(especiePet);
    } else {
        const formularioItem = especiePet.parentElement;
        formularioItem.className = "input-item";
    }
}


// Verificação da raça do pet
function checkRacaPet() {
    const racaPetValue = racaPet.value;

    if (racaPetValue === "") {
        errorInput(racaPet);
    } else {
        const formularioItem = racaPet.parentElement;
        formularioItem.className = "input-item";
    }
}


// Verificação do sexo do pet
function checkSexoPet() {
    const sexoPetValue = sexoPet.value;

    if (sexoPetValue === "") {
        errorInput(sexoPet);
    } else {
        const formularioItem = sexoPet.parentElement;
        formularioItem.className = "input-item";
    }
}


// Verificação peso do pet
function checkPesoPet() {
// Obtém o valor do campo de peso, removendo espaços em branco
    const pesoPetValue = pesoPet.value.trim();

    // Converte o valor para número inteiro
    const pesoNumber = parseInt(pesoPetValue, 10);

    // Verifica se o campo está vazio
    if (pesoPetValue === "") {
        errorInput(pesoPet); 
    }
    // Verifica se o valor não é um número válido
    else if (isNaN(pesoNumber)) {
        errorInput(pesoPet); 
    }
    // Verifica se o valor é menor que 1 (fora do limite mínimo)
    else if (pesoNumber < 1) {
        errorInput(pesoPet); 
    }
    // Verifica se o valor é maior que 99 (fora do limite de dois dígitos)
    else if (pesoNumber > 99) {
        errorInput(pesoPet);
    }
    // Caso todas as verificações passem, remove o erro
    else {
        const formularioItem = pesoPet.parentElement;
        formularioItem.className = "input-item"; // Restaura o estilo normal
    }
}


// Verificação da data de nascimento do pet
function checkNascimentoPet() {
    // Recebendo valor como string
    const nascimentoPetValueString = nascimentoPet.value;

    // Verifica se está vazio
    if (nascimentoPetValueString === "") {
        errorInput(nascimentoPet);
        return
    }

    // Transforma o valor em um objeto date
    const nascimentoPetValueData = new Date(nascimentoPet.value);
    const dataAtual = new Date();

    // Descosiderar horas e minutos 
    dataAtual.setHours(0, 0, 0, 0);

    // Verifica se a data é maior do que a data atual
    if (nascimentoPetValueData > dataAtual) {
        errorInput(nascimentoPet);
    } else {
        const formularioItem = nascimentoPet.parentElement;
        formularioItem.className = "input-item";
    }
}


// Verificação da cor da pelagem do pet
function checkCorPelagem() {
    const corPelagemValue = corPelagem.value;

    if (corPelagemValue === "") {
        errorInput(corPelagem);
    } else {
        const formularioItem = corPelagem.parentElement;
        formularioItem.className = "input-item";
    }
}


// Verificação do tamanho da pelagem do pet
function checkPelagemPet() {
    const pelagemPetValue = pelagemPet.value;

    if (pelagemPetValue === "") {
        errorInput(pelagemPet);
    } else {
        const formularioItem = pelagemPet.parentElement;
        formularioItem.className = "input-item";
    }
}

// Verificação do formulário por completo
function checkformulario() {
    // Chamando as verificações
    checkNomePet();
    checkEspeciePet();
    checkRacaPet();
    checkSexoPet();
    checkPesoPet();
    checkNascimentoPet();
    checkCorPelagem();
    checkPelagemPet();

    // Pega todas as divs que tem a classe "input-item"
    const formularioItems = document.querySelectorAll(".input-item");
    // Verifica se todos os elementos possuem essa classe
    const isValido = [...formularioItems].every( (item) => {
        // Se todos elemento tiver essa classe  
        return item.className === "input-item";
    })

    if (isValido) {
        alert("Cadastrado com sucesso!");
    }
}


// Erro de input, deixa apenas a borda vermelha
function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "input-item error";
}


// Função chamada quando o usuário seleciona a espécie do pet
function atualizarCores() {
    // Obtém o valor selecionado no <select> de espécie
    const especiePetValue = document.getElementById("especiePet").value;

    // Seleciona os <select>s de cor da pelagem e de raça
    const corSelect = document.getElementById("corPelagem");
    const racaSelect = document.getElementById("racaPet");

    // ========== Atualização das Cores da Pelagem ==========

    // Limpa as opções anteriores do <select> de cor
    corSelect.innerHTML = "";

    // Cria e adiciona a opção padrão inicial
    const corDefault = document.createElement("option");
    corDefault.value = "";
    corDefault.disabled = true;
    corDefault.selected = true;
    corDefault.textContent = "Selecione a cor";
    corSelect.appendChild(corDefault);

    // Define lista de cores de acordo com a espécie
    let cores = [];
    if (especiePetValue === "cachorro") {
        cores = [
        "Caramelo", "Preto", "Branco", "Marrom", "Cinza",
        "Bege", "Preto e branco", "Marrom e branco",
        "Tricolor", "Tigrado", "Dourado", "Fígado", "Não possui"
        ];
    } else if (especiePetValue === "gato") {
        cores = [
        "Preto", "Branco", "Cinza", "Ruivo (Laranja)", "Marrom",
        "Tigrado", "Calico (Tricolor)", "Tortoiseshell (Casco de tartaruga)",
        "Preto e branco", "Colorpoint (tipo siamês)", "Não possui"
        ];
    }

    // Adiciona cada cor como uma <option> no select de pelagem
    cores.forEach(cor => {
        const option = document.createElement("option");
        option.value = cor.toLowerCase();   // valor usado no formulário
        option.textContent = cor;           // texto visível ao usuário
        corSelect.appendChild(option);
    });

    // Habilita o <select> de cor da pelagem (caso estivesse desabilitado)
    corSelect.disabled = false;

    // ========== Atualização das Raças ==========

    // Limpa as opções anteriores do <select> de raça
    racaSelect.innerHTML = "";

    // Cria e adiciona a opção padrão inicial
    const racaDefault = document.createElement("option");
    racaDefault.value = "";
    racaDefault.disabled = true;
    racaDefault.selected = true;
    racaDefault.textContent = "Selecione a raça do pet";
    racaSelect.appendChild(racaDefault);

    // Define lista de raças de acordo com a espécie
    let racas = [];
    if (especiePetValue === "cachorro") {
        racas = [
        "Vira-lata", "Labrador Retriever", "Shih Tzu", "Poodle", "Yorkshire Terrier",
        "Pinscher", "Bulldogue Francês", "Golden Retriever", "Chihuahua", "Pastor Alemão",
        "Dachshund (Salsicha)", "Rottweiler", "Pug", "Maltês", "Border Collie"
        ];
    } else if (especiePetValue === "gato") {
        racas = [
        "Vira-lata (SRD)", "Siamês", "Persa", "Maine Coon", "Angorá",
        "Sphynx (Sem pelo)", "Ragdoll", "British Shorthair (Pelo curto inglês)",
        "Bengal", "Exótico (Pelo curto)", "Norueguês da Floresta", "Himalaio"
        ];
    }

    // Adiciona cada raça como uma <option> no select de raça
    racas.forEach(raca => {
        const option = document.createElement("option");
        option.value = raca.toLowerCase();  // valor usado no formulário
        option.textContent = raca;          // texto visível ao usuário
        racaSelect.appendChild(option);
    });

    // Habilita o <select> de raça (caso estivesse desabilitado)
    racaSelect.disabled = false;
}