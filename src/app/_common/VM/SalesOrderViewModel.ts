import { OrderDTOs } from "../DTOs/Order/OrderDTOs"
import { OrderItemDTOs } from "../DTOs/Order/OrderItemDTOs"
import { OrderTrackingDTOs } from "../DTOs/Order/OrderTrackingDTOs"

export interface SalesOrderViewModel{
  salesOrder: OrderDTOs
  orderItems: OrderItemDTOs[]
  orderTracking: OrderTrackingDTOs[]
}
