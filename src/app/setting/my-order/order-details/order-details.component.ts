import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemDTOs } from './../../../_common/DTOs/Order/OrderItemDTOs';
import { OrderDTOs } from './../../../_common/DTOs/Order/OrderDTOs';
import { SalesOrderViewModel } from 'src/app/_common/VM/SalesOrderViewModel';
import { OrderService } from './../../../_services/orders/order.service';
import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { OrderTrackingDTOs } from 'src/app/_common/DTOs/Order/OrderTrackingDTOs';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  createdby: any = this.activatedRout.snapshot.params['userId'];
  SOId = this.activatedRout.snapshot.params['orderId'];

  itemList: OrderItemDTOs[] = [];
  orderTracking: OrderTrackingDTOs[] = [];
  userdetails: any = [];

  selectedlanguage: any = 'English';
  GrandTotal: number = 0.00;
  subtotal: any = 0;

  DeliveryAmt: any;
  TotalTaxableAmt: any;
  changePasswordMD: any;

  salesOrder: OrderDTOs = {
    id: 0,
    salesOrderId: '',
    customerId: '',
    bookingId: '',
    salesPerson: '',
    pluCount: 0,
    totalQuantity: 0,
    totalWeight: 0,
    totalPrice: 0,
    discount: 0.0,
    orderdStatus: '',
    paymentStatus: '',
    deliveryDate: new Date(),
    comment: '',
    createdBy: '',
    createdOn: new Date(),
    lastUpdatedBy: '',
    lastUpdatedOn: new Date(),
    bags: '',
    paymentMode: '',
    addressId: '',
    slotId: '',
    deliveryType: '',
    deliveryCharges: '',
    hubId: '',
    branch: '',
    purchaseId: '',
    transactionId: '',
    deliveryNotes: '',
    savings: '',
    source: '',
    otp: '',
    remainingAmount: 0,
    tableId: '',
    kotPrint: 0,
    tokenNumber: 0,
    orderType: '',
    taxType: 0,
    taxBillType: 0,
    vatTax: 0,
    gstTax: 0,
    kotLogPrint: 0,
    cancellationReason: '',
    coupenCode: '',
    customerName: '',
    createdByName: '',
    buildingName: '',
    roomNo: '',
    sector: '',
    locality: '',
    city: '',
    zipCode: '',
    wallet: 0,
  };
  salesData: SalesOrderViewModel = {
    salesOrder: this.salesOrder,
    orderItems: this.itemList,
    orderTracking: this.orderTracking,
  };
  constructor(
    private orderService: OrderService,
    private activatedRout: ActivatedRoute,
    private app: AppComponent,
    private product_service: ProductService
  ) {
    if (this.createdby == '0') {
      window.location.href = '/SignIn/Goback'
    }
    else {
      this.orderService.orderDetails(this.SOId).subscribe({
        next: (data: any) => {
          this.salesData = data;
          this.DeliveryAmt = this.salesData.salesOrder.deliveryCharges;
          this.TotalTaxableAmt =
            (this.salesData.salesOrder.totalPrice * this.salesData.salesOrder.vatTax) / 100;
          this.GrandTotal = (Number(this.salesData.salesOrder.totalPrice) + Number(this.DeliveryAmt)) - Number(this.salesData.salesOrder.discount);
        }, error: (err) => {
          // console.log(err);
        },
      });
      this.product_service.getuserdetails(this.createdby).subscribe({
        next: (data) => {
          this.userdetails = data;
          this.selectedlanguage = this.userdetails.language;
        }, error: (err) => {
          // console.log(err);
        }
      });
    }
  }
  orderDetails() {
    this.orderService.orderDetails(this.SOId).subscribe({
      next: (data: any) => {
        this.salesData = data;
        this.DeliveryAmt = this.salesData.salesOrder.deliveryCharges;
        this.TotalTaxableAmt =
          (this.salesData.salesOrder.totalPrice * this.salesData.salesOrder.vatTax) / 100;
        this.GrandTotal =
          Number(this.salesData.salesOrder.totalPrice) +
          Number(this.DeliveryAmt) +
          Number(this.TotalTaxableAmt) - -Number(this.salesData.salesOrder.discount);
      }, error: (err) => {
        // console.log(err);
      }
    });
  }
  // open cancel modal
  cancelOrderMd() {
    this.changePasswordMD = { display: 'block' };
  }
  // cancel order
  CancelOrder() {
    this.orderService.cancelOrder(this.SOId, this.createdby).subscribe({
      next: () => {
        this.orderDetails();
        this.changePasswordMD = { display: 'none' };
      },
      error: (err) => {
        // console.log(err)
      },
      complete: () => {
        this.app.notifyService.showSuccess(
          'Order status updated successfully!'
        ),
          (this.changePasswordMD = { display: 'none' });
      },
    });
  }
  // close cancel modal
  closemd() {
    this.changePasswordMD = { display: 'none' };
  }
}
