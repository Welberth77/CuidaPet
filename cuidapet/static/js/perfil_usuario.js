window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../../index.html";
    return;
  }

  document.querySelector(".nome-completo h2").innerText = user.name;
  document.querySelector(".email-usuario h2").innerText = user.email;
  document.querySelector(".senha-usuario h2").innerText = "********";
};
