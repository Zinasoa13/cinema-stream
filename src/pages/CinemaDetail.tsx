import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCinemaById } from "../api_cinema"
import type { Cinema } from "../types/cinema"
import { Play, Pause, Volume2, VolumeX, Users, Key, ArrowLeft } from "lucide-react"

const CinemaDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!id) return
    getCinemaById(Number(id)).then(setCinema).catch(console.error)
  }, [id])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [cinema])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!cinema) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/streaming")}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au streaming
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{cinema.nomFilm}</h1>
          <div className="flex gap-4 text-blue-200">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>Code: {cinema.codeAcces}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Limite: {cinema.limiteParticipants}</span>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} src={cinema.videoUrl} className="w-full aspect-video" onClick={togglePlay} />

          {/* Controls */}
          <div className="bg-gray-800 p-4">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer" onClick={handleProgressClick}>
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-blue-400 p-2">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400 p-2">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-blue-500"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-3">Informations</h2>
          <div className="grid md:grid-cols-2 gap-4 text-blue-200">
            <div>
              Titre: <span className="text-white">{cinema.nomFilm}</span>
            </div>
            <div>
              Code: <span className="text-white">{cinema.codeAcces}</span>
            </div>
            <div>
              Participants: <span className="text-white">{cinema.limiteParticipants}</span>
            </div>
            <div>
              Durée: <span className="text-white">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CinemaDetails
