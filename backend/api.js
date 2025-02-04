import axios from "axios";

const API_URL = "http://les-instruments-de-musique.local/wp-json/wp/v2/instrument-musique";

// Fonction pour récupérer les instruments via l'API
export const getInstruments = async () => {
  try {
    const response = await axios.get(API_URL); // Requête GET avec axios
    if (response.data !== undefined) {
      return response.data; // Retourner les données de la réponse
    } else {
      throw new Error("Aucune donnée retournée par l'API");
    }
  } catch (error) {
    console.error("Erreur API:", error); // Affichage de l'erreur dans la console
    throw error;
  }
};
