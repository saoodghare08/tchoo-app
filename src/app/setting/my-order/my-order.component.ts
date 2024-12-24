import { MyordersDTOs } from './../../_common/DTOs/Order/MyOrdersDTOs';
import { OrderService } from './../../_services/orders/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Location } from '@angular/common';
import { LocalService } from 'src/app/_services/local.service';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
})
export class MyOrderComponent implements OnInit {
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  selectedlanguage: any = 'English';

  Orders: MyordersDTOs[] = [];
  userdetails: any = [];
  mycart: any = [];
  salesData: any = [];
  private history: string[] = [];
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    private local: LocalService,
    private location: Location,
    private product_service: ProductService,
    private router: Router
  ) { }
  ngOnInit(): void {
    if (this.createdby == '0') {
      window.location.href = '/SignIn/Goback'
    }
    else {
      this.getuserdetails();
    }
  }
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdby).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.getOrders();
      },
    });
  }
  getOrders() {
    this.orderService.getOrders(this.createdby).subscribe({
      next: (data: any) => {
        this.Orders = data;
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.getCartItems();
      },
    });
  }
  // get cart details
  getCartItems() {
    this.local.getCartItems(this.createdby).subscribe({
      next: (d) => {
        this.mycart = d;
      }, error: (e) => {
        // console.error(e);
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  backNavigation(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      window.location.href='/Home/' + this.createdby;
    }
  }
  orderTotal(total: any, discount: any) {
    return total - discount;
  }
}