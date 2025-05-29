import type { Address } from "../../hooks/UseAddressAutocomplete";

type Props = {
    suggestions: Address[];
    highlightedIndex: number;
    setHighlightedIndex: (i: number) => void;
    onSelect: (s: Address) => void;
};

export function AddressSuggestionList({
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    onSelect,
}: Props) {
    return (
        <ul className="absolute w-full border rounded-md max-h-48 overflow-y-auto bg-white shadow-md mt-1 z-10">
            {suggestions.map((suggestion, idx) => (
                    <li
                        key={idx}
                        className={`p-2 cursor-pointer hover:bg-primary-green hover:text-white ${
                            idx === highlightedIndex ? "bg-primary-green text-white" : ""
                        }`}
                        onClick={() => onSelect(suggestion)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                        {suggestion.fullAddress || `${suggestion.number ?? ""} ${suggestion.streetName ?? "fhjfgjg"}` || "Adresse inconnue"}
                    </li>
            ))}
        </ul>
    );
}

