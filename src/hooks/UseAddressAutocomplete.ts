import { useEffect, useRef, useState } from "react";

export type Address = {
    number?         : string;
    streetName      : string;
    street          : string;
    postalCode      : string;
    city            : string;
    latitude?       : string;
    longitude?      : string;
    fullAddress?    : string;
}

type UseAddressAutocompleteProps = {
    onChange: (address: Address) => void;
}

export function useAddressAutocomplete({ onChange }: UseAddressAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Address[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<Address | null>(null);
    const [manualPostalCode, setManualPostalCode] = useState('');
    const [manualCity, setManualCity] = useState('');
    const [manualMode, setManualMode] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchSuggestions = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`, {
                signal: controllerRef.current.signal,
            });
            if (!response.ok) throw new Error("Erreur API");
            const data = await response.json();

            // On mappe les données pour correspondre au type Address
            const newSuggestions: Address[] = data.features.map((f: any) => {
                const { number, street } = extractNumberAndStreet(f.properties.name);
                return {
                    number: number || undefined,
                    streetName: street,
                    street: f.properties.name,             // nom complet (num + rue)
                    postalCode: f.properties.postcode,
                    city: f.properties.city,
                    latitude: f.geometry.coordinates[1].toString(),
                    longitude: f.geometry.coordinates[0].toString(),
                    fullAddress: f.properties.label,
                };
            });

            setSuggestions(newSuggestions);
        } catch (error) {
            if ((error as any).name !== "AbortError") console.error(error);
            setSuggestions([]);
        }
    };


    const extractNumberAndStreet = (name: string) => {

        const regex = /^\s*(\d{1,4}(?:\s?(?:bis|ter|quater))?)\s+(.+)$/i;
        const match = name.trim().match(regex);

        if (match) {
            const number = match[1].trim(); // ex: "12 bis"
            const street = match[2].trim(); // ex: "Rue des Lilas"
            return { number, street };
        }

        // Aucun numéro détecté : on renvoie null pour number, et name complet pour street
        return { number: null, street: name.trim() };
    };

    const handleSelect = (s: Address) => {
        //const { number, street } = ;
        const number = s.number;
        const streetName = s.streetName;
        setSelectedSuggestion(s);
        setInputValue(s.street);
        setManualPostalCode(s.postalCode);
        setManualCity(s.city);
        setManualMode(false);
        setSuggestions([]);

        onChange({
            number: number || undefined,
            streetName: streetName,
            street: s.street,
            postalCode: s.postalCode,
            city: s.city,
            latitude: s.latitude + "",
            longitude: s.longitude + "",
            fullAddress: s.fullAddress,
        });
    };

    useEffect(() => {
        if (manualMode) {
            const { number, street } = extractNumberAndStreet(inputValue);
            onChange({
            number: number || undefined,
            streetName: street,
            street: inputValue,
            postalCode: manualPostalCode,
            city: manualCity,
            fullAddress: inputValue + ", " + manualPostalCode + " " + manualCity,
            });
        }
    }, [manualPostalCode, manualCity]);

    return {
        inputValue,
        suggestions,
        selectedSuggestion,
        manualPostalCode,
        manualCity,
        manualMode,
        setInputValue,
        setManualPostalCode,
        setManualCity,
        setManualMode,
        setSelectedSuggestion,
        fetchSuggestions,
        handleSelect,
    };
}
