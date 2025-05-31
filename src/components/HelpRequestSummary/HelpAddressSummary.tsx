import React from "react";
import { MapPinIcon, PencilIcon } from "lucide-react";

type HelpAddressSummaryProps = {
    street: string;
    postalCode : string;
    city: string;
    onEdit?: () => void;
};

const HelpAddressSummary: React.FC<HelpAddressSummaryProps> = ({ street, postalCode, city, onEdit }) => {
    return (
        <div className="bg-gray-50 shadow-sm rounded-xl p-5 border-l-4 border-primary-green flex items-start justify-between gap-4">

            <div className="flex flex-col flex-grow">

                <div className="flex justify-between mb-3">
                    <p className="text-sm text-secondary-lightgray font-semibold tracking-wide">
                        Où aura lieu l'entraide?
                    </p>

                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="
                                flex items-center gap-1 text-sm text-primary-green 
                                hover:text-hover-green 
                                transition-transform hover:scale-110  
                                ease-in-out
                            "
                        >
                            <PencilIcon className="w-4 h-4" />
                            Modifier
                        </button>
                    )}
                </div>

                <p className="text-secondary-lightgray font-semibold mt-1 whitespace-pre-wrap">
                    {street}, {postalCode} {city}
                </p>

                <p className="italic text-gray-600" >
                    📍Un point de rencontre clair pour rendre ce moment d’entraide aussi fluide que possible.
                </p>

            </div>
            
        </div>
    );
};

export default HelpAddressSummary;
