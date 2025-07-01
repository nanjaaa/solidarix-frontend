import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { UserSimpleDto } from "../../types/helpRequest";
import { cancelHelpOffer, confirmHelpOffer, parseHelpOfferStatus, validateHelpOffer, type HelpOfferDiscussionDto } from "../../services/helpOffer";
import { useAutoResizeTextarea } from "../../hooks/UseZutoResizeTextarea";
import { isExpirableStatus } from "../../utils/expirations";
import ExpirationCountdown from "./ExpirationCountdown";
import HelpOfferActionZone from "./HelpOfferActionZone";
import CancellationPanel from "./CancellationPanel";
import HelpOfferStatusInfo from "./HelpOfferStatusInfo";
import HelpRequestPresentation from "./HelpRequestPresentation";
import dayjs from "dayjs"; // si pas déjà importé



interface ChatModalProps {
    isOpen              : boolean;
    onClose             : () => void;
    onSendMessage       : (message: string) => void;
    helpOffer           : HelpOfferDiscussionDto; 
    currentUser         : UserSimpleDto;
    onRefreshHelpOffer  : () => void; 
}

export default function ChatModal({
    isOpen,
    onClose,
    onSendMessage,
    helpOffer,
    currentUser,
    onRefreshHelpOffer,
}: ChatModalProps) {
    const [newMessage, setNewMessage] = useState("");
    const textareaRef = useAutoResizeTextarea(newMessage, 4);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showCancelPanel, setShowCancelPanel] = useState(false);
    const messages  = helpOffer.messages;
    const status    = parseHelpOfferStatus(helpOffer.status);
    const isExpired = status === "EXPIRED";
    const isConfirmed = status === "CONFIRMED_BY_HELPER";

    const helpDate = dayjs(helpOffer.helpRequest.helpDate);
    const now = dayjs();
    const isPast = now.isAfter(helpDate);

    const isChatClosed = typeof status === "string" && [
        "DONE",
        "FAILED",
        "CANCELED_BY_REQUESTER",
        "CANCELED_BY_HELPER",
        "EXPIRED"
    ].includes(status);
    
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCancellation = async (justification: string) => {
        try {
            await cancelHelpOffer(helpOffer.helpOfferId, justification);
            setShowCancelPanel(false);
            onClose();
        } catch (err) {
            console.error("Erreur lors de l'annulation :", err);
        }
    };

    const handleValidate = async () => {
        try {
            await validateHelpOffer(helpOffer.helpOfferId);
            onClose(); // ou refresh ?
        } catch (error) {
            console.error("Erreur lors de la validation :", error);
        }
    };

    const handleConfirm = async () => {
        try {
            await confirmHelpOffer(helpOffer.helpOfferId);
            onClose(); // ou refresh ?
        } catch (error) {
            console.error("Erreur lors de la confirmation :", error);
        }
    };

    const handleMarkDone = async () => {
        try {
            // Ici, tu peux appeler ton service backend, par exemple markHelpAsDone()
            console.log("Marqué comme accompli");
            onRefreshHelpOffer();
            onClose();
        } catch (error) {
            console.error("Erreur lors du marquage accompli :", error);
        }
    };

    const handleReportIncident = () => {
        // Ici, tu peux ouvrir une modale, naviguer, etc.
        console.log("Signaler un incident");
        // Exemple : onClose() ou onRefreshHelpOffer()
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ×
                </button>

                {/* Bloc fixe : Présentation */}
                <div className="p-6 pb-0 shrink-0 shadow-md rounded-2xl">
                    <HelpRequestPresentation
                        helpRequest={helpOffer.helpRequest}
                        currentUser={currentUser}
                        otherUser={
                            helpOffer.helpRequest.requester.id === currentUser.id
                                ? helpOffer.offerer
                                : helpOffer.helpRequest.requester
                        }
                        isHelper={helpOffer.offerer.id === currentUser.id}
                    />
                </div>

                {/* Bloc scrollable : messages + bas */}
                <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 space-y-2">
                    
                    {/* Zone des messages */}
                    <div className="flex flex-col gap-3 pr-2">
                        {messages.map((msg) => {
                            const isOwn = msg.sender.id === currentUser.id;
                            const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${msg.sender.id}`;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                                >
                                    {/* Avatar pour l'autre utilisateur */}
                                    {!isOwn && (
                                        <img
                                            src={avatarUrl}
                                            alt={msg.sender.firstName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}

                                    {/* Bulle de message */}
                                    <div
                                        className={`px-4 py-2 max-w-[60%] shadow-md select-none whitespace-pre-wrap break-words ${
                                            isOwn
                                                ? "bg-white text-gray-800 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl"
                                                : "bg-primary-green text-white rounded-br-3xl rounded-tl-3xl rounded-tr-3xl"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* Avatar fantôme pour aligner proprement mes messages */}
                                    {/*isOwn && <div className="w-8" />} {/* Espace vide en face */}
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>

                    {/* Zone de saisie - Lasqué dans certains cas*/}
                    {!isChatClosed && (
                    <div className="flex justify-end gap-2">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            placeholder="Écrivez un message..."
                            className="w-[60%] min-h-[40px] max-h-[300px] bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300 resize-none overflow-y-auto whitespace-pre-wrap"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        {newMessage.trim() !== "" && (
                            <button
                                onClick={() => {
                                    if (newMessage.trim()) {
                                        onSendMessage(newMessage.trim());
                                        setNewMessage("");
                                    }
                                }}
                                className="order-1 text-primary-green hover:text-hover-green transition-colors"
                                disabled={newMessage.trim() === ""}
                                aria-label="Envoyer"
                            >
                                <SendHorizontal className="w-7 h-7" />
                            </button>
                        )}
                    </div>
                    )}

                    {/* Zone d'informations de statut + actions */}
                    <div className="border-t-3 pt-3 mt-1 pb-6 px-4 flex flex-col items-center gap-2">

                        {/* Info sur le statut de l'offre (ex: validée, en attente...) */}
                        {isConfirmed && !isPast && (
                            <HelpOfferStatusInfo
                                status={status}
                                currentUser={currentUser}
                                requester={helpOffer.helpRequest.requester}
                                helper={helpOffer.offerer}
                                cancellationJustification={helpOffer.cancellationJustification}
                            />
                        )}

                        {/* Compte à rebours avant expiration (si applicable) */}
                        {isExpirableStatus(status) && (
                            <div className="w-full flex justify-center">
                                <ExpirationCountdown
                                    expirationReference={helpOffer.expirationReference}
                                    status={status}
                                    currentUserId={currentUser.id}
                                    requesterId={helpOffer.helpRequest.requester.id}
                                    onExpire={onRefreshHelpOffer}
                                />
                            </div>
                        )}

                        {/* Zone d'actions principales (valider, confirmer, annuler) */}
                        {!showCancelPanel && (
                            <HelpOfferActionZone
                                status={status}
                                currentUserId={currentUser.id}
                                requesterId={helpOffer.helpRequest.requester.id}
                                helpRequestDateTime={helpOffer.helpRequest.helpDate}
                                onCancel={() => setShowCancelPanel(true)}
                                onValidate={handleValidate}
                                onConfirm={handleConfirm}
                                onMarkDone={handleMarkDone}
                                onReportIncident={handleReportIncident}
                            />
                        )}

                        {/* Panneau d'annulation avec champ justification */}
                        {showCancelPanel && (
                            <CancellationPanel
                                isRequester={currentUser.id === helpOffer.helpRequest.requester.id}
                                onCancel={() => setShowCancelPanel(false)}
                                onConfirm={handleCancellation}
                            />
                        )}
                    </div>
                                       
                </div>
            </div>
        </div>
    );
}