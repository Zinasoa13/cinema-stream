import { useState } from "react";
import { login } from "../api";
import type { UserDto } from "../api";

const Login = () => {
  const [form, setForm] = useState<UserDto>({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">Connexion</h2>
          
          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nom d'utilisateur"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
          
          <div className="text-center pt-4 border-t mt-6">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Inscrivez-vous
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;