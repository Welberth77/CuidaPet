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
        window.location.href = "pagina_principal/pagina_principal.html";
    } else {
        alert('Usuário ou senha incorretos!');
    }
}


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