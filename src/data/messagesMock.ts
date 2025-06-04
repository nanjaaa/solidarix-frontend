import usersMock from "./usersMock";

export type Message = {
    id: number;
    senderId: number;
    content: string;
    timestamp: string;
};

export type Discussion = {
    id: number;
    participants: [number, number]; // 2 userIds
    messages: Message[];
};

const messagesMock: Discussion[] = [
    {
        id: 1,
        participants: [1, 2], // Karim et Sophie
        messages: [
            {
                id: 101,
                senderId: 1,
                content: "Salut Sophie, tu pourrais toujours m’aider pour les courses ?",
                timestamp: "2025-06-03T09:00:00Z",
            },
            {
                id: 102,
                senderId: 2,
                content: "Bonjour Karim ! Oui bien sûr, dis-moi quand ça t’arrange 😊",
                timestamp: "2025-06-03T09:05:00Z",
            },
            {
                id: 103,
                senderId: 1,
                content: "Ce soir vers 18h si c’est bon pour toi.",
                timestamp: "2025-06-03T09:07:00Z",
            },
            {
                id: 104,
                senderId: 2,
                content: "Parfait, à ce soir !",
                timestamp: "2025-06-03T09:10:00Z",
            },
        ],
    },
    {
        id: 2,
        participants: [3, 4], // Marc et Claire
        messages: [
            {
                id: 201,
                senderId: 3,
                content: "Salut Claire, merci encore pour ton aide la semaine dernière 🙏",
                timestamp: "2025-06-02T14:20:00Z",
            },
            {
                id: 202,
                senderId: 4,
                content: "Avec plaisir Marc ! Si t’as encore besoin, n’hésite pas 😊",
                timestamp: "2025-06-02T14:25:00Z",
            },
        ],
    },
    {
        id: 3,
        participants: [5, 7], // Lucas et Émilie
        messages: [
            {
                id: 301,
                senderId: 5,
                content: "Bonjour Émilie, j’ai vu ton annonce pour l’aide au déménagement.",
                timestamp: "2025-06-01T10:30:00Z",
            },
            {
                id: 302,
                senderId: 7,
                content: "Oui, tu serais dispo samedi ?",
                timestamp: "2025-06-01T10:34:00Z",
            },
            {
                id: 303,
                senderId: 5,
                content: "Carrément, je peux venir vers 10h.",
                timestamp: "2025-06-01T10:36:00Z",
            },
        ],
    },
];

export default messagesMock;
