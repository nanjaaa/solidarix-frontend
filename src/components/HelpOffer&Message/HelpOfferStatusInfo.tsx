import { AlertCircle, Clock, Info } from "lucide-react";
import type { HelpOfferStatus } from "../../services/helpOffer";
import type { UserSimpleDto } from "../../types/helpRequest";
import InfoBanner from "../InfoBanner";

interface HelpOfferStatusInfoProps {
  status                    : HelpOfferStatus;
  currentUser               : UserSimpleDto;
  requester                 : UserSimpleDto;
  helper                    : UserSimpleDto;
  cancellationJustification?: string | null;
}

export default function HelpOfferStatusInfo({
    status,
    currentUser,
    requester,
    helper,
    cancellationJustification,
}: HelpOfferStatusInfoProps) {
    const isRequester = currentUser.id === requester.id;

    let message: React.ReactNode = "";
    let colorClass = "bg-white text-secondary-lightgray border-gray-300";
    let icon = <Info className="flex-shrink-0 w-5 h-5 text-primary-green" />;

    switch (status) {
    case "PROPOSED":
        message = isRequester ? (
        <>
            Vous avez reçu une proposition d’aide de{" "}
            <span className="text-primary-green font-bold">
            {helper.firstName} {helper.lastName}
            </span>
            . Il attend votre validation.
        </>
        ) : (
        <>
            Votre proposition d’aide a bien été envoyée à{" "}
            <span className="text-primary-green font-bold">
            {requester.firstName} {requester.lastName}
            </span>
            .
        </>
        );
        break;

    case "VALIDATED_BY_REQUESTER":
        message = isRequester ? (
        <>
            Vous avez validé la proposition d’aide de{" "}
            <span className="text-primary-green font-bold">
                {helper.firstName} {helper.lastName}
            </span>
            .
        </>
        ) : (
        <>
            Votre proposition d’aide a été validée par{" "}
            <span className="text-primary-green font-bold">
                {requester.firstName} {requester.lastName}
            </span>
            . Il attend votre confirmation.
        </>
        );
        break;

    case "CONFIRMED_BY_HELPER":
        message = isRequester ? (
        <>
            <span className="text-primary-green font-bold">
                {helper.firstName} {helper.lastName}
            </span>{" "}
            a confirmé son engagement. Vous pouvez maintenant organiser l’entraide ensemble.
        </>
        ) : (
        <>
            Vous avez confirmé votre aide à{" "}
            <span className="text-primary-green font-bold">
                {requester.firstName} {requester.lastName}
            </span>
            . L’entraide peut commencer !
        </>
        );
        break;

    case "CANCELED_BY_REQUESTER":
        message = isRequester ? (
            <>Vous avez annulé cette proposition d’aide.</>
        ) : (
            <>
                <span className="font-semibold">
                    {requester.firstName} {requester.lastName}
                </span>{" "}
                a annulé la proposition que vous lui aviez envoyée.
            </>
        );
        colorClass = "bg-orange-100 text-orange-700 border-orange-300";
        break;

    case "CANCELED_BY_HELPER":
        message = isRequester ? (
        <>
            <span className="font-semibold">
                {helper.firstName} {helper.lastName}
            </span>{" "}
            a retiré sa proposition d’aide.
        </>
        ) : (
            <>Vous avez retiré votre proposition d’aide.</>
        );
        colorClass = "bg-orange-100 text-orange-700 border-orange-300";
        break;

    case "EXPIRED":
        if (cancellationJustification === "NO_FEEDBACK_AFTER_CONFIRMATION") {
            message = (
                <>
                    Le déroulement de l’entraide est inconnu, car nous n’avons pas reçu de retour de la part des deux personnes, bien que l’entraide ait été confirmée.
                </>
            );
            colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
            icon = <Info className="flex-shrink-0 w-5 h-5 text-yellow-600" />;
        } else if (cancellationJustification === "EXPIRATION_AFTER_REQUESTER_INACTION") {
            message = isRequester ? (
                <>Trop tard… vous n’avez pas validé la proposition dans les temps.</>
            ) : (
                <>Le demandeur n’a pas réagi à temps. Votre proposition est expirée.</>
            );
        } else if (cancellationJustification === "EXPIRATION_AFTER_HELPER_INACTION") {
            message = isRequester ? (
                <>Le proposeur n’a pas confirmé dans les temps. L’offre est expirée.</>
            ) : (
                <>Trop tard… vous n’avez pas confirmé la proposition à temps.</>
            );
        } else {
            message = <>Cette proposition d’aide est expirée.</>;
        }
        colorClass = "bg-red-100 text-red-600 border-red-300";
        icon = <Clock className="text-center w-5 h-5 text-red-500" />;
        break;

    case "DONE":
        message = isRequester ? (
            <>L’entraide s’est bien achevée. Merci pour votre confiance !</>
        ) : (
            <>
            Merci d’avoir apporté votre aide à{' '}
            <span className="text-primary-green font-bold">
                {requester.firstName} {requester.lastName}
            </span>
            . L’entraide est désormais terminée.
            </>
        );
        colorClass = "bg-green-100 text-green-800 border-green-300";
        icon = <Info className="flex-shrink-0 w-5 h-5 text-green-600" />;
        break;

    case "FAILED":
        message = isRequester ? (
            <>L’entraide n’a pas abouti comme prévu.</>
        ) : (
            <>L’entraide n’a pas pu se dérouler correctement.</>
        );
        colorClass = "bg-red-100 text-red-600 border-red-300";
        icon = <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />;
        break;

    default:
        return null;
    }


    return (
        <InfoBanner
            icon={icon}
            message={message}
            className={colorClass}
        />
    );
}