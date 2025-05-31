import type { Address } from "../hooks/UseAddressAutocomplete";

export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface RegistrationDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: string; // format yyyy-MM-dd
  address: Address;
}