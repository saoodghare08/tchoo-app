export interface MyordersDTOs {
  quantityValue: string
  pricePerMeas: string
  totalPrice: string
  itemId: string
  productName: string
  categoryDesc: string
  category: string
  orderWeight: string
  measurement: string
  marketPrice: string
  quantityMarketPrice: string
  itemSellingType: string
  stock: any
  salesId: string
  createdBy: string
  createdByName: any
  itemType: string
  itemWeight: string
  discount: string
  orderdStatus:string
  createdOn?:Date
  deliveryDate?:Date
}
