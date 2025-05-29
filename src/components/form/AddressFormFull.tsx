import { useAddressAutocomplete, type Address } from "../../hooks/UseAddressAutocomplete";
import { useKeyboardNavigation } from "../../hooks/UseKeyBoardNavigation";
import { AddressSuggestionList } from "./AddressSuggestionList";


type Props = {
    value?: Address;
    onChange: (address: Address) => void;
};

export function AddressFormFull({ value, onChange }: Props) {
    const {
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
        fetchSuggestions,
        handleSelect,
    } = useAddressAutocomplete({ onChange });

    const {
        highlightedIndex,
        setHighlightedIndex,
        onKeyDown,
    } = useKeyboardNavigation(
        suggestions.length,
        (index) => handleSelect(suggestions[index])
    );

    return (
        <div className="relative">
        {/* Champ rue + numéro */}
        <label className="block text-sm font-medium text-primary-darkblue">Adresse</label>
        <input
            type="text"
            value={inputValue}
            onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                setManualMode(true);
                fetchSuggestions(val);
            }}
            onFocus={() => fetchSuggestions(inputValue)}
            onKeyDown={onKeyDown}
            placeholder="ex: 12 avenue Victor Hugo"
            className="input-style w-full"
            name="lamine yamal" //pour piéger la suggestion navigateur
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

        <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Code postal */}
            <div className="flex-1">
            <label className="block text-sm font-medium text-primary-darkblue">Code postal</label>
            <input
                type="text"
                value={manualPostalCode}
                onChange={(e) => {
                setManualPostalCode(e.target.value);
                setManualMode(true);
                }}
                className="input-style"
                placeholder="ex: 75016"
            />
            </div>

            {/* Ville */}
            <div className="flex-1">
            <label className="block text-sm font-medium text-primary-darkblue">Ville</label>
            <input
                type="text"
                value={manualCity}
                onChange={(e) => {
                    setManualCity(e.target.value);
                    setManualMode(true);
                }}
                className="input-style"
                placeholder="ex: Paris"
            />
            </div>
        </div>

        {/* Champs hidden */}
        <input type="hidden" name="street" value={inputValue} />
        <input type="hidden" name="number" value={value?.number ?? ""} />
        <input type="hidden" name="streetName" value={value?.streetName ?? ""} />
        <input type="hidden" name="fullAddress" value={value?.fullAddress ?? ""} />
        <input type="hidden" name="latitude" value={value?.latitude ?? ""} />
        <input type="hidden" name="longitude" value={value?.longitude ?? ""} />
        </div>
    );
}
