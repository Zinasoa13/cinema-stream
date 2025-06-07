import { useEffect, useState } from "react";
import API from "../api";
// Importez l'icône Pencil de Lucide React
import { Pencil } from 'lucide-react';
import Lottie from "lottie-react";
import checkAnimation from "../assets/check.json"; // ton fichier .json Lottie

const Profile = () => {
  const [username, setUsername] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCheck, setShowCheck] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Pas de token => redirection immédiate
    window.location.href = "/login";
    return;
  }

  API.get<{ username: string; imageUrl?: string }>("/me")
    .then(res => {
      setUsername(res.data.username);
      setImageUrl(res.data.imageUrl || null);
      setIsLoading(false);
    })
    .catch(() => {
      // Token invalide ou expiré => redirection
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEditProfile = () => {
    // Naviguer vers la page d'édition de profil
    window.location.href = "/edit";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Icône de crayon positionnée au-dessus de l'avatar */}
                  <button className="absolute top-13 right-0 bg-white p-1 rounded-full hover:bg-[#0be7b2] transition-all duration-300 group">
                    <Pencil 
                      className="h-3.5 w-3.5 text-blue-700 group-hover:rotate-12 group-hover:text-white transition-transform duration-300"
                      onClick={handleEditProfile} 
                      strokeWidth={2}
                    />
                  </button>
                  
                  {imageUrl ? (
                    <img
                      src={imageUrl?.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center">Bienvenue, {username}</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Informations du compte</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Nom d'utilisateur</span>
                    <span className="font-medium">{username}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Statut</span>
                    <span className="text-green-600 font-medium">Actif</span>
                  </div>
                </div>
              </div>

              {showCheck ? (
                <div className="flex justify-center items-center">
                    <Lottie animationData={checkAnimation} style={{ height: 100 }} loop={false} />
                </div>
                ) : (
                <button
                    onClick={() => {
                    setShowCheck(true);
                    setTimeout(() => {
                        window.location.href = "/streaming";
                    }, 2000);
                    }}
                    className="w-full mb-4 animate-gradient bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:scale-105 text-white font-medium py-2 px-4 rounded-md transition-all duration-500"
                >
                    Continuer
                </button>
                )}
              
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 hover:scale-105 text-white font-medium py-2 px-4 rounded-md transition-all duration-500"
              >
                Déconnexion
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;