import axios from "axios";
import type { Cinema } from "./types/cinema";

const API_URL_1 = "http://localhost:5000/api/cinema"; // adapte si backend différent

export const createCinema = async (
  nomFilm: string,
  limiteParticipants: number,
  videoFile: File
): Promise<Cinema> => {
  const formData = new FormData();
  formData.append("nomFilm", nomFilm);
  formData.append("limiteParticipants", limiteParticipants.toString());
  formData.append("videoFile", videoFile);

  const response = await axios.post(`${API_URL_1}/create`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      // Ajoutez l'autorisation si nécessaire
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  });

  // Assurez-vous que le backend renvoie une URL complète
  return {
    ...response.data,
    videoPath: response.data.videoPath || response.data.videoUrl
  };
};

export const getCinemaByCode = async (codeAcces: string): Promise<Cinema> => {
  const response = await axios.get(`${API_URL_1}/${codeAcces}`);
  return response.data;
};

export const getAllCinemas = async (): Promise<Cinema[]> => {
  const response = await axios.get(`${API_URL_1}/all`);
  return response.data;
};

export async function getCinemaById(id: number): Promise<Cinema> {
  const res = await axios.get(`${API_URL_1}/id/${id}`)
  return res.data
}

