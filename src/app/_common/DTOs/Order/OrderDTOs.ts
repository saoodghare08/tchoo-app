export interface OrderDTOs {
  id: number
  salesOrderId: string
  customerId: string
  bookingId: string
  salesPerson: string
  pluCount: number
  totalQuantity: number
  totalWeight: number
  totalPrice: number
  discount: number
  orderdStatus: string
  paymentStatus: string
  deliveryDate: Date
  comment: string
  createdBy: string
  createdOn: Date
  lastUpdatedBy: string
  lastUpdatedOn: Date
  bags: string
  paymentMode: string
  addressId: string
  slotId: string
  deliveryType: string
  deliveryCharges: string
  hubId: string
  branch: string
  purchaseId: string
  transactionId: string
  deliveryNotes: string
  savings: string
  source: string
  otp: string
  remainingAmount: number
  tableId: string
  kotPrint: number
  tokenNumber: number
  orderType: string
  taxType: number
  taxBillType: number
  vatTax: number
  gstTax: number
  kotLogPrint: number
  cancellationReason: string
  coupenCode: string
  customerName:string
  createdByName:string
  buildingName:string
  roomNo:string
  sector:string
  locality:string
  city:string
  zipCode:string
  wallet:number
}
