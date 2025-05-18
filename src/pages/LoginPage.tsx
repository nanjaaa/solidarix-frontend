import LoginIllustration from '@assets/login_illustration.png'
import { UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AuthRequestDto } from '../types/auth'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {

    const [form, setForm] = useState<AuthRequestDto>({
        username: "",
        password: "",
    })

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(form);
            localStorage.setItem("token", data.token); // si token retourné
            setIsAuthenticated(true);
            navigate("/"); // redirection après succès
        } catch (err) {
            setError("Nom d'utilisateur ou mot de passe invalide.");
        }
    };


    return (
        
        <div className="min-h-screen flex flex-row items-center  justify-center">

            {/* Partie gauche avec illustration */}
            <div className="justify-center items-center ">
                {/* Placeholder de l'image illustrée */}
                <div className="max-w-sm">
                    <img 
                        src = {LoginIllustration}
                        alt= "Illustration de la connexion à Solidarix" 
                        className="w-full h-auto"
                    />
                </div>
            </div>


            {/* Partie droite avec formulaire */}
            <div className="flex justify-center items-center ">
                <div className="card  bg-white">

                     <div className="flex flex-col items-center mb-6">
                        <UserCircle className="w-12 h-12 text-primary-darkblue mb-2" />
                        <h2 className="text-2xl font-bold text-primary-darkblue text-center">
                            Connexion à Solidarix
                        </h2>
                     </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-primary-darkblue">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                                placeholder="username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-primary-darkblue">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"            
                                value={form.password} 
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                                placeholder="••••••••"
                                required
                            />
                            <div className="text-right mt-1">
                                <Link to="/forgot-password" className="link text-sm">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-base w-full"
                        >
                        Se connecter
                        </button>
                    </form>

                    <hr className="my-6 border-t border-gray-200" />

                    <p className="text-center text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="link underline text-md">
                            Créez-en un ici
                        </Link>
                    </p>
                </div>
            </div>


        </div>

    )
}