import { useState } from "react";

interface CancellationPanelProps {
    isRequester     : boolean;
    onConfirm       : (justification: string) => void;
    onCancel        : () => void;
}

export default function CancellationPanel({ isRequester, onConfirm, onCancel }: CancellationPanelProps) {
    const [step, setStep] = useState<"confirm" | "justify">("confirm");
    const [justification, setJustification] = useState("");

    const message = isRequester
        ? "Souhaitez-vous vraiment refuser cette proposition d'aide?"
        : "Souhaitez-vous vraiment retirer votre proposition d'aide?"

    return (
        <div className="w-full">
            {step === "confirm" && (
                <div className="flex flex-col items-center gap-4">
                    <span className="text-secondary-lightgray text-center italic text-sm px-2">
                        {message}
                    </span>
                    <div className="flex gap-4">
                        <button
                            className="btn-secondary"
                            onClick={() => setStep("justify")}
                        >
                            Oui
                        </button>
                        <button
                            className="btn btn-base"
                            onClick={onCancel}
                        >
                            Non, revenir en arrière
                        </button>
                    </div>
                </div>
            )}

            {step === "justify" && (
                <div className="flex flex-col items-center gap-4">
                    <span className="text-secondary-lightgray text-center italic text-sm px-2">
                        Vous pouvez expliquer les raisons de cette annulation.
                    </span>
                    <textarea
                        rows={3}
                        className="w-full  rounded-2xl max-w-md border border-gray-300 p-2 resize-none"
                        placeholder="Écrivez votre justification ici (facultatif)..."
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                    />
                    <div className="flex flex-col items-center">
                        <button
                            className="btn btn-base"
                            onClick={() => onConfirm(justification)}
                        >
                            {justification.trim() ? "Envoyer" : "Envoyer sans justification"}
                        </button>
                        <button
                            className="link text-[14px] underline"
                            onClick={onCancel}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
