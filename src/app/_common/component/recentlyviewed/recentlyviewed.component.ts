import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/_services/product/product.service';
import { LocalService } from 'src/app/_services/local.service';

@Component({
  selector: 'app-recentlyviewed',
  templateUrl: './recentlyviewed.component.html',
  styleUrls: ['./recentlyviewed.component.scss'],
})
export class RecentlyviewedComponent {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  selectedlanguage: any = 'English';

  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  getViewedProducts: any = [];

  defaultzip: any;
  userdetails: any;
  constructor(
    private product_service: ProductService,
    private activatedRoute: ActivatedRoute,
    public app: AppComponent,
    private local: LocalService
  ) { }
  ngOnInit() {
    // get userdetails
    if (this.createdBy !== '0') {
      this.getuserdetails();
    }
  }
  //get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
      }, complete: () => {
        this.getAddress();
      }
    });
  }
  // Get user's all addresses
  getAddress() {
    this.local.getAddress(this.createdBy).subscribe({
      next: (data) => {
        this.addlist = data;
        this.DefultAdd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzip = this.DefultAdd?.zipCode;
      },
      error: (err) => {
        this.app.commonLoader = false;
      },
      complete: () => {
        this.getHub();
      }
    });
  }
  // Get Hub details
  getHub() {
    this.local.getHub(this.defaultzip).subscribe({
      next: (data) => {
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.Hub = data;
          this.HubId = this.Hub.hubId;
        }
      }, error: (err) => {
        this.app.commonLoader = false;
      }, complete: () => {
        this.getRecenltyviewItems();
      }
    });
  }
  //Get Recently Viewed Items
  getRecenltyviewItems() {
    this.product_service.getRecenltyviewItems(this.createdBy, 'Top_5').subscribe({
      next: (data) => {
        this.getViewedProducts = data;
      }, error: (err) => {
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      }
    });
  }
}