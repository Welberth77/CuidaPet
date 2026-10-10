// Opcoes de racas e cores por especie (migrado do projeto original).
export const ESPECIES = [
  { value: "cachorro", label: "Cachorro" },
  { value: "gato", label: "Gato" },
];

export const RACAS = {
  cachorro: [
    "Vira-lata", "Labrador Retriever", "Shih Tzu", "Poodle", "Yorkshire Terrier",
    "Pinscher", "Bulldogue Francês", "Golden Retriever", "Chihuahua", "Pastor Alemão",
    "Dachshund (Salsicha)", "Rottweiler", "Pug", "Maltês", "Border Collie",
  ],
  gato: [
    "Vira-lata (SRD)", "Siamês", "Persa", "Maine Coon", "Angorá",
    "Sphynx (Sem pelo)", "Ragdoll", "British Shorthair", "Bengal",
    "Exótico (Pelo curto)", "Norueguês da Floresta", "Himalaio",
  ],
};

export const CORES = {
  cachorro: [
    "Caramelo", "Preto", "Branco", "Marrom", "Cinza", "Bege",
    "Preto e branco", "Marrom e branco", "Tricolor", "Tigrado",
    "Dourado", "Fígado", "Não possui",
  ],
  gato: [
    "Preto", "Branco", "Cinza", "Ruivo (Laranja)", "Marrom", "Tigrado",
    "Cálico (Tricolor)", "Casco de tartaruga", "Preto e branco",
    "Colorpoint (siamês)", "Não possui",
  ],
};

export const PELAGENS = ["Curta", "Média", "Longa", "Sem pelo"];
export const SEXOS = ["Macho", "Fêmea"];

export const CATEGORIAS_SAUDE = ["Vacina", "Medicamento"];
export const SERVICOS_BANHO = ["Banho", "Tosa", "Banho e Tosa"];
