import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createCinema } from "../api_cinema"
import type { Cinema } from "../types/cinema"
import { Film, Users, Upload, Check, Loader2, Clipboard } from "lucide-react"

const CreateCinema = () => {
  const [nomFilm, setNomFilm] = useState("")
  const [limiteParticipants, setLimiteParticipants] = useState(0)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [cinemaCreated, setCinemaCreated] = useState<Cinema | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile) {
      alert("Veuillez sélectionner une vidéo.")
      return
    }

    setIsLoading(true)
    try {
      const result = await createCinema(nomFilm, limiteParticipants, videoFile)
      setCinemaCreated(result)
    } catch (error) {
      console.error("Erreur de création :", error)
      alert("Erreur lors de la création du cinéma.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVideoFile(file)
    setFileName(file?.name || "")
  }

  useEffect(() => {
    if (cinemaCreated) {
      console.log("Cinéma créé avec succès :", cinemaCreated)
    }
  }, [cinemaCreated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden" // Changé de max-w-md à max-w-2xl
      >
        <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 py-6 px-8">
          {" "}
          {/* Augmenté le padding */}
          <motion.h2
            className="text-3xl font-bold text-white text-center" // Augmenté la taille du texte
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Créer un cinéma virtuel
          </motion.h2>
        </div>

        {!cinemaCreated ? (
          <motion.form
            onSubmit={handleSubmit}
            className="p-8 space-y-8" // Augmenté le padding et l'espacement
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-3">
              {" "}
              {/* Augmenté l'espacement */}
              <label className="flex items-center text-base font-medium text-gray-700 mb-2">
                {" "}
                {/* Augmenté la taille du texte */}
                <Film className="w-5 h-5 mr-2 text-teal-500" /> {/* Augmenté la taille de l'icône */}
                Nom du film
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={nomFilm}
                onChange={(e) => setNomFilm(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-base" // Augmenté le padding et la taille du texte
                placeholder="Entrez le nom du film"
              />
            </div>

            <div className="space-y-3">
              {" "}
              {/* Augmenté l'espacement */}
              <label className="flex items-center text-base font-medium text-gray-700 mb-2">
                {" "}
                {/* Augmenté la taille du texte */}
                <Users className="w-5 h-5 mr-2 text-teal-500" /> {/* Augmenté la taille de l'icône */}
                Nombre limite de participants
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="number"
                value={limiteParticipants}
                onChange={(e) => setLimiteParticipants(Number(e.target.value))}
                required
                min="1"
                className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-base" // Augmenté le padding et la taille du texte
                placeholder="Nombre maximum de spectateurs"
              />
            </div>

            <div className="space-y-3">
              {" "}
              {/* Augmenté l'espacement */}
              <label className="flex items-center text-base font-medium text-gray-700 mb-2">
                {" "}
                {/* Augmenté la taille du texte */}
                <Upload className="w-5 h-5 mr-2 text-teal-500" /> {/* Augmenté la taille de l'icône */}
                Vidéo
              </label>
              <div className="relative">
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center w-full px-5 py-4 border-2 border-dashed border-teal-300 rounded-md cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors" // Augmenté le padding
                >
                  <input type="file" accept="video/*" onChange={handleFileChange} required className="sr-only" />
                  <span className="text-base text-teal-700">{fileName ? fileName : "Sélectionner une vidéo"}</span>{" "}
                  {/* Augmenté la taille du texte */}
                </motion.label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-md hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all text-lg" // Augmenté le padding et la taille du texte
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" /> {/* Augmenté la taille de l'icône */}
                  Création en cours...
                </>
              ) : (
                "Créer le cinéma"
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            className="p-8 space-y-8" // Augmenté le padding et l'espacement
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-teal-50 p-6 rounded-lg border border-teal-200" // Augmenté le padding
            >
              <div className="flex items-center justify-center mb-5">
                {" "}
                {/* Augmenté la marge */}
                <div className="bg-teal-100 p-3 rounded-full">
                  {" "}
                  {/* Augmenté le padding */}
                  <Check className="w-10 h-10 text-teal-600" /> {/* Augmenté la taille de l'icône */}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center text-teal-800 mb-5">Cinéma créé avec succès !</h3>{" "}
              {/* Augmenté la taille du texte et la marge */}
              <div className="space-y-4">
                {" "}
                {/* Augmenté l'espacement */}
                <p className="text-base text-gray-700 flex items-center">
                  {" "}
                  {/* Augmenté la taille du texte */}
                  <Film className="w-5 h-5 mr-3 text-teal-500" /> {/* Augmenté la taille de l'icône */}
                  <span className="font-medium">Nom du film :</span>
                  <span className="ml-2">{cinemaCreated.nomFilm}</span>
                </p>
                <div className="flex items-center text-base text-gray-700 flex-wrap">
                  {" "}
                  {/* Changé en div et ajouté flex-wrap */}
                  <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">#</span>
                  <span className="font-medium mr-2">Code d'accès :</span>
                  <span className="font-mono bg-blue-50 px-3 py-1.5 rounded mr-2">{cinemaCreated.codeAcces}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(cinemaCreated.codeAcces)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full text-teal-700 transition-colors" // Augmenté le padding
                    title="Copier le code"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}{" "}
                    {/* Augmenté la taille de l'icône */}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              {cinemaCreated.videoUrl && (
                <video width="100%" height="auto" controls className="w-full">
                  <source 
                    src={
                      cinemaCreated.videoUrl.startsWith('http') 
                        ? cinemaCreated.videoUrl
                        : `http://localhost:5000/${cinemaCreated.videoUrl}`
                    } 
                  />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCinemaCreated(null)}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-md hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all text-lg"
              >
                Créer un autre cinéma
              </motion.button>

              <motion.a
                href="/streaming"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all text-lg"
              >
                Aller au streaming
              </motion.a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default CreateCinema
