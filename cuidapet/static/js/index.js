document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário

        const email = document.getElementById("e-mail").value;
        const senha = document.getElementById("senha").value;

        // Verifica se o campo de mensagem de erro existe, se não, cria um
        let mensagemErro = document.getElementById("mensagem-erro");
        if (!mensagemErro) {
            mensagemErro = document.createElement("p");
            mensagemErro.id = "mensagem-erro";
            mensagemErro.style.color = "red";
            loginForm.appendChild(mensagemErro);
        }

        // Verifica se o email existe no dicionário de usuários
        const usuario = usuarios[email];

        if (usuario && usuario.senha === senha) {
            alert("Login realizado com sucesso!");
            window.location.href = "./cuidapet/templates/pagina_principal/pagina_principal.html"; // Redireciona para a página principal
        } else {
            // Exibe a mensagem de erro
            mensagemErro.textContent = "Email ou senha incorretos. Tente novamente!";

            // Limpa os campos de email e senha
            document.getElementById("e-mail").value = "";
            document.getElementById("senha").value = "";

            // Atualiza a página para mostrar os campos vazios novamente
            setTimeout(() => {
                mensagemErro.textContent = ""; // Limpa a mensagem de erro após 2 segundos
            }, 2000);
        }
    });
});


  

// Lista dinamica para a lista de pets
// Se existir pets cadastrados ele mostra o bloco
// Se não existir pets cadastrados ele ocutra a lista
window.onload = function() {
    const listaPets = document.querySelector('.lista-pets');
    const mensagemVazia = document.querySelector('.mensagem-vazia');
    const blocolinha = document.querySelector('.bloco-linha')
    
    // Verifica se há pelo menos um item na lista
    if (listaPets.querySelectorAll('li').length > 0) {
        listaPets.style.display = 'flex';  // Exibe a lista
        mensagemVazia.style.display = 'none';  // Esconde a mensagem
        blocolinha.style.display = 'flex' // Exibe a linha
    } else {
        listaPets.style.display = 'none';  // Esconde a lista
        mensagemVazia.style.display = 'block';  // Exibe a mensagem
        blocolinha.style.display = 'none' // Esconde a linha
    }

    // Adiciona o comportamento de seleção nos itens da lista
    const items = listaPets.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', () => {
            // Remove a seleção de todos os itens
            items.forEach(i => i.classList.remove('selected'));

            // Adiciona a seleção ao item clicado
            item.classList.add('selected');
        });
    });
};