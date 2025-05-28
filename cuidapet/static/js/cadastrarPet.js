document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado. Script ativo.");
  document
    .getElementById("especiePet")
    .addEventListener("change", atualizarCores);

  const formulario = document.getElementById("interacao-usuario");
  const nomePet = document.getElementById("nomePet");
  const especiePet = document.getElementById("especiePet");
  const racaPet = document.getElementById("racaPet");
  const sexoPet = document.getElementById("sexoPet");
  const pesoPet = document.getElementById("pesoPet");
  const nascimentoPet = document.getElementById("nascimentoPet");
  const corPelagem = document.getElementById("corPelagem");
  const pelagemPet = document.getElementById("pelagemPet");
  const sobrePet = document.getElementById("sobreOPet");

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    checkformulario();
  });

  function checkformulario() {
    checkNomePet();
    checkEspeciePet();
    checkRacaPet();
    checkSexoPet();
    checkPesoPet();
    checkNascimentoPet();
    checkCorPelagem();
    checkPelagemPet();

    const formularioItems = document.querySelectorAll(".input-item");
    const isValido = [...formularioItems].every(
      (item) => item.className === "input-item"
    );

    if (isValido) {
      const token = localStorage.getItem("token");

      const body = {
        nome: nomePet.value.trim(),
        especie: especiePet.value.toLowerCase(),
        raca: racaPet.value.toLowerCase(),
        sexo: sexoPet.value.toLowerCase(),
        peso: parseFloat(pesoPet.value),
        nascimento: nascimentoPet.value,
        corPelagem: corPelagem.value.toLowerCase(),
        pelagem: pelagemPet.value.toLowerCase(),
        sobre: sobrePet.value.trim(),
      };

      console.log("Enviando dados:", body);

      fetch("http://localhost:3200/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((data) => {
          alert("Pet cadastrado com sucesso!");
          window.location.href = "meus_pets.html";
        })
        .catch(async (err) => {
          const text = await err.text?.();
          console.error("Erro completo:", text);
          alert("Erro ao cadastrar pet");
        });
    }
  }

  function checkNomePet() {
    if (nomePet.value === "") errorInput(nomePet);
    else nomePet.parentElement.className = "input-item";
  }

  function checkEspeciePet() {
    if (especiePet.value === "") errorInput(especiePet);
    else especiePet.parentElement.className = "input-item";
  }

  function checkRacaPet() {
    if (racaPet.value === "") errorInput(racaPet);
    else racaPet.parentElement.className = "input-item";
  }

  function checkSexoPet() {
    if (sexoPet.value === "") errorInput(sexoPet);
    else sexoPet.parentElement.className = "input-item";
  }

  function checkPesoPet() {
    const pesoPetValue = pesoPet.value.trim();
    const pesoNumber = parseFloat(pesoPetValue);
    console.log("Peso recebido:", pesoPetValue, pesoNumber);

    if (
      pesoPetValue === "" ||
      isNaN(pesoNumber) ||
      pesoNumber < 1 ||
      pesoNumber > 99
    ) {
      errorInput(pesoPet);
    } else {
      pesoPet.parentElement.className = "input-item";
    }
  }

  function checkNascimentoPet() {
    const nascimentoPetValueString = nascimentoPet.value;
    if (nascimentoPetValueString === "") {
      errorInput(nascimentoPet);
      return;
    }

    const nascimentoPetValueData = new Date(nascimentoPet.value);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    if (nascimentoPetValueData > dataAtual) {
      alert("A data de nascimento não pode ser futura.");
      errorInput(nascimentoPet);
    } else {
      nascimentoPet.parentElement.className = "input-item";
    }
  }

  function checkCorPelagem() {
    if (corPelagem.value === "") errorInput(corPelagem);
    else corPelagem.parentElement.className = "input-item";
  }

  function checkPelagemPet() {
    if (pelagemPet.value === "") errorInput(pelagemPet);
    else pelagemPet.parentElement.className = "input-item";
  }

  function errorInput(input) {
    input.parentElement.className = "input-item error";
  }

  function atualizarCores() {
    const especiePetValue = especiePet.value.toLowerCase();
    const corSelect = document.getElementById("corPelagem");
    const racaSelect = document.getElementById("racaPet");

    corSelect.innerHTML = "";
    const corDefault = document.createElement("option");
    corDefault.value = "";
    corDefault.disabled = true;
    corDefault.selected = true;
    corDefault.textContent = "Selecione a cor";
    corSelect.appendChild(corDefault);

    let cores = [];
    if (especiePetValue === "cachorro") {
      cores = [
        "preto",
        "branco",
        "caramelo",
        "marrom",
        "cinza",
        "bege",
        "preto e branco",
        "marrom e branco",
        "tricolor",
        "tigrado",
        "dourado",
        "fígado",
      ];
    } else if (especiePetValue === "gato") {
      cores = [
        "preto",
        "branco",
        "rajado",
        "cinza",
        "ruivo (laranja)",
        "marrom",
        "tigrado",
        "calico (tricolor)",
        "tortoiseshell (casco de tartaruga)",
        "preto e branco",
        "colorpoint (tipo siamês)",
      ];
    }

    cores.forEach((cor) => {
      const option = document.createElement("option");
      option.value = cor.toLowerCase();
      option.textContent = cor;
      corSelect.appendChild(option);
    });

    corSelect.disabled = false;

    racaSelect.innerHTML = "";
    const racaDefault = document.createElement("option");
    racaDefault.value = "";
    racaDefault.disabled = true;
    racaDefault.selected = true;
    racaDefault.textContent = "Selecione a raça do pet";
    racaSelect.appendChild(racaDefault);

    // Define lista de raças de acordo com a espécie
    let racas = [];
    if (especiePetValue === "cachorro") {
      racas = [
        "bulldog",
        "vira-lata",
        "labrador retriever",
        "shih tzu",
        "poodle",
        "yorkshire terrier",
        "pinscher",
        "bulldogue francês",
        "golden retriever",
        "chihuahua",
        "pastor alemão",
        "dachshund (Salsicha)",
        "rottweiler",
        "pug",
        "maltês",
        "border collie",
      ];
    } else if (especiePetValue === "gato") {
      racas = [
        "vira-lata",
        "siamês",
        "persa",
        "maine coon",
        "angorá",
        "sphynx (Sem pelo)",
        "ragdoll",
        "british shorthair (Pelo curto inglês)",
        "bengal",
        "exótico (Pelo curto)",
        "norueguês da floresta",
        "himalaio",
      ];
    }

    racas.forEach((raca) => {
      const option = document.createElement("option");
      option.value = raca.toLowerCase();
      option.textContent = raca;
      racaSelect.appendChild(option);
    });

    racaSelect.disabled = false;
  }
});
