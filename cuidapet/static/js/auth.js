// Configurações da API
const API_BASE_URL = "http://localhost:3200";
const AUTH_TOKEN_KEY = "cuidapet_token";

// Função para fazer login
async function logar() {
  const email = document.getElementById("e-mail").value;
  const password = document.getElementById("senha").value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/autenticar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.message);
      return;
    }

    // Salva o token no localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);

    // Redireciona para a página principal
    window.location.href = "./pagina_principal/pagina_principal.html";
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro ao fazer login. Por favor, tente novamente.");
  }
}

// Função para registrar um novo usuário
async function registrar() {
  const name = document.getElementById("input-nome-completo").value;
  const email = document.getElementById("input-e-mail").value;
  const password = document.getElementById("input-senha").value;
  const confirmPassword = document.getElementById(
    "input-confirmacao-senha"
  ).value;

  // Validação básica
  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.message);
      return;
    }

    // Salva o token no localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);

    // Redireciona para a página principal
    window.location.href = "../pagina_principal/pagina_principal.html";
  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("Erro ao registrar. Por favor, tente novamente.");
  }
}

// Função para obter informações do usuário
async function getUserInfo() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.message);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    return null;
  }
}

// Função para atualizar informações do usuário
async function updateUser(name, email, password) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return { error: true, message: "Usuário não autenticado" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { error: true, message: "Erro ao atualizar usuário" };
  }
}

// Função para fazer logout
function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = "../index.html";
}

// Verifica autenticação ao carregar páginas protegidas
async function checkAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isAuthPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname.includes("cadastrar_usuario.html");

  if (!token && !isAuthPage) {
    window.location.href = "../index.html";
    return;
  }

  if (token && isAuthPage) {
    window.location.href = "./pagina_principal/pagina_principal.html";
    return;
  }

  // Se estiver em uma página protegida, carrega as informações do usuário
  if (!isAuthPage) {
    const user = await getUserInfo();
    if (user) {
      // Atualiza a UI com as informações do usuário
      updateUIWithUserInfo(user);
    }
  }
}

// Atualiza a UI com as informações do usuário
function updateUIWithUserInfo(user) {
  // Página de perfil
  if (document.querySelector(".perfil-usuario")) {
    document.querySelector(".nome-completo h2").textContent = user.name;
    document.querySelector(".email-usuario h2").textContent = user.email;
    document.querySelector(".senha-usuario h2").textContent = "••••••••";
  }

  // Página de edição de perfil
  if (document.querySelector(".interacao-usuario")) {
    const form = document.querySelector(".interacao-usuario");
    form.querySelector(".input-nome-completo").value = user.name;
    form.querySelector(".input-email").value = user.email;
  }
}

// Event listener para o DOM carregar
document.addEventListener("DOMContentLoaded", checkAuth);
