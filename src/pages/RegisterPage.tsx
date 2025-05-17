import LoginIllustration from '@assets/login_illustration.png'
import { UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-row items-center justify-center">
      
      {/* Illustration à gauche */}
      <div className="justify-center items-center">
        <div className="max-w-sm">
          <img
            src={LoginIllustration}
            alt="Illustration de l'inscription à Solidarix"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Formulaire à droite */}
      <div className="flex justify-center items-center w-full max-w-xl">
        <div className="card w-full bg-white p-8 shadow-xl rounded-2xl">
          
          {/* Titre */}
          <div className="flex flex-col items-center mb-6">
            <UserCircle className="w-12 h-12 text-primary-darkblue mb-2" />
            <h2 className="text-2xl font-bold text-primary-darkblue text-center">
              Rejoignez la communauté Solidarix
            </h2>
          </div>

          <form className="space-y-4">

            {/* Prénom, Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary-darkblue">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Jean"
                  className="input-style"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary-darkblue">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Dupont"
                  className="input-style"
                />
              </div>
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-primary-darkblue">
                Date de naissance
              </label>
              <input
                type="date"
                id="birthday"
                className="input-style"
              />
            </div>

            {/* Adresse (découpée) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="streetNumber" className="block text-sm font-medium text-primary-darkblue">
                  Numéro
                </label>
                <input
                  type="text"
                  id="streetNumber"
                  placeholder="10"
                  className="input-style"
                />
              </div>
              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-primary-darkblue">
                  Rue
                </label>
                <input
                  type="text"
                  id="streetName"
                  placeholder="Rue de la Paix"
                  className="input-style"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-primary-darkblue">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  placeholder="75002"
                  className="input-style"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-primary-darkblue">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="Paris"
                  className="input-style"
                />
              </div>
            </div>

            {/* Champs cachés */}
            <input type="hidden" id="fullAddress" />
            <input type="hidden" id="latitude" />
            <input type="hidden" id="longitude" />

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary-darkblue">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="jeandupont"
                  className="input-style"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-darkblue">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="jean.dupont@email.fr"
                  className="input-style"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-darkblue">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="input-style"
              />
            </div>

            {/* Bouton */}
            <button type="submit" className="btn btn-base w-full">
              S’inscrire
            </button>
          </form>

          <hr className="my-6 border-t border-gray-200" />

          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="link underline text-md">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
