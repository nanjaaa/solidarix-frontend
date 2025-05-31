// src/constants/helpTypeDescriptions.ts

export type HelpType =
    | "COURSES"
    | "DEMENAGEMENT"
    | "GARDE_ENFANT"
    | "SOUTIEN_SCOLAIRE"
    | "PETITS_TRAVAUX"
    | "INFORMATIQUE"
    | "COMPAGNIE_VISITE"
    | "TRANSPORT"
    | "CUISINE"
    | "ADMINISTRATIF"
    | "AUTRE";

type HelpTypeDescription = {
    label: string;
    icon: string;
    sentence: string;
};


export const helpTypeDescriptions : Record<HelpType, HelpTypeDescription> ={
    COURSES: {
        label: "Courses",
        icon: "🛒",
        sentence: "Besoin d’un coup de main pour faire les courses ? C’est bien noté !",
    },
    DEMENAGEMENT: {
        label: "Déménagement",
        icon: "📦",
        sentence: "Un déménagement en vue ? On t’aide à faire tes cartons et à tout transporter sans stress !",
    },
    GARDE_ENFANT: {
        label: "Garde d’enfant",
        icon: "🧸",
        sentence: "Tu as besoin de quelqu’un de confiance pour garder les enfants ? On est là pour veiller sur les petits !",
    },
    SOUTIEN_SCOLAIRE: {
        label: "Soutien scolaire",
        icon: "📚",
        sentence: "Un petit coup de pouce pour les devoirs ou les révisions ? On trouve quelqu’un pour accompagner l’apprentissage !",
    },
    PETITS_TRAVAUX: {
        label: "Petits travaux",
        icon: "🛠️",
        sentence: "Besoin d’un coup de main pour réparer ou bricoler quelque chose ? On retrousse les manches ensemble !",
    },
    INFORMATIQUE: {
        icon: "💻",
        label: "Informatique",
        sentence: "Un bug, un souci de connexion ou un logiciel capricieux ? On t’aide à apprivoiser la technologie !",
    },
    COMPAGNIE_VISITE: {
        label: "Compagnie & visite",
        icon: "🤝",
        sentence: "Envie d’échanger, de partager un moment, ou simplement de ne pas rester seul(e) ? On vient te rendre visite avec plaisir !",
    },
    TRANSPORT: {
        label: "Transport",
        icon: "🚗",
        sentence: "Besoin d’un trajet pour un rendez-vous, des courses ou autre ? On embarque avec toi !",
    },
    CUISINE: {
        label: "Cuisine",
        icon: "🍲",
        sentence: "Envie d’un coup de main en cuisine ou de partager un bon plat ? On met la main à la pâte !",
    },
    ADMINISTRATIF: {
        label: "Aide administrative",
        icon: "📝",
        sentence: "Des papiers à remplir ou des démarches à faire ? On t’aide à y voir plus clair !",
    },
    AUTRE: {
        label: "Autre",
        icon: "🌟",
        sentence: "Un besoin particulier qui ne rentre pas dans les cases ? Dis-nous tout, et on trouvera une solution ensemble !",
    },
} satisfies Record<HelpType, HelpTypeDescription>;


function isHelpType(value: string): value is HelpType {
    return value in helpTypeDescriptions;
}

export function getHelpTypeInfo(value: string) {
    if (isHelpType(value)) {
        return helpTypeDescriptions[value];
    }
    return { label: value, sentence: "", icon: "🌟" };
}
