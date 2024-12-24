import { CategoryService } from 'src/app/_services/category/category.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../_services/orders/order.service';
import { ProductService } from '../_services/product/product.service';
import { AppComponent } from 'src/app/app.component';
import { LocalService } from '../_services/local.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent {
  custId: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  getWishListData: any = [];
  cartlist: any = [];
  userdetails: any = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];

  modalPatch: boolean = false;
  variantView: boolean = false;
  isProductOutOfStock: boolean = false;

  selectedPrice: any;
  selectedSize: any;
  itemid: any;
  itemName: any;
  wishlistId: any;
  selectedlanguage: any;
  displayimg: any;
  searchValue: any;
  searchvalue: any;
  varianceindex: any;
  wishlistdetails: any;
  defaultzip: any;
  constructor(
    private _orderService: OrderService,
    private categoryservice: CategoryService,
    private product_service: ProductService,
    public local: LocalService,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent
  ) {
    if (this.custId == '0') {
      window.location.href = '/SignIn/Goback';
    } else {
      this.getuserdetails();
    }
  }
  // get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.custId).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getAddress();
      },
    });
  }
  // Get user's all addresses
  getAddress() {
    this.local.getAddress(this.custId).subscribe({
      next: (data) => {
        this.addlist = data;
        this.DefultAdd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzip = this.DefultAdd?.zipCode;
      },
      error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
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
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getWishList();
      },
    });
  }
  // get wishlist
  getWishList() {
    this._orderService.getAllWishList(this.custId).subscribe({
      next: (response) => {
        this.getWishListData = response;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  // add to cart step 1
  addToCart(val: { id: any; itemId: any; priceId: any; quantity: any; customerId: any; addedby: any; sellingPrice: any; pluName: any; description: any; }) {
    this.app.pageLoader = true;
    this.varianceindex = 0;
    this.wishlistId = val.id;
    this.itemid = val.itemId;
    this.itemName = val.pluName;
    this.displayimg = val.description;
    this.product_service.getProductDetail(this.itemid, this.custId).subscribe({
      next: (data) => {
        this.cartlist = data;
        this.selectedPrice = this.cartlist?.pricelist[0].sellingPrice;
        this.selectedSize = this.cartlist?.pricelist[0].priceId;
        if (this.cartlist?.pricelist?.length == 1) {
          this.variantView = false;
          this.modalPatch = false;
          this.continueProduct();
        } else {
          this.variantView = true;
          this.modalPatch = true;
          this.app.pageLoader = false;
        }
      }, error: (err) => {
        this.app.pageLoader = false;
        // console.log(err);
        this.app.openSnackBar('Something went wrong. Please try again later');
      }
    });
  }
  // add to cart final step
  continueProduct() {
    if (this.custId == '0') {
      window.location.href = '/SignIn/Goback'
    } else {
      this.wishlistdetails = {
        itemId: this.itemid,
        quantity: 1,
        price: this.selectedPrice,
        varient: this.selectedSize,
        createdby: this.custId,
        sellingPrice: this.selectedPrice,
      };
      this.product_service.addtoCart(this.wishlistdetails).subscribe({
        next: (data) => {
          this.app.openSnackBar('Item added to cart!');
          this.variantView = false;
          this.modalPatch = false;
        },
        error: (err) => {
          this.app.pageLoader = false;
          // console.log(err);
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.RemoveItemFromWishList(this.wishlistId);
        },
      });
    }
  }
  // remove item from wishlist
  RemoveItemFromWishList(id: any) {
    this.app.pageLoader = true;
    this.categoryservice.removeWishlist(id).subscribe({
      next: (data) => {
        //  console.log(data);
      },
      error: (err) => {
        this.app.pageLoader = false;
        // console.log(err);
        this.app.openSnackBar('Something went wrong. Please try again later');
      }, complete: () => {
        this.getWishList();
      },
    });
  }
  // select varient
  varientChange(price: any, size: any, index: any, stockQty: any) {
    this.app.pageLoader=true;
    this.selectedPrice = price;
    this.selectedSize = size;
    this.varianceindex = index;
    this.isProductOutOfStock = (stockQty === 0) ? true : false;
    this.app.pageLoader=false;
  }
  // close select varient popup
  closeVariant() {
    this.variantView = false;
    this.modalPatch = false;
  }
}