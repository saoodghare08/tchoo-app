import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'bootstrap';
import { LocalService } from 'src/app/_services/local.service';
import { Location } from '@angular/common';
import { ProductService } from 'src/app/_services/product/product.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-save-address',
  templateUrl: './save-address.component.html',
  styleUrls: ['./save-address.component.scss'],
})
export class SaveAddressComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  selectedlanguage: any = 'English';

  addlist: any = [];
  navlink:any[]=[];

  actionModal: any;
  userdetails: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localService: LocalService,
    private router: Router,
    private location: Location,
    private product_service: ProductService,
    private app: AppComponent
  ) {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback'
    } else {
      this.getuserdetails();
    }
  }
  ngOnInit() {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
  }
  // get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.getAddressList();
      },
    });
  }
  // get address  list by userId
  getAddressList() {
    this.localService.getAddress(this.createdBy).subscribe({
      next: (data) => {
        this.addlist = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.sync();
      },
    });
  }
  // if the address is not load this calls the get address function secretly
  sync() {
    this.localService.getAddress(this.createdBy).subscribe({
      next: (data) => {
        this.addlist = [];
        this.addlist = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  backNavigation() {
    this.location.back();
  }
  toggle(modalElement: string | Element) {
    const modal = new Dropdown(modalElement);
    modal.toggle();
  }
  // delete address
  DeleteAdd(id: any) {
    this.app.pageLoader = true;
    this.localService.deleteadd(id).subscribe({
      next: () => {},
      error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.getAddressList();
      },
    });
  }
  // set as default
  SetDefault(addId: any) {
    this.app.pageLoader = true;
    this.localService.setDefault(this.createdBy, 'Default', addId).subscribe({
      next: (d: any) => {
      }, error: (err) => {
        // console.log(err);
        this.app.pageLoader = false;
      }, complete: () => {
        this.getAddressList();
      },
    });
  }
  // show address action modal
  saveAddressAction() {
    this.actionModal = !this.actionModal;
  }
}