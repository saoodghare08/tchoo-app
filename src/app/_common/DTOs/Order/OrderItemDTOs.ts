export interface OrderItemDTOs {
  id: number
  salesListId: string
  salesId: string
  customerId: string
  category: string
  itemId: string
  itemDesc: string
  priceId: string
  measurement: string
  quantityValue: number
  pricePerMeas: number
  totalPrice: number
  discount: number
  weight: number
  deliveryDate: Date
  createdBy: string
  createdOn: Date
  lastUpdatedBy: string
  lastUpdatedOn:  Date
  status: string
  taxableAmount: number
  cgst: number
  sgst: number
  remark: string
}
