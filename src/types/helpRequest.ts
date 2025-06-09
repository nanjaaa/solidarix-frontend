import type { Address } from "../hooks/UseAddressAutocomplete";

export type User = {
    id: number;
    name: string;
    avatarUrl: string;
};

export type UserSimpleDto = {
    id: number;
    firstName: string;
    lastName: string;
};


export type Comment = {
    id: number;
    author: {
        id: number;
        firstName: string;
        lastName: string;
    };
    content: string;
    createdAt: string;
    replies?: Comment[];
};

export type PrivateHelpRequestDto = {
    id: number;
    requester: UserSimpleDto; // ⚠️ remplacer authorId
    category: string;
    description: string;
    helpDate: string;
    createdAt: string;
    status: string;
    postalSummary: string;
    comments: Comment[];
    address: Address
};

export type PublicHelpRequestDto = {
    id: number;
    requester: UserSimpleDto; // ⚠️ remplacer authorId
    category: string;
    description: string;
    helpDate: string;
    createdAt: string;
    status: string;
    postalSummary: string;
    comments: Comment[];
};
