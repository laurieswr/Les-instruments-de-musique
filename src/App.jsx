import React, { useEffect, useState } from "react";
import { getInstruments } from "../backend/api";
import "./App.css";

const Home = ({ startQuiz }) => {
  return (
    <div className="home-container">
      <h1>Bienvenue sur un site pour les instruments de musique !</h1>
      <p>Vous pouvez choisir un instrument et regarder les explications</p>
      <button onClick={startQuiz}>Allez sur le site</button>
    </div>
  );
};

const InstrumentMusic = () => {
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    getInstruments()
      .then((data) => {
        console.log("📡 Données reçues :", data);
        setInstruments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des instruments:", err);
        setError("Impossible de charger les instruments.");
        setLoading(false);
      });
  }, []);

  // Fonction pour obtenir les instruments filtrés et triés
  const getFilteredAndSortedInstruments = () => {
    let result = instruments;

    // Filtrage par catégorie
    if (category) {
      result = result.filter((instr) => instr.categorie === category);
    }

    // Tri alphabétique
    if (sorted) {
      result = [...result].sort((a, b) =>
        a.nom_de_linstrument.localeCompare(b.nom_de_linstrument)
      );
    }

    return result;
  };

  // Gestion du tri
  const toggleSort = () => {
    setSorted((prevSorted) => !prevSorted);
  };

  // Gestion du filtrage par catégorie
  const filterByCategory = (event) => {
    setCategory(event.target.value);
  };

  // Liste des instruments filtrés et triés
  const instrumentsAffiches = getFilteredAndSortedInstruments();

  if (!quizStarted) {
    return <Home startQuiz={() => setQuizStarted(true)} />;
  }

  return (
    <div className="flex h-screen">
      {/* Menu Burger */}
      <div
        className={`burger-menu ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Barre latérale */}
      <nav className={`sidebar ${menuOpen ? "active" : ""}`}>
        <h2 className="text-2xl font-bold mb-4">Instruments de musique</h2>
        
        {/* Bouton de tri */}
        <button onClick={toggleSort} className="mb-4 p-2 bg-blue-500 text-white rounded">
          {sorted ? "Trier Z-A" : "Trier A-Z"}
        </button>

        {/* Filtrage par catégorie */}
        <select onChange={filterByCategory} value={category} className="mb-4 p-2 border rounded">
          <option value="">Toutes catégories</option>
          <option value="cordes-frottees">Instruments à cordes frottées</option>
          <option value="cordes-pincees">Instruments à cordes pincées</option>
          <option value="vents-bois">Instrument à vents (bois)</option>
          <option value="vents-cuivres">Instrument à vents (cuivres)</option>
        </select>

        {/* Liste des instruments */}
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul>
            {instrumentsAffiches.map((instr) => (
              <li
                key={instr.id}
                className={`cursor-pointer p-2 hover:bg-gray-700 ${
                  selectedInstrument?.categorie_dinstrument === instr.categorie_dinstrument ? "bg-gray-600" : ""
                }`}
                onClick={() => {
                  setSelectedInstrument(instr);
                  setMenuOpen(false);
                }}
              >
                {instr.nom_de_linstrument}
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Contenu principal */}
      <main className="w-3/4 p-6">
        {selectedInstrument ? (
          <div>
            <h2 className="text-3xl font-bold">{selectedInstrument.nom_de_linstrument}</h2>
            {selectedInstrument.image && (
              <img
                src={selectedInstrument.image.guid}
                alt={selectedInstrument.nom_de_linstrument}
                className="w-64 my-4 rounded-lg shadow-md"
              />
            )}
            <p><strong>Description:</strong> {selectedInstrument.description_de_linstrument}</p>
            <p><strong>Taille:</strong> {selectedInstrument.taille_de_linstrument}</p>
            <p><strong>Morceaux:</strong> {selectedInstrument.morceau}</p>
          </div>
        ) : (
          <p className="text-xl">Sélectionnez un instrument dans le menu</p>
        )}
      </main>
    </div>
  );
};

export default InstrumentMusic;
