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
        window.location.href = "pagina_principal.html";
    } else {
        alert('Usuário ou senha incorretos!');
    }
}