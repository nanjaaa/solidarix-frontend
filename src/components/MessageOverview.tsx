import { useState } from "react";
import messagesMock, { type Discussion } from "../data/messagesMock";
import usersMock from "../data/usersMock";
import { timeAgo } from "../utils/timeAgo";
import ChatModal from "./ChatModal";

const currentUserId = 1;

const MessageOverview = () => {
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);

    const userDiscussions = messagesMock.filter((d) =>
        d.participants.includes(currentUserId)
    );

    const getOtherUser = (discussion: Discussion) => {
        const otherId = discussion.participants.find((id) => id !== currentUserId);
        return usersMock.find((u) => u.id === otherId);
    };

    const handleSendMessage = (newMessage: string) => {
        if (!selectedDiscussion) return;
        selectedDiscussion.messages.push({
            id: selectedDiscussion.messages.length + 1,
            senderId: currentUserId,
            content: newMessage,
            timestamp: new Date().toISOString(),
        });
    };

    return (
        <>
            <div className="card w-full max-w-[60%] p-4 space-y-4 min-h-[75vh]">
                <h1 className="text-2xl font-semibold">Messagerie</h1>

                <div className="space-y-2">
                    {userDiscussions.map((discussion) => {
                        const lastMessage = discussion.messages[discussion.messages.length - 1];
                        const otherUser = getOtherUser(discussion);
                        const isUnread = lastMessage.senderId !== currentUserId;

                        if (!otherUser) return null;

                        return (
                            <div
                                key={discussion.id}
                                className="flex items-center p-4 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedDiscussion(discussion)}
                            >
                                <img
                                    src={otherUser.avatarUrl}
                                    alt={otherUser.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{otherUser.name}</p>
                                    <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                                </div>
                                <div className="text-right text-sm text-gray-400 ml-4 flex flex-col items-end">
                                    <span>{timeAgo(lastMessage.timestamp)}</span>
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

            {selectedDiscussion && (
                <ChatModal
                    isOpen={true}
                    onClose={() => setSelectedDiscussion(null)}
                    currentUserId={currentUserId}
                    messages={selectedDiscussion.messages}
                    onSendMessage={handleSendMessage}
                />
            )}
        </>
    );
};

export default MessageOverview;
