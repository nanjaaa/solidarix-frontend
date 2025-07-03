import { useState } from "react";
import type { HelpOfferStatus } from "../../services/helpOffer";
import dayjs from "dayjs";
import ConfirmationPanel from "./ConfirmationPanel";

interface HelpOfferActionZoneProps {
    status: HelpOfferStatus;
    currentUserId: number;
    requesterId: number;
    helpRequestDateTime: string;
    onValidate?: () => void;
    onConfirm?: () => void;
    onCancel: () => void;
    onMarkDone?: () => void;
    onReportIncident?: () => void;
}

export default function HelpOfferActionZone({
    status,
    currentUserId,
    requesterId,
    helpRequestDateTime,
    onValidate,
    onConfirm,
    onCancel,
    onMarkDone,
    onReportIncident
}: HelpOfferActionZoneProps) {

    const [showValidateConfirm, setShowValidateConfirm] = useState(false);
    const [showConfirmConfirm, setShowConfirmConfirm] = useState(false);

    const isRequester = currentUserId === requesterId;
    const now = dayjs();
    const helpDate = dayjs(helpRequestDateTime);
    const isPast = now.isAfter(helpDate);

    let message = "";
    let showValidate = false;
    let showConfirm = false;
    let showCancel = true;
    let showMarkDone = false;
    let showReportIncident = false;

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

        case "CONFIRMED_BY_HELPER":
            if (!isPast) {
                message = isRequester
                    ? "Vous pouvez encore décliner la proposition avant l'heure prévue."
                    : "Vous pouvez encore retirer votre proposition avant l'heure prévue.";
            } else {
                message = isRequester
                    ? "L'entraide est terminée. Vous pouvez marquer comme accompli ou signaler un incident."
                    : "L'entraide est terminée. Vous pouvez signaler un incident si besoin.";
                showCancel = false;
                showMarkDone = isRequester;
                showReportIncident = true;
            }
            break;

        default:
            return null; // Rien à afficher
    }

    const cancelLabel = isRequester
        ? "Décliner la proposition"
        : "Retirer ma proposition";

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-secondary-lightgray text-center italic text-sm px-2">
                {message}
            </span>

            <div className="flex justify-center gap-3 mt-1">
                
                {showCancel && !showValidateConfirm && !showConfirmConfirm && onCancel && (
                    <button
                        className="btn-secondary"
                        onClick={onCancel}
                        aria-label={cancelLabel}
                    >
                        {cancelLabel}
                    </button>
                )}

                {showValidate && onValidate && (
                    showValidateConfirm ? (
                        <ConfirmationPanel
                            message="Souhaitez-vous vraiment valider cette proposition ?"
                            onConfirm={() => {
                                onValidate();
                                setShowValidateConfirm(false);
                            }}
                            onCancel={() => {
                                setShowValidateConfirm(false);
                            }}
                        />
                    ) : (
                        <button
                            className="btn btn-base"
                            onClick={() => setShowValidateConfirm(true)}
                            aria-label="Valider"
                        >
                            Valider
                        </button>
                    )
                )}

                {showConfirm && onConfirm && (
                    showConfirmConfirm ? (
                        <ConfirmationPanel
                            message="Souhaitez-vous vraiment confirmer votre engagement ?"
                            onConfirm={() => {
                                onConfirm();
                                setShowConfirmConfirm(false);
                            }}
                            onCancel={() => {
                                setShowConfirmConfirm(false);
                            }}
                        />
                    ) : (
                        <button
                            className="btn btn-base"
                            onClick={() => setShowConfirmConfirm(true)}
                            aria-label="Confirmer"
                        >
                            Confirmer
                        </button>
                    )
                )}

                {showMarkDone && onMarkDone && (
                    <button
                        className="btn btn-base"
                        onClick={onMarkDone}
                        aria-label="Marquer comme accompli"
                    >
                        Marquer comme accompli
                    </button>
                )}

                {showReportIncident && onReportIncident && (
                    <button
                        className="btn-secondary"
                        onClick={onReportIncident}
                        aria-label="Signaler un incident"
                    >
                        Signaler un incident
                    </button>
                )}
            </div>
        </div>
    );
}
