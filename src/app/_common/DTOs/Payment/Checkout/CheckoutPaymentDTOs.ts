import { CustomerDTOs } from "./CustomerDTOs"
import { SourceDTOs } from "./SourceDTOs"

export interface CheckoutPaymentDTOs {
  source: SourceDTOs
  amount: number
  currency: string
  processing_channel_id: string
  customer: CustomerDTOs
  success_url: string
  failure_url: string
  userId: string
}


