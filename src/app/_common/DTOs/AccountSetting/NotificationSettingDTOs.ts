export interface NotificationSettingDTOs{
  id: number
  userId: string
  orders_ItemInCart: boolean
  orders_PaymentCreditInsurance: boolean
  orders_SubscriptionQuestionAns: boolean
  recommendations_YourInterests: boolean
  recommendations_YourPurchase: boolean
  offers_Welcome: boolean
  offers_DealsDiscount: boolean
  offers_Occasional: boolean
  support_QueryReply: boolean
  support_QueryStatus: boolean
  myOrder: any
  recommendation: any
  offers: any
  support: any
  createdDate: string
  updatedDated: string
}
