import { useState } from "react";
import type { HelpOfferStatus } from "../../services/helpOffer";
import dayjs from "dayjs";
import ConfirmationPanel from "./ConfirmationPanel";

interface HelpOfferActionZoneProps {
    status: HelpOfferStatus;
    currentUserId: number;
    otherUserName: string;
    requesterId: number;
    helpRequestDateTime: string;
    onValidate?: () => void;
    onConfirm?: () => void;
    onCancel: () => void;
    onMarkDone?: () => void;
    onReportIncident?: () => void;
    shouldSubmitExperience?: boolean;
    onSubmitExperience: () => void;
    isCurrentUserFirstIncidentReporter?: boolean
}

export default function HelpOfferActionZone({
    status,
    currentUserId,
    otherUserName,
    requesterId,
    helpRequestDateTime,
    onValidate,
    onConfirm,
    onCancel,
    onMarkDone,
    onReportIncident,
    shouldSubmitExperience,
    onSubmitExperience,
    isCurrentUserFirstIncidentReporter
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
                    ? "Vous avez la possibilité d’abandonner cette entraide avant l’heure fixée."
                    : "Vous avez la possibilité de retirer votre engagement tant que l’heure prévue n’est pas atteinte. ";
            } else {
                message = isRequester
                    ? "L'entraide est terminée? Vous pouvez marquer comme accompli ou signaler un incident."
                    : "L'entraide est terminée? N’hésitez pas à signaler tout incident éventuel .";
                showCancel = false;
                showMarkDone = isRequester;
                showReportIncident = true;
            }
            break;

        case "DONE":
            if (!isRequester) {
                message = "Vous avez laissé un retour d'expérience.";
            } else {
                if (shouldSubmitExperience) {
                    message = `${otherUserName} a laissé un retour d'expérience.`;
                } else {
                    message = `Vous et ${otherUserName} avez laissé un retour d'expérience.`;
                }
            }
            showCancel = false;
            break;

        case "FAILED":
            if (isCurrentUserFirstIncidentReporter) {
                message = "Vous avez signalé un incident lors de cette entraide.";
            } else if (shouldSubmitExperience) {
                message = `${otherUserName} a signalé un incident lors de cette entraide.`;
            } else {
                message = `Un ou des incidents ont été signalés lors de cette entraide.`;
            }
            showCancel = false;
            break;

    default:
        showCancel = false;
        message = ""; // Rien à afficher


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

                {shouldSubmitExperience && (
                    <button
                        className="btn btn-base"
                        onClick={onSubmitExperience}
                        aria-label={
                            (status as string) === "FAILED"
                                ? "Donner mon avis sur l'incident"
                                : "Laisser un retour sur l’entraide"
                        }
                    >
                        {(status as string) === "FAILED" ? "Donner des précisions sur l’incident" : "Laisser un commentaire sur l’entraide"}
                    </button>
                )}

                {status === "FAILED" && (
                    <button
                        className="btn btn-base"
                        onClick={
                            /*Ajouter ici la fonction qui redirige vers le rapport d'incident*/
                            () => {}
                        }
                        aria-label="Voir le rapport d'incident"
                    >
                        Voir le rapport d'incident
                    </button>
                )}

                {status === "DONE" && (
                    <button
                        className="btn btn-base"
                        onClick={
                            /*Ajouter ici la fonction qui redirige vers les feddbacks*/
                            () => {}
                        }
                        aria-label="Voir les retours"
                    >
                        Voir les retours
                    </button>
                )}

            </div>
        </div>
    );
}
