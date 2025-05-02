// Função de login
function logar(){
    // Pegando o email e senha do usuario
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    console.log(email, senha);

    // Verificando email e senha
    if (email == "admin@gmail.com" && senha == "admin") {
        alert("Login realizado com sucesso!");
        window.location.href = "./cuidapet/templates/pagina_principal/pagina_principal.html";
    } else {
        alert("Email ou senha incorretos");
    };
};


// Lista de usuários cadastrados
// let usuarios = [];

// Recuperar a lista do localStorage ou criar nova
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


// Função de cadastrar usuário
function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Pegando todos os dados do usuário
    let nomeCompleto = document.getElementById("nome-completo").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let confirmacaoSenha = document.getElementById("confirma-senha").value;

    if (senha !== confirmacaoSenha)
    {
        alert("Senha e confirmação de senha não estão iguais!");
        return;
    }

    // Criando objeto do usuário de forma organizada
    let novoUsuario = {
        nome: nomeCompleto,
        email: email,
        senha: senha // (obs: em um sistema real, nunca armazene senha em texto plano)
    };

    // Adicionando à lista
    usuarios.push(novoUsuario);
    console.log("usuario adicionado a lista");

    // Salvar no localstorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Redirecionando para a página de login
    alert("Usuário cadastrado com sucesso!");
    console.log("Redirecionando...");
    window.location.href = "../../../index.html";
};


  

document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");
    const linha = document.querySelector(".bloco-linha");
    const registrarBanho = document.querySelector(".cadastrar-novo-pet");
    const registrarMedicamento = document.querySelector(".registrar-novo-medicamento");

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
        if (registrarBanho) registrarBanho.style.display = "flex";
        if (registrarMedicamento) registrarMedicamento.style.display = "flex"; 
        mensagemVazia.style.display = "none";
    } else {
        listaPets.style.display = "none";
        if (registrarBanho) registrarBanho.style.display = "none";
        if (registrarMedicamento) registrarMedicamento.style.display = "none"; 
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