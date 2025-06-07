import { useEffect, useState, useRef } from "react";
import API from "../api";
import { ArrowLeft, Upload, Camera, X } from 'lucide-react';

const Edit = () => {
  const [username, setUsername] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [photoMode, setPhotoMode] = useState<"none" | "upload" | "camera">("none");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    API.get<{ username: string; imageUrl?: string }>("/me")
      .then(res => {
        setUsername(res.data.username);
        setImageUrl(res.data.imageUrl || null);
        setIsLoading(false);
      })
      .catch(() => {
        alert("Non connecté");
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    // or when photoMode changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleBack = () => {
    window.location.href = "/profile";
  };

  const handleUploadClick = () => {
    setPhotoMode("upload");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = async () => {
    setPhotoMode("camera");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      alert("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      setPhotoMode("none");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current, 
          0, 
          0, 
          videoRef.current.videoWidth, 
          videoRef.current.videoHeight
        );
        
        const imageDataURL = canvasRef.current.toDataURL('image/png');
        setPreviewImage(imageDataURL);
        
        // Stop the camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const handleCancel = () => {
    setPhotoMode("none");
    setPreviewImage(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSavePhoto = () => {
    // Ici, vous pouvez implémenter la logique pour envoyer la photo au serveur
    // Par exemple:
    if (previewImage) {
      // Convertir l'image en blob ou en fichier avant de l'envoyer
      fetch(previewImage)
        .then(res => res.blob())
        .then(blob => {
          const formData = new FormData();
          formData.append('photo', blob, 'profile-photo.png');
          
          return API.post('/upload-photo', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        })
        .then(() => {
          alert("Photo mise à jour avec succès!");
          window.location.href = "/profile";
        })
        .catch(err => {
          console.error("Erreur lors de l'envoi de la photo:", err);
          alert("Erreur lors de la mise à jour de la photo.");
        });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center mb-4">
                <button 
                  onClick={handleBack}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <h2 className="text-xl font-bold ml-4">Modifier votre photo</h2>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                   {previewImage || imageUrl ? (
                    <div className="relative">
                        <img 
                        src={previewImage ?? `http://localhost:5000${imageUrl}`} 
                        alt="Aperçu" 
                        className="h-24 w-24 rounded-full object-cover border-2 border-white"
                        />
                        <button 
                        onClick={handleCancel}
                        className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600 transition-all duration-300"
                        >
                        <X className="h-3.5 w-3.5 text-white" />
                        </button>
                    </div>
                    ) : (
                    <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center text-white text-3xl font-bold">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    )}

                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Choisissez une option</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={handleUploadClick}
                  className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-200"
                >
                  <Upload className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium">Uploader une photo</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </button>
                
                <button 
                  onClick={handleCameraClick}
                  className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-200"
                >
                  <Camera className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium">Prendre une photo</span>
                </button>
              </div>
              
              {photoMode === "camera" && !previewImage && (
                <div className="mb-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <button 
                      onClick={handleCapture}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-blue-500" />
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
              
              {previewImage && (
                <button 
                  onClick={handleSavePhoto}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Enregistrer la photo
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Edit;