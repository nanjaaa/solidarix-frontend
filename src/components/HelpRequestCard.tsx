import { useState } from "react";
import type { PublicHelpRequestDto, Comment } from "../types/helpRequest";
import { Heart, MessageCircle, SquareArrowOutUpRight } from "lucide-react";
import CommentInput from "./comment/CommentInput";
import { timeAgo } from "../utils/timeAgo";
import CommentThread from "./comment/CommentThread";
import HelpOfferModal from "./HelpOfferModal";
import { categoryMessages, postComment } from "../services/helpRequest";

interface Props {
  helpRequest: PublicHelpRequestDto;
  onAddComment: (content: string, parentCommentId?: number) => void;
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
    const [isModalOpen, setModalOpen] = useState(false);
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [comments, setComments] = useState<Comment[]>(helpRequest.comments);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const requester = helpRequest.requester;
    const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${requester.id}`;

    const categoryKey = helpRequest.category.toUpperCase();
    const formattedDate = formatDate(helpRequest.helpDate);
    const introPhrase =
        categoryMessages[categoryKey]?.(formattedDate) ??
        `... demande de l’aide pour ${helpRequest.category.toLowerCase()} prévue le ${formattedDate}`;

    const handleAddComment = async (content: string, parentCommentId?: number) => {
        setIsSubmitting(true);
        try {
            const newComment = await postComment({
                helpRequestId: helpRequest.id,
                content,
                parentCommentId,
            });

            if (parentCommentId) {
                setComments(prev =>
                prev.map(comment =>
                    comment.id === parentCommentId
                    ? { ...comment, replies: [...(comment.replies ?? []), newComment] }
                    : comment
                )
                );
            } else {
                setComments(prev => [...prev, { ...newComment, replies: [] }]);
            }

            setReplyingToId(null);
        } catch (e) {
            console.error("Erreur lors de l'ajout du commentaire :", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center my-10">
            <div className="card-md w-full max-w-[50%]">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <img
                        src={avatarUrl}
                        alt={`Avatar de User${requester.id}`}
                        className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                        <div className="font-sriracha">
                            {requester.firstName} {requester.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{helpRequest.postalSummary}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 italic">{timeAgo(helpRequest.createdAt)}</div>
                </div>

                <div className="pb-3 text-secondary-lightgray font-normal text-sm border-b ">{introPhrase}</div>

                <div className="my-5 px-3 text-primary-darkblue font-semibold whitespace-pre-line">
                    {helpRequest.description}
                </div>

                <div
                    className={`flex justify-between border-t pt-2 text-primary-darkblue text-sm px-10 ${
                        showComments ? "border-b pb-2" : "pb-0"
                    }`}
                >
                    <button
                        type="button"
                        className="hover:text-primary-green focus:outline-none"
                        aria-label="Réagir"
                        onClick={() => alert("Réaction à implémenter")}
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
                        <span className="ml-1 text-sm">{comments.length}</span>
                    </button>

                    <button
                        type="button"
                        className="hover:text-primary-green focus:outline-none"
                        onClick={() => alert("Fonction partager à implémenter")}
                        aria-label="Partager"
                    >
                        <SquareArrowOutUpRight size={24} />
                    </button>

                    <button type="button" className="btn btn-base" onClick={() => setModalOpen(true)}>
                        Se proposer
                    </button>
                </div>

                <HelpOfferModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={(message) => console.log("Message envoyé :", message)}
                />

                {showComments && (
                <div id={`comments-section-${helpRequest.id}`} className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="mx-3">
                    <CommentInput
                        onSubmit={(content) => handleAddComment(content, replyingToId ?? undefined)}
                        disabled={isSubmitting}
                    />
                    <CommentThread
                        comments={comments}
                        onAddComment={handleAddComment}
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
