import api from "../lib/axios";
import type { HelpRequestDto, UserSimpleDto } from "../types/helpRequest";

export interface HelpOfferMessageDto {
    id?: number;
    sender: UserSimpleDto;
    content: string;
    createdAt: string;
    
    isAboutHelpOffer?: boolean;
    isAboutInvitation?: boolean;
    isFromFriend?: boolean;
    readByReceiver?: boolean;
}

/*
export interface HelpOfferDiscussionDto {
    helpOfferId: number;
    requester: UserSimpleDto;
    offerer: UserSimpleDto;
    messages: HelpOfferMessageDto[];
}
*/

export interface HelpOfferDiscussionDto {
    helpOfferId: number; // ID de la proposition d'aide
    helpRequest: HelpRequestDto;
    offerer: UserSimpleDto;
    createdAt: string;
    expirationReference: string;
    status: string;
    closedAt?: string | null;
    canceledAt?: string | null;
    cancellationJustification?: string | null;
    messages: HelpOfferMessageDto[];
}


const helpOfferStatuses = [
    , "PROPOSED"
    , "VALIDATED_BY_REQUESTER"
    , "CONFIRMED_BY_HELPER"
    , "DONE"
    , "CANCELED_BY_HELPER"
    , "CANCELED_BY_REQUESTER"
    , "FAILED"
    , "EXPIRED",

    , "DEFAULT" // impossible state
    ];

export type HelpOfferStatus = typeof helpOfferStatuses[number];

export function parseHelpOfferStatus(value: string): HelpOfferStatus {
    return helpOfferStatuses.includes(value as HelpOfferStatus)
        ? (value as HelpOfferStatus)
        : "DEFAULT";
}


export const createHelpOffer = async (helpRequestId: number, firstMessage: string) => {
    const response = await api.post("/help-offer/create", {
        helpRequestId,
        firstMessage,
    });
    return response.data;
};

export const sendHelpOfferMessage = async (
    helpOfferId: number,
    message: string
): Promise<void> => {
    await api.post("/help-offer-message/send", {
        helpOfferId,
        message,
    });
};

export async function markAllMessagesAsRead(helpOfferId: number): Promise<void> {
    await api.post(`/help-offer-message/${helpOfferId}/mark-all-as-read`);
}

export const fetchUserDiscussions = async (): Promise<HelpOfferDiscussionDto[]> => {
    const res = await api.get<HelpOfferDiscussionDto[]>("/help-offer/my-discussions");
    return res.data;
};

export async function cancelHelpOffer(
    helpOfferId: number,
    justification: string,
): Promise<void> { 
    await api.post(`/help-offer/${helpOfferId}/cancel`, {justification})
}


export async function validateHelpOffer(helpOfferId: number): Promise<void> {
    await api.post(`/help-offer/${helpOfferId}/validate`);
}

export async function confirmHelpOffer(helpOfferId: number): Promise<void> {
    await api.post(`/help-offer/${helpOfferId}/confirm`);
}

export async function getHelpOfferDiscussionById(helpOfferId: number): Promise<HelpOfferDiscussionDto> {
    const response = await api.get(`/help-offer/${helpOfferId}`);
    return response.data;
}