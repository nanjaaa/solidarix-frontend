import { useState } from "react";
import { ChatBubbleForm } from "./ChatFormBubble";
import type { Address } from "../../hooks/UseAddressAutocomplete";
import HelpTypeSummary from "../HelpRequestSummary/HelpTypeSummary";
import HelpDescriptionSummary from "../HelpRequestSummary/HelpDescriptionSummary";
import HelpDateTimeSummary from "../HelpRequestSummary/HelpDateTimeSummary";
import HelpAddressSummary from "../HelpRequestSummary/HelpAddressSummary";
import { helpTypeDescriptions } from "../../constants/helpDescription";

type HelpRequestData = {
    helpType?: string;
    description?: string;
    helpTime?: string;
    location?: Address;
};

type StepKey = "helpType" | "description" | "helpTime" | "location";

const questions: { key: StepKey; label: string; placeholder?: string }[] = [
    {
        key: "helpType",
        label: "Quel type d’aide recherchez-vous ?",
        placeholder: "Choisissez parmi les options ci-dessous...",
    },
    {
        key: "description",
        label: "Pourriez-vous dire un peu plus sur votre besoin :) ?",
        placeholder: "Présentez-vous et décrivez en détail votre besoin....",
    },
    {
        key: "helpTime",
        label: "Indiquez-nous le moment qui vous conviendrait le mieux pour recevoir de l’aide",
        placeholder: "Sélectionnez un créneau...",
    },
    {
        key: "location",
        label: "Pouvez-vous indiquer l'adresse complète où aura lieu l'entraide ?",
        placeholder: "Ex : 12 rue des Fleurs, 75000 Paris",
    },
];

const helpTypeOptions = Object.entries(helpTypeDescriptions).map(
    ([key, { label, icon }]) => ({
        value: key, 
        inputLabel: label,
        label: `${icon} ${label}`, 
    })
);

