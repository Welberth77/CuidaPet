// Recebendo valores
const formulario = document.getElementById("interacao-usuario");
const selecionarPet = document.getElementById("selecionarPet"); // select
const selecionarCategoria = document.getElementById("selecionarCategoria"); // select
const nomeMedicamentoVacina = document.getElementById("nomeMedicamentoVacina"); // input
const dataMedicamentoVacina = document.getElementById("dataMedicamentoVacina"); // date
const dataProxMedicamentoVacina = document.getElementById(
  "dataProxMedicamentoVacina"
); // select

formulario.addEventListener("submit", (event) => {
  // So atualiza a página quando o botão for clicado
  event.preventDefault();

  // Chamando validações
  checkformulario();
});

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

  if (selecionarCategoriaValue === "") {
    errorInput(selecionarCategoria);
  } else {
    const formularioItem = selecionarCategoria.parentElement;
    formularioItem.className = "interacao-item";
  }
}

// Verificação no nome do medicamento ou vacina
function checkNomeMedicamentoVacina() {
  const nomeMedicamentoVacinaValue = nomeMedicamentoVacina.value;

  if (nomeMedicamentoVacinaValue === "") {
    errorInput(nomeMedicamentoVacina);
  } else {
    const formularioItem = nomeMedicamentoVacina.parentElement;
    formularioItem.className = "interacao-item";
  }
}

// Verificação da data do medicamento
function checkDataMedicamentoVacina() {
  // Recebendo valor como string
  const dataMedicamentoVacinaValue = dataMedicamentoVacina.value;

  if (dataMedicamentoVacinaValue === "") {
    errorInput(dataMedicamentoVacina);
    return;
  }

  // Recebendo como date
  const dataMedicamentoVacinaValueDate = new Date(dataMedicamentoVacina.value);
  const dataAtual = new Date();

  dataAtual.setHours(0, 0, 0, 0);

  if (dataMedicamentoVacinaValueDate > dataAtual) {
    errorInput(dataMedicamentoVacina);
  } else {
    const formularioItem = dataMedicamentoVacina.parentElement;
    formularioItem.className = "interacao-item";
  }
}

// Verificação do próximo banho
function checkDataProxMedicamentoVacina() {
  const dataProxMedicamentoVacinaValue = dataProxMedicamentoVacina.value;

  if (dataProxMedicamentoVacinaValue === "") {
    errorInput(dataProxMedicamentoVacina);
  } else {
    const formularioItem = dataProxMedicamentoVacina.parentElement;
    formularioItem.className = "interacao-item";
  }
}

function errorInput(input) {
  // Pega o elemento pai do input
  const formularioItem = input.parentElement;

  formularioItem.className = "interacao-item error";
}

// Verificação do formulário por completo
function checkformulario() {
  // Chamando as verificações
  checkSelecionarPet();
  checkSelecionarCategoria();
  checkNomeMedicamentoVacina();
  checkDataMedicamentoVacina();
  checkDataProxMedicamentoVacina();

  // Pega todas as divs que tem a classe "input-item"
  const formularioItems = document.querySelectorAll(".interacao-item");
  // Verifica se todos os elementos possuem essa classe
  const isValido = [...formularioItems].every((item) => {
    // Se todos elemento tiver essa classe
    return item.className === "interacao-item";
  });

  if (isValido) {
    alert("Salvo com sucesso!");
  }
}
