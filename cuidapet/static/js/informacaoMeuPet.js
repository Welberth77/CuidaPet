document.addEventListener("DOMContentLoaded", function () {
  const listaPets = document.querySelector(".lista-pets");
  const mensagemVazia = document.querySelector(".mensagem-vazia");
  const petInfo = document.querySelector(".pet-info");
  const editarPet = document.querySelector(".editar-pet");
  const linha = document.querySelector(".bloco-linha");
  const sobreContainer = document.getElementById("sobre_pet_container");

  const token = localStorage.getItem("token");

  fetch("http://localhost:3200/pets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const pets = data.pets;

      if (pets.length > 0) {
        pets.forEach((pet) => {
          const li = document.createElement("li");
          li.innerHTML = `<h2>${pet.nome}</h2>`;
          listaPets.appendChild(li);

          li.addEventListener("click", function () {
            document
              .querySelectorAll(".lista-pets li")
              .forEach((li) => li.classList.remove("selected"));
            li.classList.add("selected");

            document.getElementById("nome_pet").textContent = pet.nome;
            document.getElementById("especie_pet").textContent = pet.especie;
            document.getElementById("raca_pet").textContent = pet.raca;
            document.getElementById("sexo_pet").textContent = pet.sexo;
            document.getElementById("peso_pet").textContent = `${pet.peso} kg`;
            document.getElementById("nascimento_pet").textContent = new Date(
              pet.nascimento
            ).toLocaleDateString("pt-BR");
            document.getElementById("cor_pet").textContent = pet.corPelagem;

            if (pet.sobre && pet.sobre.trim() !== "") {
              document.getElementById("sobre_pet").textContent = pet.sobre;
              sobreContainer.style.display = "block";
            } else {
              sobreContainer.style.display = "none";
            }

            editarPet.style.display = "flex";
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
    })
    .catch((error) => {
      console.error("Erro ao buscar pets:", error);
    });
});
