import { useEffect, useState } from "react";
import { timeAgo } from "../../utils/timeAgo";
import ChatModal from "./ChatModal";
import { fetchUserDiscussions, getHelpOfferDiscussionById, sendHelpOfferMessage, type HelpOfferDiscussionDto, type HelpOfferMessageDto } from "../../services/helpOffer";
import type { UserSimpleDto } from "../../types/helpRequest";



const MessageOverview = () => {
    const [helpOffers, setHelpOffers] = useState<HelpOfferDiscussionDto[]>([]);
    const [selectedHelpOfferId, setSelectedHelpOfferId] = useState<number | null>(null);
    const [selectedHelpOffer, setSelectedHelpOffer] = useState<HelpOfferDiscussionDto | null>(null);
    const [currentUser, setCurrentUser] = useState<UserSimpleDto | null>(null);

    useEffect(() => {
        const loadDiscussions = async () => {
            try {
                const data = await fetchUserDiscussions();
                setHelpOffers(data);

                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setCurrentUser({
                        id: payload.userId,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                    });
                }
            } catch (err) {
                console.error("Erreur lors du chargement des discussions", err);
            }
        };

        loadDiscussions();
    }, []);

    useEffect(() => {
        const loadSelectedHelpOffer = async () => {
            if (selectedHelpOfferId !== null) {
                const updated = await getHelpOfferDiscussionById(selectedHelpOfferId);
                setSelectedHelpOffer(updated);

                // Mets aussi à jour dans la liste
                setHelpOffers((prev) =>
                    prev.map((ho) =>
                        ho.helpOfferId === updated.helpOfferId ? updated : ho
                    )
                );
            }
        };

        loadSelectedHelpOffer();
    }, [selectedHelpOfferId]);

    const getOtherUser = (helpOffer: HelpOfferDiscussionDto) => {
        if (!currentUser) return null;
        return helpOffer.helpRequest.requester.id === currentUser.id
            ? helpOffer.offerer
            : helpOffer.helpRequest.requester;
    };

    const handleSendMessage = async (message: string) => {
        if (!selectedHelpOffer || !currentUser) return;

        try {
            await sendHelpOfferMessage(selectedHelpOffer.helpOfferId, message);

            const newMsg: HelpOfferMessageDto = {
                sender: currentUser,
                content: message,
                createdAt: new Date().toISOString(),
            };

            const updatedHelpOffer = {
                ...selectedHelpOffer,
                messages: [...selectedHelpOffer.messages, newMsg],
            };

            setHelpOffers((prev) =>
                prev.map((ho) =>
                    ho.helpOfferId === updatedHelpOffer.helpOfferId ? updatedHelpOffer : ho
                )
            );

            setSelectedHelpOffer(updatedHelpOffer);
        } catch (err) {
            console.error("Erreur lors de l'envoi du message", err);
        }
    };

    const refreshHelpOffer = async () => {
        if (selectedHelpOfferId !== null) {
            const updated = await getHelpOfferDiscussionById(selectedHelpOfferId);
            setSelectedHelpOffer(updated);

            setHelpOffers((prev) =>
                prev.map((ho) =>
                    ho.helpOfferId === updated.helpOfferId ? updated : ho
                )
            );
        }
    };

    if (!currentUser) return <p>Chargement...</p>;

    return (
        <>
            <div className="card w-full max-w-[60%] p-4 space-y-4 min-h-[75vh]">
                <h1 className="text-2xl font-semibold">Messagerie</h1>

                <div className="space-y-2">
                    {helpOffers.map((helpOffer) => {
                        const lastMessage = helpOffer.messages[helpOffer.messages.length - 1];
                        const otherUser = getOtherUser(helpOffer);
                        const isUnread = lastMessage.sender.id !== currentUser.id;
                        const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${otherUser?.id ?? 0}`;

                        if (!otherUser) return null;

                        return (
                            <div
                                key={helpOffer.helpOfferId}
                                className="flex items-center p-4 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedHelpOfferId(helpOffer.helpOfferId)}
                            >
                                <img
                                    src={avatarUrl}
                                    alt={otherUser.firstName}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{otherUser.firstName} {otherUser.lastName}</p>
                                    <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                                </div>
                                <div className="text-right text-sm text-gray-400 ml-4 flex flex-col items-end">
                                    <span>{timeAgo(lastMessage.createdAt)}</span>
                                    {isUnread && (
                                        <span className="inline-block mt-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                            Nouveau
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedHelpOffer && (
                <ChatModal
                    isOpen={true}
                    onClose={() => {
                        setSelectedHelpOfferId(null);
                        setSelectedHelpOffer(null);
                    }}
                    onSendMessage={handleSendMessage}
                    helpOffer={selectedHelpOffer}
                    currentUser={currentUser}
                    onRefreshHelpOffer={refreshHelpOffer} // 🆕 passé ici
                />
            )}
        </>
    );
};

export default MessageOverview;
