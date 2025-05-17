import { useEffect, useRef, useState } from "react";
import { useKeyboardNavigation } from "../../hooks/UseKeyBoardNavigation";

export type Address = {
    street          : string;
    postalCode      : string;
    city            : string;
    latitude?       : string;
    longitude?      : string;
    fullAddress?    : string;
}

type AddressAutocompleteProps = {
    onChange: (address: Address) => void;
}

interface Suggestion {
  label: string // adressse complète
  name : string // juste numéro + rue
  postalCode: string
  city: string
  latitude: number
  longitude: number
}

export default function AddressAutocomplete({ onChange }: AddressAutocompleteProps) {

    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
    const [manualPostalCode, setManualPostalCode] = useState('')
    const [manualCity, setManualCity] = useState('')
    const [manualMode, setManualMode] = useState(false)
    const controllerRef = useRef<AbortController | null>(null)  

    // Fonction pour appeler l'API d'adresse
    const fetchSuggestions = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([])
            return
        }

        // Abort la précédente requête si elle existe
        if (controllerRef.current) {
            controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        try {
            const response = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
                { signal: controllerRef.current.signal }
            )
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des adresses')
            }
            const data = await response.json()

            // Transforme la réponse en tableau de suggestions
            const newSuggestions: Suggestion[] = data.features.map((feature: any) => ({
                label: feature.properties.label,
                name : feature.properties.name,
                postalCode: feature.properties.postcode,
                city: feature.properties.city,
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0]
            }))
            setSuggestions(newSuggestions)

        } catch (error) {
            if ((error as any).name !== 'AbortError') {
                console.error('Erreur API adresse:', error)
            }
            setSuggestions([])
        }
    }


    // Déclenche la recherche dès que l’input change, avec debounce simple
    useEffect(() => {
        if (selectedSuggestion) {
            setSuggestions([])
            return
        }
        const handler = setTimeout(() => {
            fetchSuggestions(inputValue)
        }, 300)

        return () => clearTimeout(handler)
    }, [inputValue, selectedSuggestion])


    const handleSelectSuggestion = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion)
        setInputValue(suggestion.name)
        setManualPostalCode(suggestion.postalCode)
        setManualCity(suggestion.city)
        setManualMode(false)
        onChange({
            street: suggestion.name,
            postalCode: suggestion.postalCode,
            city: suggestion.city,
            latitude: suggestion.latitude + '',
            longitude: suggestion.longitude + '',
            fullAddress: suggestion.label
        })
        setSuggestions([])
    } 

  // Quand on modifie manuellement le CP ou la ville
  useEffect(() => {
    if (manualMode) {
      onChange({
        street: inputValue,
        postalCode: manualPostalCode,
        city: manualCity,
        fullAddress: inputValue + ', ' + manualPostalCode + ' ' + manualCity
      })
    }
  }, [manualPostalCode, manualCity])


  // Si on modifie le champ adresse manuellement (pas via sélection)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedSuggestion(null)
    setManualMode(true)
    // TODO: lancer recherche suggestions API ici
  }

  const { highlightedIndex, setHighlightedIndex, onKeyDown } = useKeyboardNavigation(
    suggestions.length,
    (index) => handleSelectSuggestion(suggestions[index])
  );

  return (
    <div className="relative">
      <label htmlFor="address" className="block text-sm font-medium text-primary-darkblue">
        Adresse (numéro et rue)
      </label>
      <input
        type="text"
        id="address"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={onKeyDown} // <-- ici on passe le gestionnaire clavier
        placeholder="10 Rue de la Paix"
        className="input-style w-full"
        autoComplete="off"
      />
      {suggestions.length > 0 && !selectedSuggestion && (
        <ul className="absolute w-full border rounded-md max-h-48 overflow-y-auto bg-white shadow-md mt-1">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className={`p-2 cursor-pointer hover:bg-primary-green hover:text-white ${
                idx === highlightedIndex ? 'bg-primary-green text-white' : ''
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(idx)} // synchroniser sur hover souris  
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-primary-darkblue">
            Code postal
          </label>
          <input
            type="text"
            id="postalCode"
            placeholder="75002"
            value={manualMode ? manualPostalCode : selectedSuggestion?.postalCode || ''}
            onChange={(e) => {
              setManualPostalCode(e.target.value)
              setManualMode(true)
            }}
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
            value={manualMode ? manualCity : selectedSuggestion?.city || ''}
            onChange={(e) => {
              setManualCity(e.target.value)
              setManualMode(true)
            }}
            className="input-style"
          />
        </div>
      </div>
    </div>
  )

}