export default function HelpRequestForm() {
    const [step, setStep] = useState<number>(0);
    const currentQuestion = questions[step - 1];
    const [maxStepReached, setMaxStepReached] = useState<number>(0);
    const [editingStep, setEditingStep] = useState<number | null>(null);
    const [isStepFinal, setIsStepFinal] = useState(false);
    const [formData, setFormData] = useState<HelpRequestData>({
        helpType    : "",
        description : "",
        helpTime    : "",
        location    : {
            number      : "",
            streetName  : "",
            street      : "",
            postalCode  : "",
            city        : "",
            latitude    : "",
            longitude   : "",
            fullAddress : "",
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleLocationChange = (location: Address) => {
        setFormData((prev) => ({
        ...prev,
        location,
        }));
    };

    const isStepValid = (currentStep: number): boolean => {
        switch (currentStep) {
        case 1:
            return !!formData.helpType?.trim();
        case 2:
            return !!formData.description?.trim();
        case 3:
            return !!formData.helpTime?.trim();
        case 4:
            return !!formData.location?.fullAddress?.trim();
        default:
            return true;
        }
    };

    const handleNext = () => {
        if (!isStepValid(step)) return;
        const nextStep = step + 1;

        if (step === 4) {
            setIsStepFinal(true);
        }

        setMaxStepReached((prev) => Math.max(prev, nextStep));
        setStep(maxStepReached);
        setEditingStep(null);
    };

    const handleEdit = (stepNumber: number) => {
        setEditingStep(stepNumber);
        setIsStepFinal(false);
        setStep(stepNumber);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid(maxStepReached)) {
            alert("Veuillez compléter toutes les étapes avant de soumettre.");
            return;
        }
        console.log("Formulaire soumis :", formData);
        // ici tu peux appeler une API ou autre logique d'envoi
    };

    const isFormComplete = (): boolean => {
        return (
            !!formData.helpType?.trim() &&
            !!formData.description?.trim() &&
            !!formData.helpTime?.trim() &&
            !!formData.location?.fullAddress?.trim() &&
            !!formData.location?.city?.trim() &&
            !!formData.location?.postalCode?.trim()
        );
    };

    return (
        <div className="card w-[800px]">
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-primary-darkblue">
            Demande d’aide
            </h2>

            {step === 0 && (
            <button
                type="button"
                onClick={() => {
                setStep(1);
                setMaxStepReached(1);
                }}
                className="bg-primary-green text-white py-2 px-4 rounded hover:bg-green-700"
            >
                Commencer
            </button>
            )}

            {/* Étape 1 - Type d’aide */}
            {maxStepReached >= 1 && (
            <div className="my-4">
                {step === 1 || editingStep === 1 ? (
                <ChatBubbleForm
                    question={currentQuestion?.label ?? ""}
                    type="select"
                    value={formData.helpType ?? ""}
                    onChange={(val) => setFormData({ ...formData, helpType: val })}
                    onSend={handleNext}
                    placeholder={currentQuestion?.placeholder || ""}
                    options={helpTypeOptions}
                />
                ) : (
                    <HelpTypeSummary
                        value={formData.helpType ?? "—"}
                        onEdit={() => handleEdit(1)}
                    />
                )}
            </div>
            )}

            {/* Étape 2 - Description */}
            {maxStepReached >= 2 && (
            <div className="my-4">
                {step === 2 || editingStep === 2 ? (
                <ChatBubbleForm
                    question={currentQuestion?.label ?? ""}
                    type="text"
                    value={formData.description ?? ""}
                    onChange={(val) =>
                        setFormData({ ...formData, description: val })
                    }
                    onSend={handleNext}
                    placeholder={currentQuestion?.placeholder || ""}
                />
                ) : (
                    <HelpDescriptionSummary
                        value={formData.description ?? "—"}
                        onEdit={() => handleEdit(2)}
                    />
                )}
            </div>
            )}

            {/* Étape 3 - Moment de l’aide */}
            {maxStepReached >= 3 && (
            <div className="my-4">
                {step === 3 || editingStep === 3 ? (
                <ChatBubbleForm
                    question={currentQuestion?.label ?? ""}
                    type="datetime"
                    value={formData.helpTime ?? ""}
                    onChange={(val) => setFormData({ ...formData, helpTime: val })}
                    onSend={handleNext}
                    placeholder={currentQuestion?.placeholder || ""}
                />
                ) : (
                <HelpDateTimeSummary
                    dateTime={formData.helpTime ?? "—"}
                    onEdit={() => handleEdit(3)}
                />
                )}
            </div>
            )}

            {/* Étape 4 - Adresse */}
            {maxStepReached >= 4 && (
            <div className="my-4">
                {step === 4 || editingStep === 4 ? (
                <ChatBubbleForm
                    question={currentQuestion?.label ?? ""}
                    type="address"
                    value={formData.location?.fullAddress ?? ""}
                    onChange={(val) => {
                    try {
                        const parsed = JSON.parse(val);
                        handleLocationChange(parsed);
                    } catch {
                        // En cas d'erreur, on stocke une adresse avec uniquement fullAddress
                        handleLocationChange({
                        number: "",
                        streetName: "",
                        street: "",
                        postalCode: "",
                        city: "",
                        latitude: "",
                        longitude: "",
                        fullAddress: val,
                        });
                    }
                    }}
                    onSend={handleNext}
                    placeholder={currentQuestion?.placeholder || ""}
                />
                ) : (
                    <HelpAddressSummary
                        street={formData.location?.street ?? "—"}
                        postalCode={formData.location?.postalCode ?? "—"}
                        city={formData.location?.city ?? "—"}
                        onEdit={() => handleEdit(3)}
                    />
                )}
            </div>
            )}

            {/* Bouton Envoyer visible seulement après la dernière étape validée */}
            {maxStepReached >= 4 && editingStep === null && isFormComplete() &&  (
            <button
                type="submit"
                className="btn btn-base"
            >
                Envoyer ma demande
            </button>
            )}

            {/* Debug */}
            <pre className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-4">
                Debug: {JSON.stringify(formData, null, 2)}
            </pre>
        </form>
        </div>
    );
}
