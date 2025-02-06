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
  const [selectedFamily, setSelectedFamily] = useState(""); // 1. Ajout d'un état pour la famille sélectionnée

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instrumentsRes = await axios.get("http://les-instruments-de-musique.local/wp-json/wp/v2/instrument-musique/");
        console.log("Instruments reçus:", instrumentsRes.data);
        setInstruments(instrumentsRes.data);
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

  // 2. Fonction pour filtrer par famille
  const getFilteredInstruments = () => {
    if (!selectedFamily) return getSortedInstruments(); // Si aucune famille n'est sélectionnée, ne filtre pas
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
        
        {/* 3. Liste déroulante pour choisir une famille */}
        <select
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
        >
          <option value="">Toutes les familles</option>
          {/* Ajoutez des options pour chaque famille d'instrument */}
          <option value="cordes">Cordes</option>
          <option value="cuivres">Cuivres</option>
          <option value="percussions">Percussions</option>
          <option value="bois">Bois</option>
          <option value="claviers">Claviers</option>
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
