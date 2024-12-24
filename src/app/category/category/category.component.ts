import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/_services/category/category.service';
import { AppComponent } from 'src/app/app.component';
import { LocalService } from 'src/app/_services/local.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { Location } from "@angular/common"

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  categoryId: any = this.activatedRoute.snapshot.params['id'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  getItems: any = [];
  mainCategoryName: any = [];
  userdetails: any = [];
  mycart: any = [];
  private history: string[] = [];

  id!: any;
  fullName: any;
  searchValue: any;
  searchvalue: any
  prductFilerView: any;
  prductSortView: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryservices: CategoryService,
    public app: AppComponent,
    private local: LocalService,
    private router: Router,
    private product_service: ProductService,
    private location: Location
  ) { }
  ngOnInit(): void {
    this.getuserdetails();
  }
  // redirecting to search component with value
  search() {
    this.searchvalue = this.searchValue;
    this.router.navigate(['/search-list/' + this.createdBy + '/' + this.searchvalue + '/' + this.HubId])
  }
  // get userdetails
  getuserdetails() {
    this.app.commonLoader=true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next:(data) => {
        this.userdetails = data;
        this.fullName = this.userdetails.fullName;
      },error:(err)=> {
        // console.log(err);
        this.app.commonLoader = false;
      },complete:()=> {
        this.getcategory();
      },
    });
  }
   // GET CATEGORY details
  getcategory() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.categoryservices.getcategory(this.id, this.createdBy).subscribe({
      next:(response) => {
        this.getItems = response;
      },error:(err)=> {
        // console.log(err);
        this.app.commonLoader = false;
      },complete:()=> {
        this.getCartItems();
      },
    })
  }
  // GET ALL PRODUCT from cart
  getCartItems() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (data) => {
        this.mycart = data;
      },error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      },complete:()=> {
        this.app.commonLoader = false;
      },
    })
  }
  // CATEGORY FILTER
  filterCategories = [
    { name: "Action", id: 1 },
    { name: "Black", id: 2 },
    { name: "Green", id: 3 },
    { name: "Herbal", id: 4 },
    { name: "Ice Tea", id: 5 },
    { name: "Mini tins pack", id: 6 },
    { name: "Pu Erh", id: 7 },
    { name: "Rooibos", id: 8 },
    { name: "White", id: 9 },
  ]
  sortCategory = [
    { name: "Price (Low to high)", id: 1 },
    { name: "Price (High to low)", id: 2 },
    { name: "Newest first", id: 3 },
    { name: "Top sellers", id: 4 },
    { name: "Customer rating", id: 4 },
  ]
  // PRODUCT FILTER modal show
  productFilter() {
    this.prductFilerView = { 'display': 'block' };
  };
  // PRODUCT sorting modal show
  productSort() {
    this.prductSortView = { 'display': 'block' };
  }
  // PRODUCT FILTER , sorting modal hide
  closemd() {
    this.prductFilerView = { 'display': 'none' };
    this.prductSortView = { 'display': 'none' };
  };
  backNavigation(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/Home/" + this.createdBy);
    }
  }
}