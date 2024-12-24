import { CustomerInfoDTOs } from './../DTOs/Payment/CustomerInfoDTOs';
import { PaymentDetailsDTOs } from "../DTOs/Payment/PaymentDetailsDTOs";

export interface PaymentViewModel{
  customerInfo:CustomerInfoDTOs;
  paymentDetails:PaymentDetailsDTOs;
  userId: string;
}
