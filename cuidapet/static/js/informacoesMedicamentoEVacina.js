document.addEventListener("DOMContentLoaded", function () {
  const listaPets = document.querySelector(".lista-pets");
  const mensagemVazia = document.querySelector(".mensagem-vazia");
  const petInfo = document.querySelector(".pet-info");
  const linha = document.querySelector(".bloco-linha");

  const pets = {
    BOB: {
      ultimoMedicamento: { nome: "Vermífugo", data: "10/04/2025" },
      ultimaVacina: { nome: "V10", data: "20/03/2025" },
    },
    Mel: {
      ultimoMedicamento: { nome: "Antipulgas", data: "12/04/2025" },
      ultimaVacina: { nome: "Antirrábica", data: "25/03/2025" },
    },
  };

  const nomesPets = Object.keys(pets);
  if (nomesPets.length > 0) {
    nomesPets.forEach((nome) => {
      const li = document.createElement("li");
      li.innerHTML = `<h2>${nome}</h2>`;
      listaPets.appendChild(li);

      li.addEventListener("click", function () {
        document
          .querySelectorAll(".lista-pets li")
          .forEach((li) => li.classList.remove("selected"));
        li.classList.add("selected");

        const pet = pets[nome];
        document.getElementById("nome_pet").textContent = nome;
        document.getElementById("medicamento_pet").textContent =
          pet.ultimoMedicamento?.nome || "Não registrado";
        document.getElementById("data_medicamento").textContent =
          pet.ultimoMedicamento?.data || "-";
        document.getElementById("vacina_pet").textContent =
          pet.ultimaVacina?.nome || "Não registrada";
        document.getElementById("data_vacina").textContent =
          pet.ultimaVacina?.data || "-";

        petInfo.style.display = "block";
      });
    });

    listaPets.style.display = "flex";
    mensagemVazia.style.display = "none";
  } else {
    linha.style.display = "block";
    listaPets.style.display = "none";
    mensagemVazia.style.display = "block";
  }
});
