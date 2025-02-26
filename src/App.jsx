import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const InstrumentMusic = () => {
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instrumentsRes = await axios.get(
          "http://les-instruments-de-musique.local/wp-json/wp/v2/instrument-musique/?per_page=100"
        );
        setInstruments(instrumentsRes.data);
      } catch (err) {
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
    return getSortedInstruments().filter(instr =>
      instr.categorie_de_linstrument.toLowerCase().includes(selectedFamily.toLowerCase())
    );
  };

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
          <option value="cordes frottées">Cordes frottées</option>
          <option value="cordes pincées">Cordes pincées</option>
          <option value="famille des instruments à vent (cuivre)">famille des instruments à vent (Cuivres)</option>
          <option value="famille des instruments à vent (bois)">famille des instruments à vents (Bois)</option>
          <option value="percussions">Percussions</option>
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
              <img src={selectedInstrument.image.guid} alt={selectedInstrument.nom_de_linstrument} className="w-64 my-4 rounded-lg shadow-md" />
            )}
            <p><strong>Description:</strong> {selectedInstrument.description_de_linstrument}</p>
            <p><strong>Taille:</strong> {selectedInstrument.taille_de_linstrument}</p>
            <p><strong>Morceaux:</strong> {selectedInstrument.morceau}</p>
            <p><strong>Famille:</strong> {selectedInstrument.categorie_de_linstrument}</p>
          </div>
        ) : (
          <div>
            <h2>Bienvenue dans la découverte des instruments !</h2>
            <p>Vous pouvez choisir un instrument de musique parmi la liste d'instrument de musique à gauche ou choisir en fonction des différentes familles.</p>
            <p><strong>Cordes frottées:</strong> Les instruments à cordes frottées produisent du son grâce à un archet frotté sur des cordes tendues.</p>
            <p><strong>Cordes pincées:</strong> Les instruments à cordes pincées émettent du son lorsqu'on pince leurs cordes avec les doigts ou un médiator.</p>
            <p><strong>Cuivres:</strong> Les cuivres produisent du son grâce à la vibration des lèvres dans l'embouchure de l'instrument.</p>
            <p><strong>Bois:</strong> Les bois sont des instruments à vent dont le son est produit par la vibration d'un anche ou par un biseau.</p>
            <p><strong>Percussions:</strong> Les percussions regroupent des instruments frappés, secoués ou frottés pour produire du son.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstrumentMusic;
