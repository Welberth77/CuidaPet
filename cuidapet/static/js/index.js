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


// PÁGINA MEUS PETS

// Lista dinamica para a lista de pets
// Se existir pets cadastrados ele mostra o bloco
// Se não existir pets cadastrados ele ocutra a lista
document.addEventListener("DOMContentLoaded", function () {
    const listaPets = document.querySelector(".lista-pets");
    const mensagemVazia = document.querySelector(".mensagem-vazia");
    const petInfo = document.querySelector(".pet-info");

    // Verifica se há pets cadastrados
    if (listaPets.children.length > 0) {
        listaPets.style.display = "flex";
        mensagemVazia.style.display = "none";
    } else {
        listaPets.style.display = "none";
        mensagemVazia.style.display = "block";
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
            petInfo.innerHTML = `
                <h2>Informações de ${nomePet}</h2>
                <p>Idade: 3 anos</p>
                <p>Raça: Labrador</p>
                <p>Vacinas: Em dia</p>
            `;

            // Exibe a div pet-info
            petInfo.style.display = "block";
        });
    });
});