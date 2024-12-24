import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/_services/orders/order.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit {
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  selectedlanguage: any = "English";

  userdetails: any;
  SuccesMD: any;
  submitted:any;

  req: any = [];

  support = this.fb.group({
    id: [0],
    fullName: ['',[Validators.required,Validators.pattern("^(?=[a-zA-Z\u00C0-\u00FF']*[a-zA-Z\u00C0-\u00FF]{2,})[a-zA-Z\u00C0-\u00FF']+([',. -][a-zA-Z\u00C0-\u00FF ]+)*$")]],
    email: ['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    message: ['',Validators.required],
    customerId: [''],
    createdBy: ['']
  });
  constructor(
    private ProductService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    private app: AppComponent
  ) { }
  ngOnInit(): void {
    this.getuserdetails();
  }
  getuserdetails() {
    this.app.commonLoader = true;
    this.ProductService.getuserdetails(this.createdby).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  get formData(){
    return this.support.controls;
  }
  closeMd(){
    this.SuccesMD = { 'display': 'none' };
  }
  AddSupportRequest() {
    this.submitted=true;
    if (this.support.status == 'INVALID') {
      this.app.pageLoader = false;
      return;
    } else {
      this.app.pageLoader = true;
      this.support.value.customerId = this.createdby
      this.support.value.createdBy = this.createdby
      this.orderService.addContactSupportrequest(this.support.value).subscribe({
        next: (data: any) => {
          this.req = data;
          this.SuccesMD = { 'display': 'block' };
        },
        error: (err) => {
          this.SuccesMD = { 'display': 'none' };
          this.app.pageLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.app.pageLoader = false;
        },
      })
    }
  }
}