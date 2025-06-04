import { useRef, useState } from "react";
import type { HelpRequest } from "../types/helpRequest";
import usersMock from "../data/usersMock";
import { Heart, MessageCircle, SendHorizontal, Share2, SquareArrowDownRightIcon, SquareArrowOutUpRight } from "lucide-react";
import CommentInput from "./comment/CommentInput";
import { timeAgo } from "../utils/timeAgo";
import CommentThread from "./comment/CommentThread";
import HelpOfferModal from "./HelpOfferModal";

type Props = {
    helpRequest: HelpRequest;
    onAddComment: (content: string, parentCommentId?: number) => void;
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function HelpRequestCard({ helpRequest, onAddComment }: Props) {
    const [showComments, setShowComments] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    // Phrase introductive selon category
    let introPhrase = "";
    switch (helpRequest.category.toLowerCase()) {
        case "courses":
            introPhrase = `... demande de l’aide pour faire ses courses pour ce ${formatDate(helpRequest.helpDate)}`;
        break;
        case "transport":
            introPhrase = `... demande de l’aide pour un déplacement prévu le ${formatDate(helpRequest.helpDate)}`;
        break;
        case "jardinage":
            introPhrase = `... a besoin d’aide en jardinage, date : ${formatDate(helpRequest.helpDate)}`;
        break;
        case "garde d’enfants":
            introPhrase = `... quelqu'un pour garder les enfants pour le ${formatDate(helpRequest.helpDate)}`;
        break;
        default:
            introPhrase = `... demande de aide pour ${helpRequest.category.toLowerCase()} prévue le ${formatDate(helpRequest.helpDate)}`;
    }

    const author = usersMock.find((u) => u.id === helpRequest.authorId);
    const avatarUrl = author?.avatarUrl ?? "";
    const [replyingToId, setReplyingToId] = useState<number | null>(null);

    return (
        <div className="flex justify-center my-10">
            <div className="card-md w-full max-w-[50%]">

                {/* Header: avatar + nom + ville + âge publication */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <img
                            src={avatarUrl}
                            alt={`Avatar de ${author?.name}`}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <div className="font-sriracha">{author?.name}</div>
                            <div className="text-sm text-gray-500">{helpRequest.city}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 italic">{timeAgo(helpRequest.createdAt)}</div>
                </div>

            {/* Intro phrase */}
            <div className="pb-3 text-secondary-lightgray font-normal text-sm border-b ">{introPhrase}</div>

            {/* Description */}
            <div className="my-5 px-3 text-primary-darkblue font-semibold whitespace-pre-line">{helpRequest.description}</div>

            {/* Action bar */}
            <div className={`flex justify-between border-t pt-2 text-primary-darkblue text-sm px-10 ${
                                showComments ? "border-b  pb-2" : "pb-0"
                            }`}
            >

                <button
                    type="button"
                    className="hover:text-primary-green focus:outline-none"
                    aria-label="Réagir"
                    onClick={() => alert("Réaction (like/up/love/care) à implémenter")}
                >
                    <Heart size={24} />
                </button>

                <button
                    type="button"
                    onClick={() => setShowComments(!showComments)}
                    className="hover:text-primary-green focus:outline-none flex items-center"
                    aria-expanded={showComments}
                    aria-controls={`comments-section-${helpRequest.id}`}
                >
                    <MessageCircle size={24} />
                    <span className="ml-1 text-sm">{helpRequest.comments.length}</span>
                </button>

                <button
                    type="button"
                    className="hover:text-primary-green focus:outline-none"
                    onClick={() => alert("Fonction partager à implémenter")}
                    aria-label="Partager"
                >
                    <SquareArrowOutUpRight size={24} />
                </button>

                <button
                    type="button"
                    className="btn btn-base"
                    onClick={() => setModalOpen(true)}
                >
                    Se proposer
                </button>

            </div>

            <HelpOfferModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={(message) => {
                    // logique d'envoi de la proposition ici
                    console.log("Message envoyé :", message);
                }}
            />

            {/* Commentaires */}
            {showComments && (
            <div
                id={`comments-section-${helpRequest.id}`}
                className="space-y-3 max-h-64 overflow-y-auto"
            >
                <div className="mx-3">
                    <CommentInput />

                    <CommentThread
                        comments={helpRequest.comments}
                        onAddComment={onAddComment}
                        replyingToId={replyingToId}
                        setReplyingToId={setReplyingToId}
                    />
                </div>

            </div>
            )}

            </div>
        </div>
    );
}
