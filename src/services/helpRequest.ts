import type { Address } from "../hooks/UseAddressAutocomplete";
import api from "../lib/axios";
import type { HelpRequestDto } from "../types/helpRequest";
import { getCoordinatesFromPostalCode } from "../utils/geolocation";
import { getAuthToken } from "./authService";

export type HelpCategory =
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

export const categoryMessages: Record<string, (date: string) => string> = {
  COURSES: (date) => `... demande de l’aide pour faire ses courses pour ce ${date}`,
  DEMENAGEMENT: (date) => `... a besoin d’un coup de main pour un déménagement le ${date}`,
  GARDE_ENFANT: (date) => `... cherche quelqu’un pour garder ses enfants le ${date}`,
  SOUTIEN_SCOLAIRE: (date) => `... recherche du soutien scolaire pour un proche le ${date}`,
  PETITS_TRAVAUX: (date) => `... a besoin d’aide pour des petits travaux à la maison le ${date}`,
  INFORMATIQUE: (date) => `... cherche de l’aide pour un problème informatique le ${date}`,
  COMPAGNIE_VISITE: (date) => `... souhaiterait de la compagnie ou une visite amicale le ${date}`,
  TRANSPORT: (date) => `... demande de l’aide pour un déplacement prévu le ${date}`,
  CUISINE: (date) => `... a besoin d’un coup de main en cuisine le ${date}`,
  ADMINISTRATIF: (date) => `... demande de l’aide pour des démarches administratives le ${date}`,
  AUTRE: (date) => `... a une demande particulière prévue pour le ${date}`,
};


export interface CreateHelpRequestDto {
  category: HelpCategory;
  address: Address;
  helpDate: string; // format ISO string : "2025-05-01T14:00:00"
  description: string;
}

export const createHelpRequest = async (data: CreateHelpRequestDto) => {

  const token = getAuthToken();
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  // Compléter les coordonnées si manquantes
  if (!data.address.latitude || !data.address.longitude) {
    const coords = await getCoordinatesFromPostalCode(data.address.postalCode);
    if (coords) {
      data.address.latitude = "" + coords.lat;
      data.address.longitude = "" + coords.lon;
    } else {
      console.warn("Impossible de récupérer les coordonnées pour le code postal :", data.address.postalCode);
    }
  }

  const response = await api.post("/help-request/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
  
};


export const fetchHelpRequestsFeed = async (): Promise<HelpRequestDto[]> => {
  const response = await api.get("/help-request/feed");
  return response.data;
};


export interface HelpRequestCommentCreationDto {
  helpRequestId: number;
  parentCommentId?: number;
  content: string;
}

export const postComment = async (dto: HelpRequestCommentCreationDto) => {
  const response = await api.post("help-request/comments/add", dto); // ou "/help-requests/comments"
  return response.data;
};


export function getHelpRequestPresentationTitle(
  category            : HelpCategory,
  otherUserFirstName  : string,
  isHelper             : boolean
): string {
  const titles: Record<HelpCategory, [string, string]> = {
    COURSES: [
      `Un coup de main à ${otherUserFirstName} pour remplir son frigo`,
      `${otherUserFirstName} vous aide à faire vos courses tranquillement`,
    ],
    DEMENAGEMENT: [
      `Vous aidez ${otherUserFirstName} à changer de nid`,
      `${otherUserFirstName} vous donne un coup de main pour déménager`,
    ],
    GARDE_ENFANT: [
      `Un moment avec les enfants de ${otherUserFirstName}`,
      `${otherUserFirstName} garde vos petits pendant votre absence`,
    ],
    SOUTIEN_SCOLAIRE: [
      `Vous aidez ${otherUserFirstName} à progresser dans ses études`,
      `${otherUserFirstName} vous donne un coup de pouce pour vos devoirs`,
    ],
    PETITS_TRAVAUX: [
      `Un peu de bricolage chez ${otherUserFirstName}`,
      `${otherUserFirstName} vous aide à réparer ou installer quelque chose`,
    ],
    INFORMATIQUE: [
      `Vous dépannez ${otherUserFirstName} avec son ordinateur`,
      `${otherUserFirstName} vous aide à dompter l’informatique`,
    ],
    COMPAGNIE_VISITE: [
      `Vous passez un moment convivial avec ${otherUserFirstName}`,
      `${otherUserFirstName} vient partager un moment avec vous`,
    ],
    TRANSPORT: [
      `Vous accompagnez ${otherUserFirstName} pour un déplacement`,
      `${otherUserFirstName} vous conduit là où vous devez aller`,
    ],
    CUISINE: [
      `Vous cuisinez avec ou pour ${otherUserFirstName}`,
      `${otherUserFirstName} vous donne un coup de main en cuisine`,
    ],
    ADMINISTRATIF: [
      `Vous aidez ${otherUserFirstName} à démêler ses papiers`,
      `${otherUserFirstName} vous aide avec vos démarches administratives`,
    ],
    AUTRE: [
      `Un coup de main à ${otherUserFirstName}, tout simplement`,
      `${otherUserFirstName} vous apporte un peu d’aide selon vos besoins`,
    ],
  };

  const [helperTitle, requesterTitle] = titles[category];
  return isHelper ? helperTitle : requesterTitle;
}


