document.addEventListener("DOMContentLoaded", function () {
  const listaPets = document.querySelector(".lista-pets");
  const mensagemVazia = document.querySelector(".mensagem-vazia");
  const petInfo = document.querySelector(".pet-info");
  const linha = document.querySelector(".bloco-linha");

  // Recupera o token do localStorage
  const token = localStorage.getItem("token");

  // Verifica se o token existe
  if (!token) {
    alert("Você precisa estar autenticado para acessar essa funcionalidade.");
    return;
  }

  // Fetch para obter a lista de pets com o token de autenticação
  fetch("http://localhost:3200/pets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Envia o token no cabeçalho da requisição
    },
  })
    .then((response) => response.json())
    .then((pets) => {
      console.log("Pets recebidos:", pets); // Added log to show pets data

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

            // Exibe as informações do pet
            document.getElementById("nome_pet").textContent = pet.nome;

            // Buscar e exibir medicamentos e vacinas do pet
            fetch(
              `http://localhost:3200/pets/${pet.nome}/medicamentos-vacinas`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`, // Envia o token para a segunda requisição
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log("Medicamentos e vacinas recebidos:", data); // Added log for this data
                document.getElementById("medicamento_pet").textContent =
                  data.length > 0 ? data[0].nome : "Não registrado";
                document.getElementById("data_medicamento").textContent =
                  data.length > 0 ? data[0].data : "-";
                document.getElementById("vacina_pet").textContent =
                  data.length > 1 ? data[1].nome : "Não registrada";
                document.getElementById("data_vacina").textContent =
                  data.length > 1 ? data[1].data : "-";
              })
              .catch((error) =>
                console.log("Erro ao buscar medicamentos e vacinas", error)
              );

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
    .catch((error) => console.log("Erro ao buscar pets:", error));
});
