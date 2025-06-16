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
    const isInputDisabled = isExpired || showCancelPanel;
    
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] p-6 flex flex-col relative">
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl">
                    ×
                </button>

                <h2 className="text-lg font-bold mb-4">Messagerie</h2>

                {/* Zone des messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg) => {
                        const isOwn = msg.sender.id === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-2 max-w-[60%] shadow-md select-none whitespace-pre-wrap break-words ${
                                        isOwn
                                        ? "bg-white text-gray-800 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl"
                                        : "bg-primary-green text-white rounded-br-3xl rounded-tl-3xl rounded-tr-3xl"
                                    }`}
                                    >
                                    {msg.content}
                                </div>
                        </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Zone de saisie */}
                <div className="flex justify-end mt-2 gap-2">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Écrivez un message..."
                        className="w-[60%] min-h-[40px] max-h-[300px] bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300 resize-none overflow-y-auto whitespace-pre-wrap"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isInputDisabled}
                    />

                    { newMessage.trim() !== "" && (                     
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


                {/** Bloc d'information sur le statut du helpOffer */}
                <div className="mt-10 flex justify-center">
                    <HelpOfferStatusInfo
                        status={status}
                        currentUser={currentUser}
                        requester={helpOffer.helpRequest.requester}
                        helper={helpOffer.offerer}
                        cancellationJustification={helpOffer.cancellationJustification}
                    />
                </div>

    
                {/** Zone d'affichage du compte à rebours d'expiration */}
                {isExpirableStatus(status) && (
                    <div className="mt-0 p-4 flex justify-center">
                        <ExpirationCountdown
                            expirationReference={helpOffer.expirationReference}
                            status={status}
                            currentUserId={currentUser.id}
                            requesterId={helpOffer.helpRequest.requester.id}
                            onExpire={onRefreshHelpOffer}
                        />
                    </div>
                )}        


                {/*Zone de validation/annulation*/}
                { !showCancelPanel && (
                    <HelpOfferActionZone
                        status={status}
                        currentUserId={currentUser.id}
                        requesterId={helpOffer.helpRequest.requester.id}
                        onCancel={() => setShowCancelPanel(true)} // on affiche le panneau
                        onValidate={handleValidate}
                        onConfirm={handleConfirm}
                    />
                    )
                }
                


                {/** Zonne d'annulation */}
                {showCancelPanel && (
                    <CancellationPanel
                        isRequester={currentUser.id === helpOffer.helpRequest.requester.id}
                        onCancel={() => setShowCancelPanel(false)}
                        onConfirm={handleCancellation}
                    />
                )}

            </div>
        </div>
    );
}
