document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");
    const editarPet = document.querySelector(".editar-pet");
    const linha = document.querySelector(".bloco-linha");
    const sobreContainer = document.getElementById("sobre_pet_container");

    // Simulação de dados dos pets (exemplo de como deve vir do backend)
    const pets = {
        BOB: {
            especie: "Cachorro",
            raca: "Vira-lata",
            sexo: "Macho",
            peso: "10 kg",
            nascimento: "10/01/2021",
            cor: "Marrom",
            sobre: "Muito brincalhão e adora correr no quintal"
        },
        Mel: {
            especie: "Gato",
            raca: "Persa",
            sexo: "Fêmea",
            peso: "4 kg",
            nascimento: "20/05/2022",
            cor: "Branco",
            sobre: "" // campo opcional
        }
    };

    const nomesPets = Object.keys(pets);

    // Se houver pets cadastrados
    if (nomesPets.length > 0) {
        nomesPets.forEach(nome => {
            const li = document.createElement("li");
            li.innerHTML = `<h2>${nome}</h2>`;
            listaPets.appendChild(li);

            // Evento de clique para mostrar as informações do pet
            li.addEventListener("click", function () {
                // Remove destaque de outros itens
                document.querySelectorAll(".lista-pets li").forEach(li => li.classList.remove("selected"));
                li.classList.add("selected");

                const pet = pets[nome];

                // Preenche os dados no painel de informações
                document.getElementById("nome_pet").textContent = nome;
                document.getElementById("especie_pet").textContent = pet.especie;
                document.getElementById("raca_pet").textContent = pet.raca;
                document.getElementById("sexo_pet").textContent = pet.sexo;
                document.getElementById("peso_pet").textContent = pet.peso;
                document.getElementById("nascimento_pet").textContent = pet.nascimento;
                document.getElementById("cor_pet").textContent = pet.cor;

                // Exibe "Sobre o pet" se houver conteúdo
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
    } 
    // Se não houver pets cadastrados
    else {
        linha.style.display = "block";
        listaPets.style.display = "none";
        mensagemVazia.style.display = "block";
    }
});
