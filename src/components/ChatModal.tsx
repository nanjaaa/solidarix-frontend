import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAutoResizeTextarea } from "../hooks/UseZutoResizeTextarea";

interface Message {
    id: number;
    senderId: number;
    content: string;
    timestamp: string;
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserId: number;
    messages: Message[];
    onSendMessage: (message: string) => void;
}

export default function ChatModal({
    isOpen,
    onClose,
    currentUserId,
    messages,
    onSendMessage,
}: ChatModalProps) {
    const [newMessage, setNewMessage] = useState("");
    const textareaRef = useAutoResizeTextarea(newMessage, 4);
    const scrollRef = useRef<HTMLDivElement>(null);

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
                        const isOwn = msg.senderId === currentUserId;
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

                {/*Zone de validation/annulation*/}
                <div className="flex flex-col mt-5 pt-3 items-center border-t-2 gap-2">
                    {/*Mettre ici les phrases  décrivant l'opération qui doit se faire pour la confirmatoin del'entraide
                        Exemple : 
                            - étape 0 : pour l'aideur, il attend que le demandeur valide sa proposition pour pouvoir confirmer
                            - étape 0 : pour le demandeur, on lui dit de donner le max d'info pour l'aideur et demander le max d'info sur l'aideur et le valider ensuite
                            - etcc...
                            - étape 999 : texte qui informe que la proposition a été périmée
                    */}
                    <span className="justify-center text-secondary-lightgray text-center italic text-sm">
                        Discute avec le demandeur pour avoir le max d'infos sur son besoin, informe-lui de ta disposition et attend qu'il valide ta proposition...
                    </span>
                    <div className="flex mt-1 justify-center gap-3">

                        {/* Bouton annuler, visible à tout moment */}
                        <button
                            className="btn-secondary"
                            onClick={() => {}}
                            aria-label="Annuler"
                        >
                            Annuler    
                        </button>  

                        {/** Bouton valider ou confirmer selon le cas*/}
                        <button
                            className="btn btn-base"
                            onClick={() => {}}
                            aria-label="Valider"
                        >
                            Confirmer    
                        </button> 

                    </div>
                </div>
            </div>
        </div>
    );
}
