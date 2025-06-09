document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar autenticado para acessar essa funcionalidade.");
    window.location.href = "../login/login.html";
    return;
  }

  // Preencher o select de pets
  fetch("http://localhost:3200/pets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao carregar pets");
      return response.json();
    })
    .then((data) => {
      // Garante que `pets` seja um array
      const pets = Array.isArray(data) ? data : [data];

      console.log("Pets recebidos (formatado):", pets); // Verifique no console

      const selecionarPet = document.getElementById("selecionarPet");
      selecionarPet.innerHTML =
        '<option value="" disabled selected>Selecione uma opção</option>';

      if (pets.length === 0) {
        alert("Nenhum pet encontrado. Cadastre um pet primeiro.");
        return;
      }

      pets.forEach((pet) => {
        const option = document.createElement("option");
        option.value = pet.id;
        option.textContent = pet.nome;
        selecionarPet.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar pets:", error);
      alert("Erro ao carregar pets. Verifique o console para detalhes.");
    });

  const formulario = document.getElementById("interacao-usuario");

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    checkformulario();

    if (isValido) {
      const petSelecionado = document.getElementById("selecionarPet").value;
      const categoriaSelecionada = document.getElementById(
        "selecionarCategoria"
      ).value;
      const nomeMedicamento = document.getElementById(
        "nomeMedicamentoVacina"
      ).value;
      const dataMedicamento = document.getElementById(
        "dataMedicamentoVacina"
      ).value;
      const dataProxima = document.getElementById(
        "dataProxMedicamentoVacina"
      ).value;
      const observacoes = document.getElementById("observacoes").value;

      fetch(`http://localhost:3200/pets/${petSelecionado}/medicamento-vacina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          categoria: categoriaSelecionada,
          nomeMedicamentoVacina: nomeMedicamento,
          dataMedicamentoVacina: dataMedicamento,
          dataProxMedicamentoVacina: dataProxima,
          observacoes: observacoes,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw err;
            });
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message || "Registro salvo com sucesso!");
          formulario.reset();
        })
        .catch((error) => {
          console.error("Erro ao salvar o registro:", error);
          alert(error.error || "Erro ao salvar o registro");
        });
    }
  });

  let isValido = true;
  function checkformulario() {
    isValido = true;

    const petSelecionado = document.getElementById("selecionarPet").value;
    const categoriaSelecionada = document.getElementById(
      "selecionarCategoria"
    ).value;
    const nomeMedicamentoVacina = document.getElementById(
      "nomeMedicamentoVacina"
    );
    const dataMedicamento = document.getElementById(
      "dataMedicamentoVacina"
    ).value;
    const dataProxima = document.getElementById(
      "dataProxMedicamentoVacina"
    ).value;

    if (!petSelecionado) {
      isValido = false;
      alert("Selecione um pet!");
    }

    if (!categoriaSelecionada) {
      isValido = false;
      alert("Selecione uma categoria!");
    }

    if (nomeMedicamentoVacina.value.trim() === "") {
      isValido = false;
      alert("Nome do medicamento ou vacina é obrigatório!");
    }

    if (!dataMedicamento) {
      isValido = false;
      alert("Data é obrigatória!");
    }

    if (!dataProxima) {
      isValido = false;
      alert("Próxima data é obrigatória!");
    }
  }
});
