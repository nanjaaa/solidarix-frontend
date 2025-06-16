import type { HelpOfferStatus } from "../../services/helpOffer";


interface HelpOfferActionZoneProps {
    status: HelpOfferStatus;
    currentUserId: number;
    requesterId: number;
    onValidate?: () => void;
    onConfirm?: () => void;
    onCancel: () => void;
}

export default function HelpOfferActionZone({
    status,
    currentUserId,
    requesterId,
    onValidate,
    onConfirm,
    onCancel,
}: HelpOfferActionZoneProps) {
    const isRequester = currentUserId === requesterId;

    let message = "";
    let showValidate = false;
    let showConfirm = false;

    switch (status) {
        case "PROPOSED":
        message = isRequester
            ? "Vous avez reçu une proposition. Échangez avec le proposeur si besoin, puis validez ou annulez sa proposition."
            : "Discutez avec le demandeur pour bien cerner ses besoins. Informez-le de vos disponibilités, puis attendez sa validation.";
        showValidate = isRequester;
        break;

        case "VALIDATED_BY_REQUESTER":
        message = isRequester
            ? "Vous avez validé la proposition. Le proposeur doit maintenant confirmer son engagement."
            : "Le demandeur a validé votre proposition. Vous pouvez confirmer pour finaliser l’entraide.";
        showConfirm = !isRequester;
        break;

        default:
        return null; // Rien à afficher
    }

    const cancelLabel = isRequester
        ? "Décliner la proposition"
        : "Retirer ma proposition"

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-secondary-lightgray text-center italic text-sm px-2">
                {message}
            </span>

            <div className="flex justify-center gap-3 mt-1">
                <button
                    className="btn-secondary"
                    onClick={onCancel}
                    aria-label={cancelLabel}
                >
                    {cancelLabel}
                </button>

                {showValidate && onValidate && (
                    <button
                        className="btn btn-base"
                        onClick={onValidate}
                        aria-label="Valider"
                    >
                        Valider
                    </button>
                )}

                {showConfirm && onConfirm && (
                    <button
                        className="btn btn-base"
                        onClick={onConfirm}
                        aria-label="Confirmer"
                    >
                        Confirmer
                    </button>
                )}
            </div>
        </div>
    );
}
