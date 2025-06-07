import { useState, useEffect } from "react"
import Lottie from "lottie-react"
import API from "../api"
import { getAllCinemas } from "../api_cinema"
import type { Cinema } from "../types/cinema"
import { motion } from "framer-motion"
import { Play, Film, Users, ChevronRight, Plus } from "lucide-react"

// Note: Vous devrez télécharger ou créer ces fichiers JSON Lottie
// et les placer dans votre dossier public ou assets
import cinemaAnimation from "../assets/streaming.json"
import streamingAnimation from "../assets/cinema.json"
import { useNavigate } from "react-router-dom"

const CinemaPlatform = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    API.get<{ imageUrl?: string }>("/me")
      .then((res) => {
        setImageUrl(res.data.imageUrl || null)
        setIsLoading(false)
      })
      .catch((e) => {
        alert(e.message)
      })
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function fetchCinemas() {
      const data = await getAllCinemas()
      setCinemas(data)
    }
    fetchCinemas()
  }, [])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    // Ici vous pourriez rediriger vers la page appropriée
    // ou afficher le contenu correspondant
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800">
        <div className="w-32 h-32">
          <Lottie animationData={cinemaAnimation} loop={true} className="w-full h-full" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white">CinéStream</h2>
        <p className="mt-2 text-blue-200">Votre expérience cinéma personnalisée</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 text-white">
      {/* Header */}
      <header className="pt-8 pb-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <Play className="h-8 w-8 text-blue-300 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            CinéStream
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-2 text-blue-200"
        >
          Créez ou rejoignez une expérience cinéma unique
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-6"
        >
          <div className="relative group">
            <div className="h-16 w-16 rounded-full bg-blue-600 border-2 border-blue-300 overflow-hidden flex items-center justify-center">
              {/* Remplacer par une vraie image de profil si disponible */}
              <img
                src={imageUrl?.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`}
                alt="Photo de profil"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = ""
                  e.currentTarget.classList.add("bg-blue-600")
                  e.currentTarget.innerHTML = "U"
                }}
              />
            </div>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="absolute -bottom-1 right-0 bg-blue-400 rounded-full p-1 border border-blue-200 cursor-pointer hover:bg-blue-300 transition-all duration-300 group-hover:rotate-90"
            >
              <Plus className="h-3 w-3 text-white group-hover:hidden transition-opacity duration-200" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden group-hover:block text-white transition-opacity duration-200"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4"
        >
          {/* Create Cinema Option */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionSelect("create")}
            className={`bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer border-2 ${selectedOption === "create" ? "border-blue-300" : "border-transparent"}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/30 p-3 rounded-xl">
                  <Film className="h-6 w-6 text-blue-200" />
                </div>
                <div className="bg-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-200">Créateur</div>
              </div>

              <h2 className="text-xl font-bold mb-2">Créer mon cinéma</h2>
              <p className="text-blue-200 text-sm mb-6">
                Devenez le réalisateur de votre propre salle virtuelle et partagez vos films préférés avec vos amis.
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Rediriger vers la page de création
                    window.location.href = "/create-cinema"
                  }}
                  className="flex items-center text-blue-300 text-sm font-medium bg-blue-700/50 hover:bg-blue-600/70 px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Commencer
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Rediriger vers la page de création
                    window.location.href = "/create-cinema"
                  }}
                  className="p-2 bg-blue-700/50 hover:bg-blue-600/70 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-blue-300" />
                </button>
              </div>
            </div>

            <div className="h-48 flex justify-center items-center bg-blue-900/30 p-4">
              <div className="w-40 h-40">
                <Lottie animationData={cinemaAnimation} loop={true} className="w-full h-full" />
              </div>
            </div>
          </motion.div>

          {/* Join Cinema Option */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionSelect("join")}
            className={`bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer border-2 ${selectedOption === "join" ? "border-blue-300" : "border-transparent"}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/30 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-blue-200" />
                </div>
                <div className="bg-blue-500/20 rounded-full px-3 py-1 text-xs font-medium text-blue-200">
                  Spectateur
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">Rejoindre un cinéma</h2>
              <p className="text-blue-200 text-sm mb-6">
                Découvrez des salles virtuelles créées par la communauté et profitez d'une expérience cinéma partagée.
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Rediriger vers la page de liste des cinémas
                    window.location.href = "/join_cinema"
                  }}
                  className="flex items-center text-blue-300 text-sm font-medium bg-blue-700/50 hover:bg-blue-600/70 px-3 py-2 rounded-lg transition-colors"
                >
                  Explorer
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Rediriger vers la page de liste des cinémas
                    window.location.href = "/join-cinema"
                  }}
                  className="p-2 bg-blue-700/50 hover:bg-blue-600/70 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-blue-300" />
                </button>
              </div>
            </div>

            <div className="h-48 flex justify-center items-center bg-blue-900/30 p-4">
              <div className="w-40 h-40">
                <Lottie animationData={streamingAnimation} loop={true} className="w-full h-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Cinemas Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 bg-blue-800/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Cinémas populaires</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cinemas.length === 0 ? (
              <p className="text-blue-300">Aucun cinéma disponible.</p>
            ) : (
              cinemas.map((cinema) => (
                <div
                  key={cinema.id}
                  className="bg-blue-700/50 rounded-lg p-4 hover:bg-blue-600/50 transition-colors cursor-pointer relative overflow-hidden group"
                >
                  <div className="h-48 bg-black rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    <video src={cinema.videoUrl} controls className="max-h-full max-w-full object-contain" />
                  </div>
                  <h4 className="font-medium">{cinema.nomFilm}</h4>
                  <p className="text-xs text-blue-300 mt-1">{cinema.limiteParticipants} spectateurs max</p>

                  {/* Bouton animé simplifié - juste une icône */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 1 }}
                    className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full shadow-lg z-10"
                    onClick={(e) => {
                      e.stopPropagation() // Empêcher la propagation de l'événement
                      const button = e.currentTarget
                      // Animation après clic
                      button.classList.add("animate-pulse")
                      setTimeout(() => {
                        // console.log(cinema);
                        // window.location.href = `/cinema/${cinema.id}`
                        navigate(`/cinema/${cinema.id}`)
                      }, 300)
                    }}
                  >
                    <Film className="h-5 w-5" />
                  </motion.button>

                  {/* Effet de survol */}
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default CinemaPlatform
