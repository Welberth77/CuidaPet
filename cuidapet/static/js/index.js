function logar() {
    // Obtém os valores dos campos de e-mail e senha
    var email = document.getElementById('e-mail').value.trim();
    var senha = document.getElementById('senha').value.trim();

    // Validação dos campos de e-mail e senha
    if (email === '' || senha === '') {
        alert('Por favor, preencha todos os campos.');
        return; // Sai da função se algum campo estiver vazio
    }

    // Verifica se o e-mail e senha são iguais aos valores esperados
    if (email === 'admin@gmail.com' && senha === 'admin') {
        alert('Login realizado com sucesso!');
        // Redireciona para a página principal
        window.location.href = "./cuidapet/templates/pagina_principal/pagina_principal.html";
    } else {
        alert('Usuário ou senha incorretos!');
    }
}


// PÁGINA MEUS PETS && PÁGINA BANHO E TOSA

// Lista dinâmica para a lista de pets
// Se existir pets cadastrados ele mostra o bloco
// Se não existir pets cadastrados ele oculta a lista
document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");
    const linha = document.querySelector(".bloco-linha");

    // Simulação de um banco de dados de pets
    const pets = {
        Bob: { idade: "4 anos", raca: "Vira lata", ultimo_banho: "02/03/2025", vacina: "Em dia" },
        Marley: { idade: "9 anos", raca: "Labrador", ultimo_banho: "02/03/2025", vacina: "Em dia" },
        Rex: { idade: "3 anos", raca: "Labrador", ultimo_banho: "15/02/2025", vacina: "Em dia" },
        Thor: { idade: "2 anos", raca: "Poodle", ultimo_banho: "20/02/2025", vacina: "Atrasada" }
    };

    // Verifica se há pets cadastrados
    if (listaPets.children.length > 0) {
        listaPets.style.display = "flex";
        mensagemVazia.style.display = "none";
    } else {
        listaPets.style.display = "none";
        mensagemVazia.style.display = "block";
        linha.style.display = "block";
    }

    // Evento de clique para cada pet
    document.querySelectorAll(".lista-pets li").forEach((item) => {
        item.addEventListener("click", function () {
            // Remove a seleção dos outros pets
            document.querySelectorAll(".lista-pets li").forEach(li => li.classList.remove("selected"));

            // Adiciona a classe 'selected' ao pet clicado
            item.classList.add("selected");

            // Captura o nome do pet e exibe as informações
            const nomePet = item.textContent.trim();
            if (pets[nomePet]) {
                // Atualiza os elementos existentes no HTML
                document.getElementById("nome_pet").textContent = nomePet;
                document.getElementById("idade_pet").textContent = pets[nomePet].idade;
                document.getElementById("raca_pet").textContent = pets[nomePet].raca;
                document.getElementById("ultimo_banho").textContent = pets[nomePet].ultimo_banho;
                document.getElementById("vacina_pet").textContent = pets[nomePet].vacina;

                // Exibe a div pet-info
                petInfo.style.display = "block";
            }
        });
    });
});
