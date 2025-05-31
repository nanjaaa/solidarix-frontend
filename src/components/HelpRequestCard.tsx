import { useState } from "react";
import type { HelpRequest } from "../types/helpRequest";
import usersMock from "../data/usersMock";
import { Heart, MessageCircle, Share2, SquareArrowDownRightIcon, SquareArrowOutUpRight } from "lucide-react";

type Props = {
    helpRequest: HelpRequest;
};

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "À l’instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${diffDays} j`;
}

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

export default function HelpRequestCard({ helpRequest }: Props) {
    const [showComments, setShowComments] = useState(false);

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

    return (
        <div className="flex justify-center my-5">
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
            <div className="flex justify-between border-t pt-2 text-primary-darkblue text-sm px-10">

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
                    onClick={() => ""}
                >
                    Se proposer
                </button>

            </div>

            {/* Commentaires */}
            {showComments && (
            <div
                id={`comments-section-${helpRequest.id}`}
                className="mt-3 border-t pt-3 space-y-3 max-h-64 overflow-y-auto"
            >
                {helpRequest.comments.length === 0 ? (
                <div className="text-gray-500 text-sm italic">Aucun commentaire pour le moment.</div>
                ) : (
                helpRequest.comments.map((comment) => {
                    const commentAuthor = usersMock.find(u => u.id === comment.authorId);
                    const commentAvatarUrl = commentAuthor?.avatarUrl ?? "/img/default-avatar.png";

                    return (
                    <div key={comment.id}>
                        <div className="flex items-start gap-2">
                        <img
                            src={commentAvatarUrl}
                            alt={`Avatar de ${commentAuthor?.name ?? "utilisateur inconnu"}`}
                            className="w-8 h-8 rounded-full object-cover mt-1"
                        />
                        <div className="bg-gray-100 rounded-md p-2 flex-1">
                            <div className="font-semibold text-sm">{commentAuthor?.name ?? "Utilisateur inconnu"}</div>
                            <div className="text-xs text-gray-500 mb-1 italic">{timeAgo(comment.createdAt)}</div>
                            <div>{comment.content}</div>
                        </div>
                        </div>

                        {/* Replies niveau 2 */}
                        {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-10 mt-1 space-y-1">
                            {comment.replies.map((reply) => {
                                const replyAuthor = usersMock.find(u => u.id === reply.authorId);
                                const replyAvatarUrl = replyAuthor?.avatarUrl ?? "/img/default-avatar.png";

                                return (
                                    <div key={reply.id} className="flex items-start gap-2">
                                    <img
                                        src={replyAvatarUrl}
                                        alt={`Avatar de ${replyAuthor?.name ?? "utilisateur inconnu"}`}
                                        className="w-6 h-6 rounded-full object-cover mt-1"
                                    />
                                    <div className="bg-gray-200 rounded-md p-2 flex-1 text-sm">
                                        <div className="font-semibold">{replyAuthor?.name ?? "Utilisateur inconnu"}</div>
                                        <div className="text-xs text-gray-500 mb-1 italic">{timeAgo(reply.createdAt)}</div>
                                        <div>{reply.content}</div>
                                    </div>
                                    </div>
                                );
                        
                            })}
                        </div>
                        )}
                    </div>
                    );
                })
                )}
            </div>
            )}

            </div>
        </div>
    );
}
