import { useEffect, useState } from "react";
import { timeAgo } from "../../utils/timeAgo";
import ChatModal from "./ChatModal";
import {
    fetchUserDiscussions,
    getHelpOfferDiscussionById,
    sendHelpOfferMessage,
    type HelpOfferDiscussionDto,
    type HelpOfferMessageDto,
} from "../../services/helpOffer";
import type { UserSimpleDto } from "../../types/helpRequest";

const MessageOverview = () => {
    const [helpOffers, setHelpOffers] = useState<HelpOfferDiscussionDto[]>([]);
    const [selectedHelpOfferId, setSelectedHelpOfferId] = useState<number | null>(null);
    const [selectedHelpOffer, setSelectedHelpOffer] = useState<HelpOfferDiscussionDto | null>(null);
    const [currentUser, setCurrentUser] = useState<UserSimpleDto | null>(null);
    const [filter, setFilter] = useState<"all" | "help" | "invitation" | "friend">("all");

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
                setHelpOffers((prev) =>
                    prev.map((ho) => (ho.helpOfferId === updated.helpOfferId ? updated : ho))
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

    const getMessageType = (ho: HelpOfferDiscussionDto) => {
        const messages = ho.messages;
        if (messages.some((m) => m.isAboutInvitation)) return "invitation";
        if (messages.some((m) => m.isFromFriend)) return "friend";
        return "help";
    };

    const getUnreadCount = (ho: HelpOfferDiscussionDto) =>
        ho.messages.filter((m) => m.seenAt == null && m.sender.id !== currentUser?.id).length;

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

    const badgeColors: Record<string, string> = {
        help: "bg-primary-green",
        invitation: "bg-yellow-500",
        friend: "bg-blue-500",
    };

    const borderColors: Record<string, string> = {
        help: "border-primary-green",
        invitation: "border-yellow-500",
        friend: "border-blue-500",
    };

    const typeLabels: Record<string, string> = {
        help: "Aide",
        invitation: "Invitation",
        friend: "Ami",
    };

    const filteredHelpOffers = helpOffers.filter((ho) =>
        filter === "all" ? true : getMessageType(ho) === filter
    );

    if (!currentUser) return <p>Chargement...</p>;

    return (
        <>
            <div className="card w-full max-w-[60%] p-4 space-y-4 min-h-[75vh]">
                <h1 className="text-2xl font-semibold">Vos échanges solidaires</h1>

                <div className="flex space-x-2">
                    {["all", "help", "invitation", "friend"].map((type) => (
                        <button
                            key={type}
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                filter === type
                                    ? "bg-primary-green text-white"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                            onClick={() => setFilter(type as any)}
                        >
                            {type === "all"
                                ? "Tous"
                                : type === "help"
                                ? "Aide"
                                : type === "invitation"
                                ? "Invitation"
                                : "Entre amis"}
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    {filteredHelpOffers.map((helpOffer) => {
                        const lastMessage = helpOffer.messages.at(-1);
                        const otherUser = getOtherUser(helpOffer);
                        const unreadCount = getUnreadCount(helpOffer);
                        const type = getMessageType(helpOffer);
                        const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${otherUser?.id ?? 0}`;

                        if (!otherUser || !lastMessage) return null;

                        const backgroundColor = unreadCount > 0 ? "bg-green-50" : "bg-white";
                        const borderColor = borderColors[type];

                        return (
                            <div
                                key={helpOffer.helpOfferId}
                                className={`flex items-center p-4 rounded-xl shadow cursor-pointer hover:bg-opacity-90 border-l-4 ${borderColor} ${backgroundColor}`}
                                onClick={() => setSelectedHelpOfferId(helpOffer.helpOfferId)}
                            >
                                <img
                                    src={avatarUrl}
                                    alt={otherUser.firstName}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${badgeColors[type]}`}>
                                            {typeLabels[type]}
                                        </span>
                                        <span className="font-medium">{otherUser.firstName} {otherUser.lastName}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                                </div>
                                <div className="text-right text-sm text-gray-400 ml-4 flex flex-col items-end">
                                    <span>{timeAgo(lastMessage.createdAt)}</span>
                                    {unreadCount > 0 && (
                                        <span className="mt-1 bg-red-500 text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center">
                                            {unreadCount}
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
                    onRefreshHelpOffer={refreshHelpOffer}
                />
            )}
        </>
    );
};

export default MessageOverview;
