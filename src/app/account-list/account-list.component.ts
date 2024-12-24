import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../_services/product/product.service';
import { AppComponent } from '../app.component';
import { LocalService } from '../_services/local.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  selectedlanguage:any="English";

  userdetails:any=[];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];

  fullname:any;
  contact:any;
  defaultzip: any;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private product_service:ProductService,
    private app:AppComponent,
    private localService:LocalService
  ) {
    this.getuserdetails();
  }
  getuserdetails() {
    this.app.commonLoader=true;
    this.product_service.getuserdetails(this.createdby).subscribe({
      next:(data) => {
        this.userdetails = data;
        this.fullname = this.userdetails.fullName;
        this.contact = this.userdetails.contact;
        this.selectedlanguage = this.userdetails.language
      },error:(err)=> {
        this.app.commonLoader = false;
        // console.log(err);
      },complete:()=> {
        this.getAddress();
      },
    });
  }
  // Get user's all addresses
  getAddress() {
    this.localService.getAddress(this.createdby).subscribe({
      next: (data) => {
        this.addlist = data;
        this.DefultAdd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzip = this.DefultAdd?.zipCode;
      },
      error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      },
      complete: () => {
        this.getHub();
      },
    });
  }
  // Get Hub details
  getHub() {
    this.localService.getHub(this.defaultzip).subscribe({
      next: (data) => {
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.Hub = data;
          this.HubId = this.Hub.hubId;
        }
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader=false;
      },
    });
  }
}