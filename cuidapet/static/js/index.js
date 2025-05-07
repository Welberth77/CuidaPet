// Lista de usuários representados como objetos
const usuarios = [
    {
        email: "admin@admin.com",
        senha: "admin123"
    }
];

// Validações da área de login
// Recebendo variáveis
const formulario = document.getElementById("login-form");
const email = document.getElementById("email");
const senha = document.getElementById("senha");

// Após clicar no botão entrar
formulario.addEventListener("submit", (event) => {
    // So atualiza a página quando o botão for clicado
    event.preventDefault();

    // Chamando verificação
    checkform();
});


// Verificação de email
function checkInputEmail() {
    const emailValue = email.value;

    if (emailValue == "") {
        errorInput(email, "Preencha um email válido.");
    } else {
        const formularioItem = email.parentElement;
        formularioItem.className = "inputs-usuario";
    }
}

// Verificação da senha
function checkInputSenha() {
    const senhaValue = senha.value;

    if (senhaValue == "") {
        errorInput(senha, "Preencha uma senha válida.");
    } else if (senhaValue.length < 8) {
        errorInput(senha, "A senha deve ter no mínimo 8 caracteres.")
    } else {
        const formularioItem = senha.parentElement;
        formularioItem.className = "inputs-usuario";
    }
}


function checkform() {
    // Chamando as funções de verificação
    checkInputEmail();
    checkInputSenha();

    const formularioItems = formulario.querySelectorAll(".inputs-usuario");
    const isValido = [...formularioItems].every( (item) => {
        // Se todos elemento tiver essa classe  
        return item.className === "inputs-usuario";
    });

    if (isValido) {
        checkLogin(email.value.trim(), senha.value.trim());
    }
}

// Verificação no banco de dados
function checkLogin(emailDigitado, senhaDigitada) {
    // Procura um usuário que tenha o email e senha iguais aos digitados
    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.email === emailDigitado && usuario.senha === senhaDigitada
    );

    // Se encontrou o usuário, login é válido
    if (usuarioEncontrado) {
        alert("Login realizado com sucesso!");
        window.location.href = "cuidapet/templates/pagina_principal/pagina_principal.html";
        return true;
    } else {
        alert("Email ou senha incorretos!");
        return false;
    }
}


// Erro de Input
function errorInput(input, mensagem) {
    // Pega o elemento pai do input
    const formularioItem = input.parentElement;
    // Seleciona a tag span
    const textMensagem = formularioItem.querySelector("span");

    // Escreve a mensagem
    textMensagem.innerText = mensagem;

    // Adiciona a classe de error
    formularioItem.className = "inputs-usuario error";
}








// Página de meus pets
document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");
    const linha = document.querySelector(".bloco-linha");
    const registrarBanho = document.querySelector(".cadastrar-novo-pet");
    const registrarMedicamento = document.querySelector(".registrar-novo-medicamento");

    // Simulação de um banco de dados de pets
    const pets = {
        BOB: { idade: "4 anos", raca: "Vira lata", ultimo_banho: "02/03/2025", vacina: "Em dia" },
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
        if (registrarBanho) registrarBanho.style.display = "flex";
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