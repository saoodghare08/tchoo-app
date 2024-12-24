import { BillingDTOs } from "./BillingDTOs"
import { CheckOutProductsDTOs } from "./CheckOutProductsDTOs"

export interface PaymentLinkDTOs {
  amount: number
  processing_channel_id: string
  currency: string
  billing: BillingDTOs
  products: CheckOutProductsDTOs[]
  reference: string
  return_url: string
  callback_url: string
  userId: string
  email: string
  username:string
}
