import type { HelpOfferStatus } from "../services/helpOffer";

export function isExpirableStatus(status: HelpOfferStatus): boolean {
    return status === "PROPOSED" || status === "VALIDATED_BY_REQUESTER";
}

// src/utils/expirationUtils.ts

export function getExpirationMessage({
    status,
    expired,
    role,
}: {
    status: HelpOfferStatus;
    expired: boolean;
    role: "requester" | "offerer";
}): string | null {
    if (!isExpirableStatus(status)) return null;

    if (expired) {

        if (status === "PROPOSED") {

            return role === "requester"
                ? "Trop tard… vous n’avez pas validé dans le délai imparti."
                : "Proposition expirée : Le demandeur n’a pas validé votre proposition à temps.";

        } else if (status === "VALIDATED_BY_REQUESTER") {
            
            return role === "requester"
                ? "Le proposeur n’a pas confirmé à temps. L’offre est expirée."
                : "Trop tard… vous n’avez pas confirmé à temps.";
        }

    } else {

        if (status === "PROPOSED") {

            return role === "requester"
                ? "Cette proposition d’aide expirera dans"
                : "Votre proposition expirera dans";

        } else if (status === "VALIDATED_BY_REQUESTER") {

            return role === "requester"
                ? "Le proposeur a jusqu’à"
                : "Vous avez jusqu’à";
        }
    }

    return null;
}
