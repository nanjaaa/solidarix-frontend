export type User = {
    id: number;
    name: string;
    avatarUrl: string;
};

export type Comment = {
    id: number;
    authorId: number;
    content: string;
    createdAt: string; // ISO
    replies?: Comment[]; // réponses niveau 2, pas plus
};

export type HelpRequest = {
    id: number;
    authorId: number;
    category: string;
    description: string;
    helpDate: string; // ISO
    createdAt: string; //ISO
    city: string;
    comments: Comment[];
};

    