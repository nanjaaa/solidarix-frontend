import React from "react";
import { CalendarClockIcon, PencilIcon } from "lucide-react";

type HelpDateTimeSummaryProps = {
  dateTime: string;      // ex: '2025-07-09T14:50
  onEdit?: () => void;
};

const HelpDateTimeSummary: React.FC<HelpDateTimeSummaryProps> = ({ dateTime, onEdit }) => {

    const dateObj = new Date(dateTime);

    // Format affichage lisible
    const formattedDate = dateObj.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-primary-green flex items-center justify-between gap-4">

            <div className="flex flex-col flex-grow">

                <div className="flex justify-between mb-3">
                    <p className="text-md text-secondary-lightgray font-semibold tracking-wide">
                        Quand as-tu besoin d'aide?
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

                <p className="text-secondary-lightgray font-medium mt-1 whitespace-pre-wrap">
                    📅 Ce {formattedDate} à {formattedTime}
                </p>

                <p className="italic text-gray-600" >
                    On bloque ce créneau pour toi.
                </p>

            </div>
            
        </div>
    );
};

export default HelpDateTimeSummary;
