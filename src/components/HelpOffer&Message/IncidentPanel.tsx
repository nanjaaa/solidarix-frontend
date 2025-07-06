import React, { useState } from "react";

type IncidentType =
  | "NO_SHOW"
  | "MISCONDUCT"
  | "INCOMPLETE_HELP"
  | "MISUNDERSTANDING"
  | "OTHER";

const INCIDENT_TYPE_OPTIONS: { value: IncidentType; labelRequester: string; descRequester: string; labelHelper: string; descHelper: string; }[] = [
  {
    value: "NO_SHOW",
    labelRequester: "Le bénévole ne s’est pas présentée",
    labelHelper: "Le demandeur d'aide ne s’est pas présenté",
    descRequester: "Le bénévole n'est pas venu au rendez-vous.",
    descHelper: "La personne ayant demandé l'aide n'était pas au lieu convenu.",
  },
  {
    value: "MISCONDUCT",
    labelRequester: "Comportement inapproprié de l’aideur",
    descRequester: "Le bénévole a eu un comportement déplacé.",
    labelHelper: "Comportement inapproprié du demandeur",
    descHelper: "Le demandeur d'aide a eu un comportement déplacé.",
  },
  {
    value: "INCOMPLETE_HELP",
    labelRequester: "Aide incomplète",
    descRequester: "Le bénévole n’a pas terminé la mission promise.",
    labelHelper: "Mission incomplète",
    descHelper: "Les informations ou le contexte fourni n'ont pas permis d'accomplir l'aide.",
  },
  {
    value: "MISUNDERSTANDING",
    labelRequester: "Malentendu",
    descRequester: "Le rendez-vous n'a pas abouti à cause d'un malentendu.",
    labelHelper: "Malentendu",
    descHelper: "L'entraide n'a pas fonctionné à cause d'une mauvaise compréhension.",
  },
  {
    value: "OTHER",
    labelRequester: "Autre problème",
    descRequester: "Toute autre situation non couverte.",
    labelHelper: "Autre problème",
    descHelper: "Toute autre situation non couverte.",
  },
];

interface IncidentPanelProps {
  isHelper: boolean;
  onCancel: () => void;
  onSubmit: (data: { type: IncidentType; description: string }) => void;
}

export const IncidentPanel: React.FC<IncidentPanelProps> = ({ isHelper, onCancel, onSubmit }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState("");

  const handleTypeSelect = (type: IncidentType) => setIncidentType(type);
  const handleContinue = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleSubmit = () => {
    if (incidentType && description.trim()) {
      onSubmit({ type: incidentType, description: description.trim() });
    }
  };

  return (
    <div className="w-full max-w-lg shrink-0 mx-auto rounded-2xl shadow-lg p-6 my-6 bg-white border border-red-500">
      <h2 className="text-xl font-semibold mb-4">Déclarer un incident</h2>

      {step === 1 && (
        <>
          <div className="space-y-3">
            <p className="mb-2">Quel type d’incident souhaitez-vous signaler ?</p>
            {INCIDENT_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`block border p-3 rounded-xl cursor-pointer mb-2 ${incidentType === opt.value ? "border-primary-green bg-primary-green/10" : "border-gray-200"}`}>
                <input
                  type="radio"
                  name="incident-type"
                  checked={incidentType === opt.value}
                  onChange={() => handleTypeSelect(opt.value)}
                  className="mr-2"
                />
                <span className="font-medium">
                  {isHelper ? opt.labelHelper : opt.labelRequester}
                </span>
                <div className="text-sm text-gray-500">
                  {isHelper ? opt.descHelper : opt.descRequester}
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button className="btn-secondary" onClick={onCancel}>Annuler</button>
            <button className="btn btn-base disabled:opacity-50" onClick={handleContinue} disabled={!incidentType}>Continuer</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-4">
            <p className="font-medium mb-1">
              {isHelper
                ? "Expliquez brièvement l'incident et vos difficultés :"
                : "Expliquez brièvement l'incident et l'impact sur vous :"}
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-2"
              placeholder={isHelper
                ? "Ex : J'ai rencontré un manque d'informations…"
                : "Ex : Je n'ai pas pu recevoir l'aide attendue…"}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={handleBack}>Retour</button>
            <button className="btn btn-base disabled:opacity-50" onClick={handleSubmit} disabled={!description.trim()}>Envoyer</button>
          </div>
        </>
      )}
    </div>
  );
};
