import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { UserSimpleDto } from "../../types/helpRequest";
import {
    cancelHelpOffer,
    confirmHelpOffer,
    parseHelpOfferStatus,
    validateHelpOffer,
    type HelpOfferDiscussionDto,
    addHelpOfferFeedback,
    markHelpOfferAsDone,
    markHelpOfferAsFailed,
    reportHelpOfferIncident,
} from "../../services/helpOffer";
import { useAutoResizeTextarea } from "../../hooks/UseZutoResizeTextarea";
import { isExpirableStatus } from "../../utils/expirations";
import ExpirationCountdown from "./ExpirationCountdown";
import HelpOfferActionZone from "./HelpOfferActionZone";
import CancellationPanel from "./CancellationPanel";
import HelpOfferStatusInfo from "./HelpOfferStatusInfo";
import HelpRequestPresentation from "./HelpRequestPresentation";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { IncidentPanel } from "./IncidentPanel";
import { FeedbackPanel } from "./FeedbackPanel";

dayjs.extend(localizedFormat);
dayjs.locale("fr");


interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendMessage: (message: string) => void;
    helpOffer: HelpOfferDiscussionDto;
    currentUser: UserSimpleDto;
    onRefreshHelpOffer: () => void;
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
    const [showCancelPanel, setShowCancelPanel] = useState(false);
    const [showIncidentPanel, setShowIncidentPanel] = useState(false);
    const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

    const textareaRef = useAutoResizeTextarea(newMessage, 4);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);


    const isHelper = helpOffer.offerer.id === currentUser.id;
    const messages = helpOffer.messages;
    const prevMessagesLength = useRef(helpOffer.messages.length);

    const status = parseHelpOfferStatus(helpOffer.status);
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);



    const isChatClosed = typeof status === "string" && [
        "DONE",
        "FAILED",
        "CANCELED_BY_REQUESTER",
        "CANCELED_BY_HELPER",
        "EXPIRED"
    ].includes(status);

    const shouldSubmitExperience = (
        (status === "FAILED" && !helpOffer.hasCurrentUserReportedIncident) ||
        (status === "DONE" && !helpOffer.hasCurrentUserSubmittedFeedback)
    );

    const otherUser = helpOffer.helpRequest.requester.id === currentUser.id
        ? helpOffer.offerer
        : helpOffer.helpRequest.requester;


    // ---------------- handleClose complet -----------------
    const handleClose = useCallback(async () => {
        onClose();
    }, [helpOffer.helpOfferId, onRefreshHelpOffer, onClose]);

    // Focus sur textarea à l'ouverture
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen, textareaRef]);

    // Esc pour fermer avec handleClose
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [handleClose]);

    // Scroll toujours en bas
    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessagesLength.current = messages.length;
    }, [messages.length]);

    // Polling pour rafraîchir dans modal
    useEffect(() => {
        if (!isOpen) return;

        let prevScrollHeight = 0;
        let prevScrollTop = 0;
        let prevLength = messages.length;

        const interval = setInterval(async () => {
            if (messagesContainerRef.current) {
                prevScrollHeight = messagesContainerRef.current.scrollHeight;
                prevScrollTop = messagesContainerRef.current.scrollTop;
                prevLength = messages.length;
            }

            await onRefreshHelpOffer();

            setTimeout(() => {
                if (
                    messagesContainerRef.current &&
                    messages.length === prevLength // <---- si pas de nouveau message, on restaure la position précédente !
                ) {
                    messagesContainerRef.current.scrollTop =
                        messagesContainerRef.current.scrollHeight - (prevScrollHeight - prevScrollTop);
                }
            }, 0);
        }, 1000);

        return () => clearInterval(interval);
        // ajoute messages dans les dépendances si besoin
    }, [isOpen, onRefreshHelpOffer, messages]);


    const handleCancellation = async (justification: string) => {
        try {
            await cancelHelpOffer(helpOffer.helpOfferId, justification);
            setShowCancelPanel(false);
            handleClose();
        } catch (err) {
            console.error("Erreur lors de l'annulation :", err);
        }
    };

    const handleValidate = async () => {
        try {
            await validateHelpOffer(helpOffer.helpOfferId);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la validation :", error);
        }
    };

    const handleConfirm = async () => {
        try {
            await confirmHelpOffer(helpOffer.helpOfferId);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la confirmation :", error);
        }
    };

    const handleMarkDone = () => {
        setShowFeedbackPanel(true);
    };

    const handleSubmitFeedbackAndClose = async (feedback: string) => {
        try {
            if (isHelper) {
                await addHelpOfferFeedback(helpOffer.helpOfferId, feedback);
            } else {
                await markHelpOfferAsDone(helpOffer.helpOfferId, feedback);
            }
            setShowFeedbackPanel(false);
            handleClose();
            onRefreshHelpOffer();
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de l'envoi du feedback.");
        }
    };

    const handleReportIncident = () => {
        setShowIncidentPanel(true);
    };

    const handleSubmitIncidentReport = async (data: { type: string; description: string }) => {
    try {
        if (status === "CONFIRMED_BY_HELPER") {
            await markHelpOfferAsFailed(helpOffer.helpOfferId, data);
        } else {
            await reportHelpOfferIncident(helpOffer.helpOfferId, data);
        }
        setShowIncidentPanel(false);
        handleClose();
        onRefreshHelpOffer();
    } catch (err) {
        console.error(err);
        alert("Une erreur est survenue lors de la déclaration de l’incident.");
    }
    };

    const handleOpenReviewPanel = () => {
        if (status === "FAILED") {
            setShowIncidentPanel(true);
        } else if (status === "DONE") {
            setShowFeedbackPanel(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">

                {/* HEADER, non scrollable */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ×
                </button>

                {/* Présentation */}
                <div className="p-6 shadow-md rounded-2xl">
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

                 {/* CORPS scrollable */}
                {showIncidentPanel ? (
                    // AFFICHER UNIQUEMENT LE IncidentPanel
                    <div 
                        className="flex-1 flex flex-col items-start px-6 pt-4 overflow-y-auto min-h-0"
                    >
                        <IncidentPanel
                            isHelper={isHelper}
                            onCancel={() => {
                                setShowIncidentPanel(false);
                                // une fois le panel fermé, on remet le focus sur le textarea de chat
                                setTimeout(() => textareaRef.current?.focus(), 0);
                            }}
                            onSubmit={handleSubmitIncidentReport}
                        />
                    </div>
                ) : showFeedbackPanel ? (
                        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-6 pt-4">
                            <FeedbackPanel
                                isHelper={isHelper}
                                onCancel={() => {
                                    setShowFeedbackPanel(false);
                                    setTimeout(() => textareaRef.current?.focus(), 0);
                                }}
                                onSubmit={handleSubmitFeedbackAndClose}
                            />
                        </div>
                    ) : (

                    <>
                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 space-y-2"
                        >
                            <div className="flex flex-col gap-3 pr-2">
                                {(() => {
                                    let lastMessageDate: string | null = null;
                                    return messages.flatMap((msg, index) => {
                                        const messageDate = dayjs(msg.createdAt);
                                        const messageDateFormatted = messageDate.format("YYYY-MM-DD");
                                        const showDateSeparator = messageDateFormatted !== lastMessageDate;
                                        lastMessageDate = messageDateFormatted;

                                        const dateLabel = messageDate.isSame(dayjs(), "day")
                                            ? "Aujourd’hui"
                                            : messageDate.format("D MMMM YYYY");

                                        const isOwn = msg.sender.id === currentUser.id;
                                        const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${msg.sender.id}`;
                                        const timeLabel = messageDate.format("HH:mm");
                                        const isActive = activeMessageId === msg.id;

                                        // Styles selon type et actif
                                        const bubbleBase = isOwn
                                            ? "bg-white text-gray-800 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl"
                                            : "bg-primary-green text-white rounded-br-3xl rounded-tl-3xl rounded-tr-3xl";
                                        const bubbleActive = isOwn
                                            ? "bg-gray-200 text-gray-700"
                                            : "bg-green-700 text-green-50";

                                        return [
                                            showDateSeparator && (
                                                <div
                                                    key={"date-separator-" + index}
                                                    className="text-center text-sm text-gray-400 mt-4 mb-2 select-none"
                                                >
                                                    {dateLabel}
                                                </div>
                                            ),
                                            <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"} items-end`}>
                                                {!isOwn && (
                                                    <img
                                                        src={avatarUrl}
                                                        alt={msg.sender.firstName}
                                                        className="w-8 h-8 rounded-full self-start mt-1"
                                                    />
                                                )}
                                                <div className="flex flex-col max-w-[60%]">
                                                    <div
                                                        className={`
                                                            px-4 py-2 shadow-md select-none whitespace-pre-wrap break-words
                                                            transition-colors duration-150 cursor-pointer
                                                            ${bubbleBase} ${isActive ? bubbleActive : ""}
                                                            ${isOwn ? "self-end" : "self-start"}
                                                        `}
                                                        onClick={() => setActiveMessageId(isActive ? null : msg.id ?? null)}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    {isActive && (
                                                        <div
                                                            className={`
                                                            text-xs mt-1 transition-colors duration-150
                                                            ${isOwn ? "text-gray-700 text-right self-end" : "text-hover-green text-left self-start"}
                                                            `}
                                                        >
                                                            Envoyé à {timeLabel}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ].filter(Boolean);
                                        });
                                    })
                                ()}
                                <div ref={scrollRef} />
                            </div>

                            {/* Zone de saisie */}
                            {!isChatClosed && (
                                <div className="flex justify-end gap-2">
                                    <textarea
                                        ref={textareaRef}
                                        rows={1}
                                        placeholder="Écrivez un message..."
                                        className="
                                            w-[60%] 
                                            min-h-[40px] 
                                            max-h-[300px] 
                                            bg-background-ow 
                                            outline-none 
                                            px-4 py-2 
                                            rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl 
                                            shadow-inner border border-gray-300 
                                            resize-none 
                                            overflow-y-auto 
                                            whitespace-pre-wrap"
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

                            {/* Footer actions */}
                            <div className="border-t-3 pt-3 mt-1 pb-6 px-4 flex flex-col items-center gap-2">
                                {
                                    <HelpOfferStatusInfo
                                        status={status}
                                        currentUser={currentUser}
                                        requester={helpOffer.helpRequest.requester}
                                        helper={helpOffer.offerer}
                                        cancellationJustification={helpOffer.cancellationJustification}
                                    />
                                }

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

                                {!showCancelPanel && (
                                    <HelpOfferActionZone
                                        status={status}
                                        currentUserId={currentUser.id}
                                        otherUserName={otherUser.firstName}
                                        requesterId={helpOffer.helpRequest.requester.id}
                                        helpRequestDateTime={helpOffer.helpRequest.helpDate}
                                        onCancel={() => setShowCancelPanel(true)}
                                        onValidate={handleValidate}
                                        onConfirm={handleConfirm}
                                        onMarkDone={handleMarkDone}
                                        onReportIncident={handleReportIncident}
                                        shouldSubmitExperience={shouldSubmitExperience}
                                        onSubmitExperience={handleOpenReviewPanel}
                                        isCurrentUserFirstIncidentReporter={helpOffer.isCurrentUserFirstIncidentReporter ?? false}
                                    />
                                )}

                                {showCancelPanel && (
                                    <CancellationPanel
                                        isRequester={currentUser.id === helpOffer.helpRequest.requester.id}
                                        onCancel={() => setShowCancelPanel(false)}
                                        onConfirm={handleCancellation}
                                    />
                                )}

                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
