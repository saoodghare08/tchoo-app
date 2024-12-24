import { Component } from '@angular/core';
import { ProductService } from '../../_services/product/product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {
  createdBy : any = this.activatedRoute.snapshot.params['userId'];
  selectedlanguage:any="English";

  userdetails: any;
  constructor(private ProductService: ProductService, private activatedRoute: ActivatedRoute,) { }
  getuserdetails() {
    this.ProductService.getuserdetails(this.createdBy).subscribe(data => {
      this.userdetails = data;
      this.selectedlanguage= this.userdetails.language
    });
  }
}