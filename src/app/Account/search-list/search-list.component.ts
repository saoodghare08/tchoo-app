import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ItemDTO } from 'src/app/_common/DTOs/Category/ItemDTO';
import { LocalService } from 'src/app/_services/local.service';
import { MaincategoryService } from 'src/app/_services/maincategory/maincategory.service';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  catId: any = this.activatedRoute.snapshot.params['catId'];
  searchvalue: any = decodeURIComponent(this.activatedRoute.snapshot.params['value']);
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  getItems: ItemDTO[] = [];
  userdetails: any = [];
  mycart: any = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  navlink:any[]=[];

  fullname: any;
  defaultzip: any;
  value: any;
  selectedlanguage: any;
  constructor(
    private service: MaincategoryService,
    private activatedRoute: ActivatedRoute,
    private product_service: ProductService,
    private local: LocalService,
    private app: AppComponent,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== decodeURIComponent(this.router.url) || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: decodeURIComponent(this.router.url) });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    this.AdvanceSearchData();
    if(this.createdBy != '0'){
      this.getuserdetails();
    }
  }
  // GET searched results from url value
  AdvanceSearchData() {
    this.app.commonLoader = true;
    this.service.searchwithmain('any', this.searchvalue, this.createdBy).subscribe({
      next: (data: any) => {
        this.getItems = [];
        this.getItems = data;
      }, error: (err) => {
        this.getItems = [];
        this.app.commonLoader = false;
      },complete:()=>{
        this.app.commonLoader = false;
      }
    })
  }
  // get userdetails
  getuserdetails() {
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.fullname = this.userdetails.fullName;
        this.selectedlanguage = this.userdetails.language
      }, error: (err) => {
        this.app.commonLoader = false;
      }, complete: () => {
        this.getAddress()
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
      },
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
        this.GetMyCart();
      },
    });
  }
  // GET ALL PRODUCT from cart
  GetMyCart() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (d) => {
        this.mycart = d;
      },
      error: (err) => {
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      },
    })
  }
  // GET searched results from same page
  GetProductsByName() {
    if(this.value != undefined && this.value !=''){
      this.searchvalue = this.value;
      this.app.pageLoader = true;
      this.service.searchwithmain('any', this.value, this.createdBy).subscribe({
        next: (data: any) => {
          this.getItems = [];
          this.getItems = data;
        },
        error: (err) => {
          this.getItems = [];
          this.app.pageLoader = false;
        }, complete: () => {
          this.app.pageLoader = false;
        },
      })
    }
  }
  navigateByUrl(){
     if (this.navlink.length == 0 || (this.navlink.length == 1 && this.router.url == this.navlink[this.navlink.length-1]?.url)) {
      window.location.href='/Home/' + this.createdBy;
    } else if(this.router.url == this.navlink[this.navlink.length - 1]?.url){
      this.navlink.splice(this.navlink.length-1);
      sessionStorage.removeItem(this.navlink[this.navlink.length-1].url);
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
      this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
      window.location.href=this.navlink[this.navlink.length - 1]?.url;
    }else{
     setTimeout(() => {
      this.navlink.splice(this.navlink.length-1);
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
     }, 100);
      this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
      window.location.href=this.navlink[this.navlink.length-2]?.url;
    }
  }
}