import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ProductService } from '../_services/product/product.service';
import { Location } from "@angular/common";
import { LocalService } from 'src/app/_services/local.service';
import { MaincategoryService } from 'src/app/_services/maincategory/maincategory.service';
import { CategoryService } from '../_services/category/category.service';
@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent {
  @ViewChild('numericInput') numericInput!: ElementRef;
  private history: string[] = [];
  selectedlanguage: any = 'English';
  quantity: any = 1;

  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  maincatId: any = this.activatedRoute.snapshot.params['mncatId'];
  category: any = this.activatedRoute.snapshot.params['catId'];
  orderby: any = this.activatedRoute.snapshot.params['orderby'];
  sortId: any = this.activatedRoute.snapshot.params['sortId'];

  mycart: any;
  variantView: any;
  displayImg: any;
  itemid: any;
  itemName: any;
  selectedPrice: any;
  selectedSize: any;
  varianceindex: any;
  str: any;
  price: any;
  searchvalue: any;
  searchValue!: string;
  transcript$?: any;
  defaultzip: any;

  feature: any = [];
  userdetails: any = [];
  cartlist: any = [];
  getItems: any = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  navlink:any[]=[];

  modalPatch: boolean = false;
  isProductOutOfStock: boolean = false;

  Proddetails: any = {
    itemId: [''],
    sellingPrice: [''],
    quantity: [0],
    varient: [''],
    price: [''],
    createdby: ['']
  };
  // CONSTRUCTOR
  constructor(
    private product_service: ProductService,
    private app: AppComponent,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private local: LocalService,
    private service: MaincategoryService,
    private categoryservices: CategoryService,
  ) { }
  ngOnInit() {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    if (this.createdBy != 0) {
      this.getuserdetails();
    } else {
      this.getAllFeatured();
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
        // console.log(err);
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
        this.app.pageLoader = false;
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
        this.getCartItems();
      },
    });
  }
  // GET ALL PRODUCTs in cart
  getCartItems() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (data) => {
        this.mycart = [];
        this.mycart = data;
      },
      error: (e) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getAllFeatured();
      },
    });
  }
  getAllFeatured() {
    this.product_service.getFeaturedProducts('All', this.createdBy).subscribe({
      next: (respose) => {
        this.feature = respose;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }
    });
  }
  backNavigation(): void {
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
  // add to cart
  addToCart(val: { itemId: any; pluName: any; imagePath: any; }) {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback';
    } else {
      this.app.pageLoader = true;
      this.varianceindex = 0;
      this.itemid = val.itemId;
      this.itemName = val.pluName;
      this.displayImg = val.imagePath;
      this.product_service.getProductDetail(this.itemid, this.createdBy).subscribe({
        next: (data) => {
          this.cartlist = data;
          this.isProductOutOfStock = (this.cartlist?.pricelist[0]?.stockQty == 0) ? true : false;
          this.selectedPrice = this.cartlist?.pricelist[0]?.sellingPrice;
          this.selectedSize = this.cartlist?.pricelist[0]?.priceId;
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
  }
  /* CONTINUE PRODUCT */
  continueProduct() {
    this.Proddetails = { itemId: this.itemid, quantity: 1, price: this.selectedPrice, varient: this.selectedSize, createdby: this.createdBy, sellingPrice: this.selectedPrice };
    this.product_service.addtoCart(this.Proddetails).subscribe({
      next: (data) => {
        this.app.openSnackBar('Item added to cart!');
      },
      error: (err) => {
        this.app.pageLoader = false;
        // console.log(err);
        this.app.openSnackBar('Something went wrong. Please try again later');
      },
      complete: () => {
        this.getCartItems();
        this.GetProductDetails();
      },
    });
  }
  // get product by
  GetProductDetails() {
    this.product_service.getProductDetail(this.itemid, this.createdBy).subscribe({
      next: (data) => {
        this.cartlist = data;
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
  /* VARIENTS CHANGES */
  varientChange(price: any, size: any, index: any, itemId: any, stockQty: any) {
    this.app.commonLoader = true;
    this.selectedPrice = price;
    this.selectedSize = size;
    this.varianceindex = index;
    this.isProductOutOfStock = (stockQty === 0) ? true : false;
    this.app.commonLoader = false;
  }
  /* CLOSE VARIANT */
  closeVariant() {
    this.variantView = false;
    this.modalPatch = false;
  }
  UpdateQuantPrice(id: any, data: any) {
    data.createdby = this.createdBy;
    this.local.UpdateQuantPrice(id, data).subscribe({
      next: (data) => {
        // console.log(data);
      },
      error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.error(err);
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  /* HANDLE PLUS */
  handlePlus(product: any) {
    this.str = product.quantity;
    if (this.str < product.stockQty) {
      this.quantity = parseInt(this.str) + 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.UpdateQuantPrice(product.id, product);
      this.app.openSnackBar(`${product.prodName} quantity changed to ${this.quantity}`);
    } else {
      this.app.openSnackBar('Order Limit Exceed');
    }
  }
  onInputUpdateqty(product: any, enteredQty: any) {
    this.str = enteredQty.value;
    if (this.str <= product.stockQty) {
      if (this.str != '' && this.str != '0') {
        this.price = this.str * product.sellingPrice;
        product.price = Number(this.price);
        product.quantity = Number(this.str);
        if (this.str == 0) {
          this.RemoveProdFromCart(product.id)
        } else {
          this.UpdateQuantPrice(product.id, product);
          this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
        }
      }
    } else {
      this.price = product.stockQty * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = Number(product.stockQty);
      (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.stockQty;
      this.UpdateQuantPrice(product.id, product);
      this.app.openSnackBar(`Order Limit Exceed`);
    }
  }
  /* HANDLE MINUS */
  handleMinus(product: any) {
    this.str = product.quantity;
    if (parseInt(this.str) != 1 && parseInt(this.str) != 0) {
      this.quantity = parseInt(this.str) - 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${this.quantity}`);
    } else {
      this.RemoveProdFromCart(product.id);
    }
    this.UpdateQuantPrice(product.id, product);
  }
  /* REMOVE PRODUCT FROM CART */
  RemoveProdFromCart(id: any) {
    if (id != null) {
      this.app.pageLoader = true;
      this.local.RemoveProdFromCart(id, this.createdBy).subscribe({
        next: (data) => {
          this.app.openSnackBar('Item removed from the cart');
        },
        error: (err) => {
          this.app.commonLoader = false;
          this.app.pageLoader = false;
          // console.log(err);
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.getCartItems();
          this.GetProductDetails();
        },
      });
    }
  }
  // ADDED WISH LIST
  addedWishlist(item: any) {
    if (this.createdBy == 0 || null) {
      window.location.href = '/SignIn/Goback';
    } else {
      this.app.pageLoader = true;
      item.customerId = this.createdBy;
      this.categoryservices.addWishList(item).subscribe({
        next: (data) => {
          this.app.openSnackBar('Added to wishlist successfully');
        },
        error: (err) => {
          this.app.commonLoader = false;
          this.app.pageLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
        },
        complete: () => {
          this.getCartItems();
        },
      });
    }
  }
  /* REMOVE ADD WISH LIST*/
  removeWishlist(id: any) {
    this.app.pageLoader = true;
    this.categoryservices.removeWishlist(id).subscribe({
      next: (data) => {
        this.app.openSnackBar('Removed from wishlist successfully');
      },
      error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        this.app.openSnackBar('Something went wrong. Please try again later');
      },
      complete: () => {
        this.getCartItems();
      },
    });
  }
  // PRODUCT SERACH FUNCTION
  search() {
    this.searchvalue = this.searchValue;
    window.location.href='/search-list/' + this.createdBy + '/' + this.searchvalue + '/' + this.HubId;
  }
}
