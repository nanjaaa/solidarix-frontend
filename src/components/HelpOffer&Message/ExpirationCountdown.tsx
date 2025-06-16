import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import type { HelpOfferStatus } from "../../services/helpOffer";
import InfoBanner from "../InfoBanner";

interface ExpirationCountdownProps {
    expirationReference: string; // ISO string
    status: HelpOfferStatus;
    currentUserId: number;
    requesterId: number;
    onExpire: () => void;
}

const ExpirationCountdown = ({
    expirationReference,
    status,
    currentUserId,
    requesterId,
    onExpire,
}: ExpirationCountdownProps) => {
    const [remaining, setRemaining] = useState("");
    const [expired, setExpired] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleExpire = () => {
        setRefreshKey(prev => prev + 1);
    };

    const isRequester = currentUserId === requesterId;

    const effectiveStatus: HelpOfferStatus =
        expired && (status === "PROPOSED" || status === "VALIDATED_BY_REQUESTER")
            ? "EXPIRED"
            : status;

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const reference = new Date(expirationReference);
            const expiration = new Date(reference.getTime() + 24 * 60 * 60 * 1000); // +24h

            const diff = expiration.getTime() - now.getTime();

            if (diff <= 0) {
                setExpired(true);
                setRemaining("00h 00mn");
                onExpire();
                return;
            }

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            setRemaining(`${hours}h ${minutes < 10 ? "0" : ""}${minutes}min`);
        };

        update(); // appel initial
        const interval = setInterval(update, 60000); // mise à jour toutes les minutes

        return () => clearInterval(interval);
    }, [expirationReference]);


    const getMessage = () => {
        if (expired) {
            if (effectiveStatus === "PROPOSED") {
                return isRequester
                    ? "Trop tard… vous n’avez pas validé dans le délai imparti."
                    : "Proposition expirée : Le demandeur n’a pas validé votre proposition à temps.";
            }
            if (effectiveStatus === "VALIDATED_BY_REQUESTER") {
                return isRequester
                    ? "Le proposeur n’a pas confirmé à temps. L’offre est expirée."
                    : "Trop tard… vous n’avez pas confirmé à temps.";
            }
            if (effectiveStatus === "EXPIRED") {
                return isRequester
                    ? "La proposition d'aide est expirée."
                    : "Votre proposition d'aide a expiré.";
            }
            return "Cette offre a expiré.";
        }

        if (effectiveStatus === "PROPOSED") {
            return isRequester ? (
                <>
                    Vous avez encore{" "}
                    <span className="text-primary-green font-bold">
                        {remaining}
                    </span>{" "}
                    pour valider.
                </>
            ) : (
                <>
                    Votre proposition expirera dans{" "}
                    <span className="text-primary-green font-bold">
                        {remaining}
                    </span>{" "}
                    si le demandeur ne réagit pas.
                </>
            );
        }

        if (effectiveStatus === "VALIDATED_BY_REQUESTER") {
            return isRequester ? (
                <>
                    Le proposeur doit confirmer dans{" "}
                    <span className="text-primary-green font-bold">
                        {remaining}
                    </span>
                </>
            ) : (
                <>
                    Vous devez confirmer votre engagement dans{" "}
                    <span className="text-primary-green font-bold">
                        {remaining}
                    </span>
                </>
            );
        }

        return "";
    };

    const message = getMessage();

    return (
        <InfoBanner
            icon={
                <Clock
                    className={`w-4 h-4 ${
                    expired ? "text-red-500" : "text-primary-green"
                    }`}
                />
            }
            message={message}
            className={
                expired
                    ? "bg-red-100 text-red-600 border-red-300"
                    : "bg-white text-secondary-lightgray border-gray-300"
            }
        />
    );
};

export default ExpirationCountdown;
