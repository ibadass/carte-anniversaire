// Personnalise la carte ici (ou via l'URL : ?nom=Jeanne&age=80&de=Tes+petits-enfants)
window.CARTE_CONFIG = {
  nom: "Mamie",
  age: 80,
  de: "Ta famille qui t'aime",
  message:
    "80 ans de sourires, de belles histoires et de tendresse. Tu es notre plus beau livre, et on n'a pas fini de te lire !",
  // Ordre et choix des modules : "feux", "bisous", "livres", "bd", "voeux"
  modules: ["feux", "bisous", "livres", "bd", "voeux"],
  livres: [
    { titre: "Le Petit Prince", auteur: "Saint-Exupéry", emoji: "🌹" },
    { titre: "Les Misérables", auteur: "Victor Hugo", emoji: "📕" },
    { titre: "Le Comte de Monte-Cristo", auteur: "Alexandre Dumas", emoji: "🗡️" },
    { titre: "Madame Bovary", auteur: "Gustave Flaubert", emoji: "🌸" },
    { titre: "Le Grand Meaulnes", auteur: "Alain-Fournier", emoji: "🏰" },
    { titre: "Maigret", auteur: "Georges Simenon", emoji: "🕵️" },
    { titre: "Bonjour tristesse", auteur: "Françoise Sagan", emoji: "🌊" },
    { titre: "Le Rouge et le Noir", auteur: "Stendhal", emoji: "🎭" },
  ],
  bd: [
    { titre: "Tintin", auteur: "Hergé 🇧🇪", emoji: "🐕", couleur: "#2b6cb0", phrase: "Mille milliards de mille sabords !" },
    { titre: "Astérix", auteur: "Goscinny & Uderzo 🇫🇷", emoji: "🛡️", couleur: "#c05621", phrase: "Ils sont fous, ces Romains !" },
    { titre: "Spirou et Fantasio", auteur: "Franquin 🇧🇪", emoji: "🐿️", couleur: "#c53030", phrase: "Un groom, un écureuil, des aventures !" },
    { titre: "Lucky Luke", auteur: "Morris 🇧🇪", emoji: "🤠", couleur: "#d69e2e", phrase: "Il tire plus vite que son ombre !" },
    { titre: "Gaston", auteur: "Franquin 🇧🇪", emoji: "😴", couleur: "#2f855a", phrase: "M'enfin !" },
    { titre: "Les Schtroumpfs", auteur: "Peyo 🇧🇪", emoji: "🍄", couleur: "#3182ce", phrase: "Schtroumpfement heureux anniversaire !" },
    { titre: "Blake et Mortimer", auteur: "E. P. Jacobs 🇧🇪", emoji: "🔭", couleur: "#744210", phrase: "Le secret de l'Espadon !" },
    { titre: "Boule et Bill", auteur: "Roba 🇧🇪", emoji: "🐶", couleur: "#dd6b20", phrase: "Ouaf ! Joyeux anniversaire !" },
    { titre: "Le Chat", auteur: "Philippe Geluck 🇧🇪", emoji: "🐱", couleur: "#718096", phrase: "Le Chat vous souhaite un anniversaire... félin !" },
    { titre: "Les Tuniques bleues", auteur: "Lambil & Cauvin 🇧🇪", emoji: "💂", couleur: "#2c5282", phrase: "Garde-à-vous, c'est la fête !" },
  ],
  voeux: [
    "Que chaque jour t'apporte une petite douceur 🍰",
    "Une santé de fer et un cœur en or 💛",
    "Encore mille histoires à lire et à raconter 📖",
    "Des câlins à n'en plus finir 🤗",
    "Du soleil, des rires et des fous rires ☀️",
  ],
};
