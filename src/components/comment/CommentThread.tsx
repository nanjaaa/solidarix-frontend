import { useState } from "react";
import CommentInput from "./CommentInput"; // ton composant CommentInput avec textarea et bouton envoyer
import usersMock from "../../data/usersMock";
import { timeAgo } from "../../utils/timeAgo";

export interface Comment {
    id: number;
    author: {
        id: number;
        firstName: string;
        lastName: string;
    };
    content: string;
    createdAt: string;
    replies?: Comment[];
}

interface CommentThreadProps {
    comments: Comment[];
    onAddComment: (content: string, parentCommentId?: number) => void;
    parentId?: number; // undefined pour top-level
    replyingToId: number | null;
    setReplyingToId: (id: number | null) => void;
}

export default function CommentThread({ comments, onAddComment, parentId, replyingToId, setReplyingToId }: CommentThreadProps) {

    const handleReplySubmit = (content: string, parentId: number) => {
        onAddComment(content, parentId);
        setReplyingToId(null);
    };

    return (
        <div className={parentId ? "ml-10 mt-2 space-y-3" : "space-y-0"}>
            {comments.length === 0 && !parentId && (
                <div className="text-gray-500 text-sm italic">Aucun commentaire pour le moment.</div>
            )}

            {comments.map((comment) => {
                const avatarUrl = `https://api.dicebear.com/6.x/lorelei/svg?seed=${comment.author.id}`;

                return (
                    <div key={comment.id} className="mt-3">
                        <div className="flex flex-col mb-0">

                            <div className="flex items-start mt-3">   
                                <img
                                    src={avatarUrl}
                                    alt={`Avatar de ${comment.author.firstName} ?? "utilisateur inconnu"}`}
                                    className={parentId ? "w-6 h-6 rounded-full object-cover mt-1" : "w-8 h-8 rounded-full object-cover mt-1"}
                                />
                                <div className={parentId ? "commentThread rounded-xl p-2 flex-1 text-sm" : "commentThread rounded-xl p-2 flex-1"}>

                                    <div className="flex justify-between items-start w-full">

                                        <div className="font-semibold">
                                            {comment.author.firstName ?? "Utilisateur inconnu"} {comment.author.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1 italic">{timeAgo(comment.createdAt)}</div>

                                    </div>

                                    <div>{comment.content}</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end w-full">
                                {replyingToId === comment.id && (
                                <div className="mt-2">
                                    <CommentInput
                                        onSubmit={(content) => handleReplySubmit(content, comment.id)}
                                        disabled={false}
                                    />
                                </div>
                                )}
                                <button
                                    className="mt-1 text-primary-green hover:text-hover-green text-xs font-semibold"
                                    onClick={() => {
                                        setReplyingToId(replyingToId === comment.id ? null : comment.id);
                                    }}
                                >
                                    {replyingToId === comment.id ? "Annuler" : "Répondre"}
                                </button>
                            </div>

                        </div>

                        {/* Replies récursives */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="w-full">
                            <CommentThread 
                                comments={comment.replies} 
                                onAddComment={onAddComment} 
                                parentId={comment.id} 
                                replyingToId={replyingToId}
                                setReplyingToId={setReplyingToId}
                            />
                            </div>
                        )}
                    </div>
                );
            })}

        </div>
    );
}
