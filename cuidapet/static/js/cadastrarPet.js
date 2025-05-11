// Validações para cadastrar pet
// Recebendo ids
const formulario = document.getElementById("interacao-usuario");
const nomePet = document.getElementById("nomePet");
const especiePet = document.getElementById("especiePet"); // Select
const racaPet = document.getElementById("racaPet");
const sexoPet = document.getElementById("sexoPet"); // Select
const pesoPet = document.getElementById("pesoPet");
const nascimentoPet = document.getElementById("nascimentoPet");
const corPelagem = document.getElementById("corPelagem"); //Select dinâmico
const pelagemPet = document.getElementById("pelagemPet");

// Submit do formulario
formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Chamando verificação
    checkNomePet();
    checkEspeciePet();
    checkRacaPet();
    checkSexoPet();
    checkPesoPet();
    checkNascimentoPet();
    checkCorPelagem();
    checkPelagemPet();
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
        const formularioItem = nomePet.parentElement;
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
    const pesoPetValue = pesoPet.value;

    if (pesoPetValue === "") {
        errorInput(pesoPet);
    } else {
        const formularioItem = pesoPet.parentElement;
        formularioItem.className = "input-item";
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


// Erro de input, deixa apenas a borda vermelha
function errorInput(input) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;

    formularioItem.className = "input-item error";
}


// Função que atualiza a lista de cores de pelagem com base na espécie escolhida
function atualizarCores() {
  // Pega o valor da espécie escolhida (cachorro ou gato)
  const especiePetValue = especiePet.value;

  // Seleciona o <select> da cor da pelagem
  const corSelect = document.getElementById("corPelagem");

  // Limpa qualquer opção anterior no select de pelagem
  corSelect.innerHTML = "";

  // Adiciona uma opção padrão inicial
  const opcoesDefault = document.createElement("option");
  opcoesDefault.value = "";
  opcoesDefault.disabled = true;
  opcoesDefault.selected = true;
  opcoesDefault.textContent = "Selecione a cor";
  corSelect.appendChild(opcoesDefault);

  // Lista de opções de pelagem, inicialmente vazia
  let opcoes = [];

  // Se for cachorro, define as cores possíveis para cachorros
  if (especiePetValue === "cachorro") {
    opcoes = [
      "Caramelo", "Preto", "Branco", "Marrom", "Cinza",
      "Bege", "Preto e branco", "Marrom e branco",
      "Tricolor", "Tigrado", "Dourado", "Fígado"
    ];
  }
  // Se for gato, define as cores possíveis para gatos
  else if (especiePetValue === "gato") {
    opcoes = [
      "Preto", "Branco", "Cinza", "Ruivo (Laranja)", "Marrom",
      "Tigrado", "Calico (Tricolor)", "Tortoiseshell (Casco de tartaruga)",
      "Preto e branco", "Colorpoint (tipo siamês)"
    ];
  }

  // Para cada cor da lista, cria uma <option> e adiciona no select
  opcoes.forEach(cor => {
    const option = document.createElement("option");
    option.value = cor.toLowerCase();  // valor em minúsculo
    option.textContent = cor;          // texto visível
    corSelect.appendChild(option);     // adiciona no <select>
  });

  // Ativa o select da cor (antes estava desabilitado)
  corSelect.disabled = false;
}