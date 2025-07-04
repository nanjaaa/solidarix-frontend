import { Calendar, MapPin } from "lucide-react";
import type { HelpRequestDto, UserSimpleDto } from "../../types/helpRequest";
import { getHelpRequestPresentationTitle, type HelpCategory } from "../../services/helpRequest";

interface HelpRequestPresentationProps {
    helpRequest: HelpRequestDto;
    currentUser: UserSimpleDto;
    otherUser: UserSimpleDto;
    isHelper: boolean;
}

export default function HelpRequestPresentation({
    helpRequest,
    currentUser,
    otherUser,
    isHelper,
}: HelpRequestPresentationProps) {

    const formattedDate = new Date(helpRequest.helpDate).toLocaleString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="mb-4 p-4">
            {/* Titre */}
            <h3 className="text-2xl font-extrabold text-primary-darkblue mb-3">
                {getHelpRequestPresentationTitle(helpRequest.category as HelpCategory, otherUser, isHelper)}
            </h3>

            {/* Description */}
            <div className="text-secondary-lightgray mb-4">
                <p className="text-sm mb-1 font-medium">
                    Voici ce que {otherUser.firstName} a partagé :
                </p>
                <p className="italic leading-relaxed mt-1 text-md">
                    " {helpRequest.description || "Aucune description fournie pour cette demande."} "
                </p>
            </div>

            {/* Adresse + Date */}
            <div className="flex flex-col gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-green" />
                    <span>{helpRequest.address?.fullAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-green" />
                    <span className="capitalize">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
}
