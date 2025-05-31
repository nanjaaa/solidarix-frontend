import React from "react";
import { PencilIcon } from "lucide-react";
import { getHelpTypeInfo } from "../../constants/helpDescription";

type HelpTypeSummaryProps = {
    value: string;
    onEdit?: () => void;
};

const HelpTypeSummary: React.FC<HelpTypeSummaryProps> = ({ value, onEdit }) => {

    const { icon, label, sentence } = getHelpTypeInfo(value);

    return (
        <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-primary-green flex items-start justify-between gap-4">
            <div className="flex flex-col flex-grow">

                <div className="flex justify-between mb-3">
                    <p className="text-sm text-secondary-lightgray font-semibold tracking-wide">
                        Type de service demandé
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
                

                <div className="flex items-center gap-1">
                    <span className="text-3xl">{icon}</span>
                    <h2 className="text-xl font-semibold text-primary-darkblue mt-1">{label}</h2>
                </div>
                <p className="italic text-gray-600" >
                    {sentence}
                </p>

            </div>
            
        </div>
    );
};

export default HelpTypeSummary;
