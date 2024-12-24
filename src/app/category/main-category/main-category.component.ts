import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaincategoryService } from 'src/app/_services/maincategory/maincategory.service';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/_services/product/product.service';
import { LocalService } from 'src/app/_services/local.service';
import { Location } from "@angular/common"

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss']
})
export class MainCategoryComponent {
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  
  selectedlanguage: any = "English";
  maincategory: any;
  searchValue: any;
  searchvalue: any;
  defaultzip: any;
 
  userdetails: any = [];
  mycart: any = []
  private history: string[] = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  constructor(
    private service: MaincategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private product_service: ProductService,
    private local: LocalService,
    public app: AppComponent,
    private location: Location
  ) { }
  ngOnInit() {
    this.app.ReturnParam.push({ url: this.router.url })
    if (this.createdBy != 0) {
      this.getuserdetails();
    }else{
      this.getmaincategory();
    }
  }
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        // console.error(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.getAddress();
      },
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
        // console.log(err);
      }, complete: () => {
        this.getCartItems();
      },
    });
  }
  // GET ALL PRODUCT from cart
  getCartItems() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (d) => {
        this.mycart = d;
      },error: (e) => {
        // console.error(e);
        this.app.commonLoader = false;
      },complete:()=> {
        this.getmaincategory();
      },
    })
  }
  getmaincategory() {
    this.app.commonLoader=true;
    this.service.getmaincategory('All', this.createdBy).subscribe({
      next:(response) => {
        this.maincategory = response;
      },error: (e) => {
        // console.error(e);
        this.app.commonLoader = false;
      },complete:()=> {
        this.app.commonLoader=false;
      },
    });
  }
  backNavigation(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/Home/" + this.createdBy);
    }
  }
  // redirecting to search component with value
  search() {
    this.searchvalue = this.searchValue;
    this.router.navigate(['/search-list/' + this.createdBy + '/' + this.searchvalue + '/' + this.HubId])
  }
  // redirecting to subcategory component
  getcategory(id: any) {
    this.router.navigate(['Main-Category/SubCategory/ProductList/' + id + '/' + this.createdBy + '/' + this.HubId + '/asc/0/0']);
  }
}