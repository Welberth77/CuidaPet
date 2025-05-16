// Importa os dados
document.addEventListener("DOMContentLoaded", () => {
    carregarPetUsuario();
  });
  
function carregarPetUsuario() {
const container = document.getElementById("pets-container");

    if (pets.length > 0) {
        const pet = pets[0]; // Como tem apenas um pet, pegamos o primeiro
        container.innerHTML = `
        <div class="pet-card">
            <h2>${pet.nome} - ${pet.tipo}</h2>
            <p><strong>Raça:</strong> ${pet.raca}</p>
            <p><strong>Idade:</strong> ${pet.idade}</p>
            <p><strong>Última Vacina:</strong> ${pet.ultimaVacina}</p>
            <p><strong>Última Tosa:</strong> ${pet.ultimaTosa}</p>
        </div>
        `;
    } else {
        container.innerHTML = "<p>Você ainda não cadastrou nenhum pet.</p>";
    }
}
  
  