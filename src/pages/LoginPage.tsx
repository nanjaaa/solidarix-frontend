import LoginIllustration from '@assets/login_illustration.png'
import { UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
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

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-primary-darkblue">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                                placeholder="username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-primary-darkblue">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                                placeholder="••••••••"
                            />
                            <div className="text-right mt-1">
                                <Link to="/forgot-password" className="link text-sm">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

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