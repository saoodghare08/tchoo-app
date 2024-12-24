
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyCartDTOs } from 'src/app/_common/DTOs/Order/MyCartDTOs';
import { OrderDTOs } from 'src/app/_common/DTOs/Order/OrderDTOs';
import { OrderItemDTOs } from 'src/app/_common/DTOs/Order/OrderItemDTOs';
import { OrderTrackingDTOs } from 'src/app/_common/DTOs/Order/OrderTrackingDTOs';
import { SalesOrderViewModel } from 'src/app/_common/VM/SalesOrderViewModel';
import { LocalService } from 'src/app/_services/local.service';
import { OrderService } from 'src/app/_services/orders/order.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent {
  created = this.activatedRoute.snapshot.params['userId'];
  addressId: any = this.activatedRoute.snapshot.params['addId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  cartId: any = this.activatedRoute.snapshot.params['cartId'];
  transactionId: any = this.activatedRoute.snapshot.params['transactionId'];

  Totalamount: number = 0;
  Totalqty: number = 0;
  selectedlanguage: any = 'English';

  transacId: any;
  TaxPercent: any;
  DiscountPercent: any;
  fullName: any;
  confirmOrderMD: any;
  deliveryCharges: any;
  finadisc: any;

  cartitem: MyCartDTOs[] = [];
  orderItemsList: OrderItemDTOs[] = [];
  orderTracking: OrderTrackingDTOs[] = [];

  localadd: any = [];
  mycart: any = [];
  userdetails: any = [];
  Tax: any = [];
  orders: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private product_service: ProductService,
    private orderService: OrderService,
    public app: AppComponent,
    private local: LocalService,
  ) {
    this.getuserdetails();
  }
  order: OrderDTOs = {
    id: 0,
    salesOrderId: '',
    customerId: 'CI01',
    bookingId: '',
    salesPerson: 'NA',
    pluCount: Number(this.Totalqty),
    totalQuantity: Number(this.Totalqty),
    totalWeight: 0,
    totalPrice: Number(this.Totalamount),
    discount: 0,
    orderdStatus: 'Ordered',
    paymentStatus: 'Paid',
    comment: 'Test Entry for test only',
    createdBy: '' + this.created,
    lastUpdatedBy: '',
    bags: '0',
    paymentMode: 'Online',
    addressId: this.addressId,
    slotId: 'SLTID01',
    deliveryType: 'standard',
    deliveryCharges: '0',
    hubId: this.HubId,
    branch: this.HubId,
    purchaseId: '',
    transactionId: '',
    deliveryNotes: '',
    savings: '',
    source: 'Client Portal',
    otp: '',
    remainingAmount: 0,
    tableId: '',
    kotPrint: 0,
    tokenNumber: 0,
    orderType: 'HOD',
    taxType: Number(this.Tax?.taxType),
    taxBillType: Number(this.Tax?.taxbillType),
    vatTax: Number(this.Tax?.vatTaxpercent),
    gstTax: 0,
    kotLogPrint: 0,
    cancellationReason: '',
    coupenCode: '0',
    deliveryDate: new Date(),
    createdOn: new Date(),
    lastUpdatedOn: new Date(),
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
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.created).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.fullName = this.userdetails.fullName;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getitemdetails();
      },
    });
  }
  getitemdetails() {
    if (this.cartId == 0 || null) {
      this.local.getCartItems(this.created).subscribe({
        next: (data: any) => {
          this.cartitem = data;
          var itemarr = this.cartitem;
          for (let index = 0; index < itemarr?.length; index++) {
            this.Totalamount +=
              Number(itemarr[index].quantity) * Number(itemarr[index].sellingPrice);
          }
          for (let index = 0; index < itemarr?.length; index++) {
            this.Totalqty += itemarr[index].quantity;
          }
        }, error: (err) => {
          this.app.commonLoader = false;
          // console.log(err);
        }, complete: () => {
          this.getAddressById();
        },
      });
    }
    else {
      this.product_service.getitemdetails(this.cartId, this.created).subscribe({
        next: (data: any) => {
          this.cartitem = data;
          for (let index = 0; index < this.cartitem?.length; index++) {
            this.Totalamount +=
              Number(this.cartitem[index].quantity) *
              Number(this.cartitem[index].sellingPrice);
          }
          for (let index = 0; index < this.cartitem?.length; index++) {
            this.Totalqty += this.cartitem[index].quantity;
          }
        }, error: (err) => {
          this.app.commonLoader = false;
          // console.log(err);
        }, complete: () => {
          this.getAddressById();
        }
      });
    }
  }
  getAddressById() {
    this.local.getAddressById(this.addressId).subscribe({
      next: (data: any) => {
        this.localadd = data;
      },
      error: (err) => {
        this.app.commonLoader = false;
        //console.log(err);
      }, complete: () => {
        this.getVatTaxValue();
      }
    });
  }
  getVatTaxValue() {
    this.local.getTaxValue(this.HubId, 'Tax', 'REB02', this.localadd.zipCode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe({
      next: (tax) => {
        this.Tax = tax;
        this.TaxPercent = (this.Totalamount * this.Tax?.vatTaxpercent) / 100;
        this.deliveryCharges = this.Totalamount > 150 ? 0 : 32;
      },
      error: (err) => {
        this.app.commonLoader = false;
        //console.log(err);
      },
      complete: () => {
        this.BuynowFinal();
      },
    });
  }
  BuynowFinal() {
    this.transactionId = this.transacId;
    this.finadisc = this.DiscountPercent ? this.DiscountPercent : 0;
    const created = this.activatedRoute.snapshot.params['userId'];
    var itemarr = this.cartitem;
    for (let index = 0; index < itemarr?.length; index++) {
      var item: OrderItemDTOs = {
        itemId: '' + itemarr[index].itemId,
        id: 0,
        salesListId: '',
        salesId: '',
        customerId: '' + created,
        category: '',
        priceId: '' + itemarr[index].pattern,
        measurement: 'gm',
        quantityValue: Number(itemarr[index].quantity),
        pricePerMeas: Number(itemarr[index].sellingPrice),
        totalPrice: Number(itemarr[index].price),
        discount: 0,
        weight: 0,
        deliveryDate: new Date(),
        createdBy: '' + created,
        createdOn: new Date(),
        lastUpdatedBy: '',
        lastUpdatedOn: new Date(),
        status: 'Ordered',
        taxableAmount: Number(this.TaxPercent),
        cgst: 0,
        sgst: 0,
        remark: 'Test entry for test',
        itemDesc: '',
      };
      this.orderItemsList.push(item);
    }
    const SOdata: SalesOrderViewModel = {
      salesOrder: {
        id: 0,
        salesOrderId: '',
        customerId: 'CI01',
        bookingId: '',
        salesPerson: 'NA',
        pluCount: Number(this.Totalqty),
        totalQuantity: Number(this.Totalqty),
        totalWeight: 0,
        totalPrice: Number(
          this.Totalamount
        ),
        discount: this.finadisc,
        orderdStatus: 'Ordered',
        paymentStatus: 'Paid',
        comment: 'Test Entry for test only',
        createdBy: '' + this.created,
        lastUpdatedBy: '',
        bags: '0',
        paymentMode: 'Online',
        addressId: this.addressId,
        slotId: 'SLTID01',
        deliveryType: 'standard',
        deliveryCharges: '0',
        hubId: this.HubId,
        branch: this.HubId,
        purchaseId: '',
        transactionId: '' + this.transactionId,
        deliveryNotes: '',
        savings: '',
        source: 'Client Portal',
        otp: '',
        remainingAmount: 0,
        tableId: '',
        kotPrint: 0,
        tokenNumber: 0,
        orderType: 'HOD',
        taxType: Number(this.Tax?.taxType),
        taxBillType: Number(this.Tax?.taxbillType),
        vatTax: Number(this.Tax?.vatTaxpercent),
        gstTax: 0,
        kotLogPrint: 0,
        cancellationReason: '',
        coupenCode: '0',
        deliveryDate: new Date(),
        createdOn: new Date(),
        lastUpdatedOn: new Date(),
        customerName: '',
        createdByName: '',
        buildingName: '',
        roomNo: '',
        sector: '',
        locality: '',
        city: '',
        zipCode: '',
        wallet: 0,
      },
      orderItems: this.orderItemsList,
      orderTracking: this.orderTracking,
    };
    this.orderService.placeOrder(SOdata).subscribe({
      next: (res: any) => {
        this.orders = res;
        this.confirmOrderMD = { display: 'block' };
      },
      error: (err) => {
        this.app.commonLoader = false;
        this.confirmOrderMD = { display: 'none' };
        this.app.openSnackBar('Something went wrong. Please try again later.')
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
}