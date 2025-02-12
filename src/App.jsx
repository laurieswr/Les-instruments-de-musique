import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const Home = ({ startQuiz }) => (
  <div className="home-container">
    <h1>Bienvenue sur Harmonixis!</h1>
    <p>Vous pouvez choisir un instrument et regarder les explications</p>
    <button onClick={startQuiz}>Allez voir les instruments</button>
  </div>
);

const InstrumentMusic = () => {
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instrumentsRes = await axios.get("http://les-instruments-de-musique.local/wp-json/wp/v2/instrument-musique/?per_page=100");
        console.log("Instruments reçus:", instrumentsRes.data);
        setInstruments(instrumentsRes.data);

        // Vérifier les catégories disponibles
        const categories = instrumentsRes.data.map(instr => instr.categorie_de_linstrument);
        console.log("Catégories d'instruments:", [...new Set(categories)]);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSortedInstruments = () => {
    return sorted
      ? [...instruments].sort((a, b) => a.nom_de_linstrument.localeCompare(b.nom_de_linstrument))
      : instruments;
  };

  const getFilteredInstruments = () => {
    if (!selectedFamily) return getSortedInstruments();
    return getSortedInstruments().filter(instr => instr.categorie_de_linstrument === selectedFamily);
  };

  if (!quizStarted) return <Home startQuiz={() => setQuizStarted(true)} />;

  return (
    <div className="flex h-screen">
      <div className={`burger-menu ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className={`sidebar ${menuOpen ? "active" : ""}`}>
        <h2>Instruments de musique</h2>

        <select value={selectedFamily} onChange={(e) => setSelectedFamily(e.target.value)}>
          <option value="">Toutes les familles</option>
          <option value="Cordes frottées">Cordes frottées</option>
          <option value="Cordes pincées">Cordes pincées</option>
          <option value="Cuivres">Vent (Cuivres)</option>
          <option value="Bois">Vent (Bois)</option>
          <option value="Percussions">Percussions</option>
        </select>

        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Trier Z-A" : "Trier A-Z"}
        </button>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul>
            {getFilteredInstruments().map(instr => (
              <li key={instr.id} onClick={() => { setSelectedInstrument(instr); setMenuOpen(false); }}>
                {instr.nom_de_linstrument}
              </li>
            ))}
          </ul>
        )}
      </nav>

      <main className="w-3/4 p-6">
        {selectedInstrument ? (
          <div>
            <h2>{selectedInstrument.nom_de_linstrument}</h2>
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
            <p><strong>Famille:</strong> {selectedInstrument.categorie_de_linstrument}</p>
          </div>
        ) : (
          <p>Sélectionnez un instrument dans le menu</p>
        )}
      </main>
    </div>
  );
};

export default InstrumentMusic;