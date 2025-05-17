document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");

    // Simulando pets vindos do banco de dados
    const pets = {
        BOB: {
            ultimoBanho: "01/05/2025",
            ultimaTosa: "15/04/2025"
        },
        Mel: {
            ultimoBanho: "05/05/2025",
            ultimaTosa: "20/04/2025"
        }
    };

    const nomesPets = Object.keys(pets);
    if (nomesPets.length > 0) {
        nomesPets.forEach(nome => {
            const li = document.createElement("li");
            li.innerHTML = `<h2>${nome}</h2>`;
            listaPets.appendChild(li);

            li.addEventListener("click", function () {
                document.querySelectorAll(".lista-pets li").forEach(li => li.classList.remove("selected"));
                li.classList.add("selected");

                const pet = pets[nome];
                document.getElementById("nome_pet").textContent = nome;
                document.getElementById("ultimo_banho").textContent = pet.ultimoBanho || "Não registrado";
                document.getElementById("ultima_tosa").textContent = pet.ultimaTosa || "Não registrada";

                petInfo.style.display = "block";
            });
        });

        listaPets.style.display = "flex";
        mensagemVazia.style.display = "none";
    } else {
        listaPets.style.display = "none";
        mensagemVazia.style.display = "block";
    }
});
