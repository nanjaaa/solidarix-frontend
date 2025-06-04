import { useState, useEffect, useRef } from "react";

interface HelpOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (message: string) => void;
}

export default function HelpOfferModal({ isOpen, onClose, onSubmit }: HelpOfferModalProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-sm pt-20 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold mb-2">Proposer votre aide</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Laissez un message pour faire savoir au demandeur d'aide que vous souhaitez lui proposer votre service.
                </p>

                <textarea
                    ref={textareaRef}
                    rows={4}
                    maxLength={500}
                    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-green"
                    placeholder="Votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => {
                        onSubmit(message);
                        setMessage("");
                        onClose();
                        }}
                        disabled={message.trim() === ""}
                        className="btn btn-base disabled:opacity-50"
                    >
                        Envoyer la proposition
                    </button>
                </div>
            </div>
        </div>
    );
}
