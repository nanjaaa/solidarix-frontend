import React from "react";
import { FileTextIcon, PencilIcon } from "lucide-react";

type HelpDescriptionSummaryProps = {
    value: string;
    onEdit?: () => void;
};

const HelpDescriptionSummary: React.FC<HelpDescriptionSummaryProps> = ({ value, onEdit }) => {
    return (
        <div className="bg-gray-50 shadow-md rounded-xl p-5 border-l-4 border-primary-green flex items-start justify-between gap-4">
            
            <div className="flex flex-col flex-grow">

                <div className="flex justify-between mb-3">
                    <p className="text-sm text-secondary-lightgray font-semibold tracking-wide">
                        Description du besoin
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

                <p className="text-secondary-lightgray whitespace-pre-wrap leading-relaxed font-handwriting before:content-['“'] after:content-['”']">
                    {value}
                </p>

                <p className="italic text-gray-600" >
                    ✨ Merci pour ta confiance. Ensemble, on trouvera des solutions adaptées à ton besoin.
                </p>

            </div>

        </div>
    );
};

export default HelpDescriptionSummary;
