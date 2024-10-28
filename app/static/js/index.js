function logar() {
    var email = document.getElementById('e-mail').value;
    var senha = document.getElementById('senha').value;

    if(email == 'admin' && senha == 'admin'){
        alert('sucesso');
        location.href = "pagina_principal.html";
    } else {
        alert('Usuário ou senha incorretos!');
    }
}