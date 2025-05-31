import { useState, useEffect } from "react";
import type { Address } from "../../hooks/UseAddressAutocomplete";
import { AddressSuggestionList } from "./AddressSuggestionList";
import { useKeyboardNavigation } from "../../hooks/UseKeyBoardNavigation";

interface ChatBubbleAddressInputProps {
    value: string; // JSON.stringify(Address)
    onChange: (value: string) => void;
    placeholder?: string;
}

export function ChatBubbleAddressInput({
    value,
    onChange,
    placeholder = "Ex: 12 rue Victor Hugo, 75001 Paris",
}: ChatBubbleAddressInputProps) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Address[]>([]);

    useEffect(() => {
        try {
            const parsed: Address = JSON.parse(value);
            if (parsed.fullAddress) setInput(parsed.fullAddress);
        } catch {
            // ignore invalid JSON
        }
    }, [value]);

    // Suggestion auto dès 3 lettres
    useEffect(() => {
        if (input.length < 3) {
            setSuggestions([]);
            return;
        }

        const handler = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(input)}&limit=5`
                );
                const data = await res.json();
                const items: Address[] = data.features.map((f: any) => ({
                    number: f.properties.housenumber,
                    streetName: f.properties.street,
                    street: f.properties.name,
                    postalCode: f.properties.postcode,
                    city: f.properties.city,
                    fullAddress: f.properties.label,
                    latitude: f.geometry.coordinates[1],
                    longitude: f.geometry.coordinates[0],
                }));
                setSuggestions(items);
            } catch {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [input]);

    const handleSelect = (address: Address) => {
        setInput(address.fullAddress ?? "");
        setSuggestions([]);
        onChange(JSON.stringify(address));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInput(rawValue);

        const regex = /^\s*(\d{1,4}(?:\s?(?:bis|ter|quater))?)?\s+([A-Za-zÀ-ÿ\d\s'\-\.]+?)\s*,?\s*(\d{5})\s*,?\s*([A-Za-zÀ-ÿ\d\s'\-\.]+)\s*$/u;
        if (regex.test(rawValue)) {
            const parsed = parseManualAddress(rawValue);
            if (parsed) {
                onChange(JSON.stringify(parsed)); // mode manuel avec adresse complète valide
                return;
            }
        }

        // Sinon, on reste en mode manuel brut
        onChange(""); // vide l'adresse
    };


    /*
    const handleBlur = () => {
        // on peut conserver ou retirer ça selon besoin
        // ici on le garde pour valider à la sortie de champ
        
        const parsed = parseManualAddress(input);
        if (parsed) {
            onChange(JSON.stringify(parsed));
        }
    };
    */

    const handleBlur = () => {
        // on peut conserver ou retirer ça selon besoin
        // ici on le garde pour valider à la sortie de champ
        setTimeout(() => {
            const parsed = parseManualAddress(input);
            if (parsed) {
                onChange(JSON.stringify(parsed));
            }
            setSuggestions([]);
        },100)       
    };

    const {
        highlightedIndex,
        setHighlightedIndex,
        onKeyDown,
    } = useKeyboardNavigation(
        suggestions.length,
        (index) => handleSelect(suggestions[index])
    );

    return (
        <div className="relative order-2 min-w-[40%] w-fit max-w-full">
            <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300  w-full min-w-[10ch] max-w-full"
                    autoComplete="off"
                    onKeyDown={onKeyDown}
                />
            {/* Suggestions */}
            {suggestions.length > 0 && (
                <AddressSuggestionList
                    suggestions={suggestions}
                    highlightedIndex={highlightedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
}

export function parseManualAddress(input: string): Address | null {
    const trimmed = input.trim();

    // Trouver le code postal
    const postalCodeMatch = trimmed.match(/\b\d{5}\b/);
    if (!postalCodeMatch) return null;

    const postalCode = postalCodeMatch[0];
    const parts = trimmed.split(postalCode);

    if (parts.length !== 2) return null;

    const before = parts[0].trim().replace(/,$/, ""); // Partie avant CP
    const after = parts[1].trim().replace(/^,/, "");  // Partie après CP

    // Extraire le numéro et le nom de rue
    const numberMatch = before.match(/^(\d{1,4}(?:\s?(?:bis|ter|quater))?)\s+(.*)$/i);
    let number: string | undefined = undefined;
    let streetName = before;

    if (numberMatch) {
        number = numberMatch[1];
        streetName = numberMatch[2];
    }

    const street = number ? `${number} ${streetName}` : streetName;

    return {
        number,
        streetName,
        street,
        postalCode,
        city: after,
        fullAddress: input,
    };
}


export function isAddressValid(value: string): boolean {
    if (!value.trim()) return false;
    // Validation par regex stricte (mode "complété")
    const regex = /^\s*(\d{1,4}(?:\s?(?:bis|ter|quater))?)?\s+([A-Za-zÀ-ÿ\d\s'\-\.]+?)\s*,?\s*(\d{5})\s*,?\s*([A-Za-zÀ-ÿ\d\s'\-\.]+)\s*$/u;
    if (regex.test(value.trim())) return true;
    // Sinon test plus permissif par parsing manuel
    return parseManualAddress(value.trim()) !== null;
}

