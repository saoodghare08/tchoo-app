import { CreditCardDTOs } from "./CreditCardDTOs";

export interface CustomerInfoDTOs{
  email:string;
  name:string;
  creditCard:CreditCardDTOs;
}
