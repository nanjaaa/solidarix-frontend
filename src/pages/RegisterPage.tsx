import LoginIllustration from '@assets/login_illustration.png'
import { UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { register } from '../services/authService'
import { AddressFormFull } from '../components/form/AddressFormFull'
import type { Address } from '../hooks/UseAddressAutocomplete'

export default function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthday: '',
  });

  const [address, setAddress] = useState<Address>({
    number: '',
    streetName: '',
    street: '',
    postalCode: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    fullAddress: ''
  })

  const [error, setError] = useState<string |null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleAddressChange = (addr: Address) => {
    setAddress(addr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adresse soumise :', address)
    
    const payload = {
      ...form,
      birthday: dayjs(form.birthday).format('YYYY-MM-DD'),
      address: {
        number: address.number,
        streetName: address.streetName || '',
        street: address.street,
        postalCode: address.postalCode,
        city: address.city,
        fullAddress: address.fullAddress,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    };

    try {
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription. Vérifiez les champs.");
    }
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

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            {/* Prénom, Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary-darkblue">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="input-style"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary-darkblue">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="input-style"
                  required
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
                value={form.birthday}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>

            {/* Adresse avec autocomplétion */}
            <div>
                <AddressFormFull value={address} onChange={handleAddressChange} />
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
                  value={form.username}
                  onChange={handleChange}
                  placeholder="jeandupont"
                  className="input-style"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-darkblue">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@email.fr"
                  className="input-style"
                  required
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
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-style"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

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
