import React, { useState } from "react";
import { addHelpOfferFeedback, markHelpOfferAsDone } from "../../services/helpOffer";

interface FeedbackPanelProps {
  isHelper: boolean;
  onCancel: () => void;
  onSubmit: (feedback: string) => void;
}

/**
 * Composant pour recueillir un retour authentique sur l'entraide,
 * adapté selon le rôle (aideur ou demandeur).
 */
export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ isHelper, onCancel, onSubmit }) => {
  const [feedback, setFeedback] = useState("");


  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback.trim());
    }
  };

  // Textes selon le rôle
    const title = isHelper
    ? "Comment évaluez-vous votre expérience en tant qu'aideur ?"
    : "Comment évalueriez-vous votre expérience sur l'entraide ?";
    const prompt = isHelper
    ? "Merci de partager ce qui vous a permis d'aider efficacement, vos points forts ou difficultés."
    : "Pour clôturer l'entraide, merci de remercier la personne qui vous a aidé et de partager votre expérience. Vous pouvez également faire des suggestions pour améliorer la plateforme.";
    const placeholder = isHelper
    ? "Ex : L'organisation était claire et j'ai pu apporter mon aide rapidement…"
    : "Ex : Merci à Marie pour sa disponibilité et sa patience…";
    const buttonLabel = isHelper ? "Envoyer mon retour" : "Clôturer l'entraide et envoyer";

  return (
    <div className="w-full max-w-lg shrink-0 mx-auto rounded-2xl shadow-lg p-6 my-6 bg-white border border-blue-500">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{prompt}</p>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={5}
        className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-green"
        placeholder={placeholder}
      />
      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button
          className="btn btn-base disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!feedback.trim()}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};
