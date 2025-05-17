import LoginIllustration from '@assets/login_illustration.png'
import { UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddressAutocomplete, { type Address } from '../components/form/AdressAutocomplete'

export default function RegisterPage() {

  const [address, setAddress] = useState<Address>({
    street: '',
    postalCode: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    fullAddress: ''
  })

  const handleAddressChange = (addr: Address) => {
    setAddress(addr)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adresse soumise :', address)
    // Ici tu envoies les données au backend
  }

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

            {/* Adresse avec autocomplétion */}
            <div>
              <AddressAutocomplete
                onChange={handleAddressChange}
              />
            </div>

            {/* Champs cachés pour latitude, longitude, fullAddress */}
            <input type="hidden" id="fullAddress" value={address.fullAddress} readOnly />
            <input type="hidden" id="latitude" value={address.latitude ?? ''} readOnly />
            <input type="hidden" id="longitude" value={address.longitude ?? ''} readOnly />

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
