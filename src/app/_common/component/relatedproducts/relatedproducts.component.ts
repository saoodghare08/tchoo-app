import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CategoryService } from 'src/app/_services/category/category.service';
import { LocalService } from 'src/app/_services/local.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { ProductDTOs } from '../../DTOs/Order/ProductDTOs';

@Component({
  selector: 'app-relatedproducts',
  templateUrl: './relatedproducts.component.html',
  styleUrls: ['./relatedproducts.component.scss'],
})
export class RelatedproductsComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  MaincatId: any = this.activatedRoute.snapshot.params['mncatId'];
  selectedlanguage: any = 'English';
  varianceindex: any = 0;

  quantity!: number;
  mycart: any;
  str: any;
  price: any;
  variantView: any;
  itemName: any;
  selectedPrice: any;
  selectedSize: any;
  displayImg: any;
  userdetails: any;
  defaultzip: any;
  @Input() itemid :any;

  modalPatch: boolean = false;
  isProductOutOfStock: boolean = false;

  getItems: any = [];
  cartlist: any = [];
  addlist: any = [];
  DefultAdd: any = [];
  Hub: any = [];

  products: ProductDTOs = {
    id: 0,
    img: undefined,
    itemId: '',
    productName: '',
    description: '',
    pluName: '',
    price: '',
    createby: '',
    pattern: '',
    quantity: 0,
    isAdded: undefined,
    pluCode: '',
    category: '',
    subCategory: '',
    measurement: '',
    size: '',
    weight: 0,
    createdBy: '',
    createdOn: '',
    lastUpdatedBy: '',
    lastUpdatedOn: '',
    purchaseprice: '',
    wastage: '',
    profitMargin: '',
    sellingPrice: '',
    marketPrice: '',
    title: '',
    imagePath: '',
    profitPrice: '',
    actualCost: '',
    seasonSale: '',
    manufracture: '',
    foodSegment: '',
    totalViews: 0,
    totalFavs: 0,
    sellingVarience: '',
    itemSellingType: '',
    supplier: '',
    featured: '',
    promoVideoLink: '',
    longDescription: '',
    mainCategory: '',
    featuredStartDate: '',
    approval: '',
    offerId: '',
    stockType: '',
    netWeight: 0,
    totalStock: '',
    maxQuantityAllowed: 0,
    brand: '',
    tag: '',
    itemType: '',
    visibility: 0,
    relation: 0,
    availableDay: 0,
    mealTimeType: '',
    startTime: '',
    preparationTime: '',
    isSpecialDay: '',
    endTime: '',
    hub: '',
    iFrame: undefined
  };
  Proddetails: any = {
    itemId: [''],
    sellingPrice: [''],
    quantity: [0],
    varient: [''],
    price: [''],
    createdby: [''],
  };
  constructor(
    private categoryservices: CategoryService,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    private local: LocalService,
    private product_service: ProductService
  ) { }
  ngOnInit(): void {
    if (this.createdBy != '0') {
      this.getuserdetails();
    } else {
      this.getRelatedProds();
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
        this.app.pageLoader = false;
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
      },error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },complete: () => {
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
      }, complete: () => {
        this.getCartItems();
      },
    });
  }
  // GET ALL PRODUCT from cart
  getCartItems() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (data) => {
        this.mycart = data;
        this.local.updateCartCount(this.mycart.length);
      },error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.getRelatedProds();
      }
    });
  }
  // get top 5 related product
  getRelatedProds() {
    this.categoryservices.getcategorybyId(this.MaincatId, this.createdBy,this.itemid).subscribe({
      next: (data) => {
        this.getItems = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }
    });
  }
  // get product details by id
  GetProductDetails() {
    this.product_service.getProductDetail(this.products.itemId, this.createdBy).subscribe({
      next: (data) => {
        this.cartlist = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  //add to wishlist
  // addedWishlist(item: any) {
  //   if (this.createdBy == 0 || null) {
  //     window.location.href = '/SignIn/Goback';
  //   } else {
  //     this.app.pageLoader = true;
  //     item.customerId = this.createdBy;
  //     this.categoryservices.addWishList(item).subscribe({
  //       next: () => {
  //         this.app.openSnackBar('Added to wishlist successfully');
  //       },error: (err) => {
  //         this.app.openSnackBar('Something went wrong. Please try again later');
  //         this.app.commonLoader = false;
  //         this.app.pageLoader = false;
  //       }, complete: () => {
  //         this.getCartItems();
  //       }
  //     });
  //   }
  // }
  // remove from wishlist
  // removeWishlist(id: any) {
  //   this.app.pageLoader = true;
  //   this.categoryservices.removeWishlist(id).subscribe({
  //     next: (data) => {
  //       this.app.openSnackBar(' Removed from wishlist successfully');
  //     },error: (err) => {
  //       this.app.openSnackBar('Something went wrong. Please try again later');
  //       this.app.commonLoader = false;
  //       this.app.pageLoader = false;
  //     }, complete: () => {
  //       this.getCartItems();
  //     }
  //   });
  // }
  // add to cart
  addToCart(val: { itemId: any; pluName: any; imagePath: any; }) {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback';
    } else {
      this.app.pageLoader = true;
      this.varianceindex = 0;
      this.products.itemId = val.itemId;
      this.itemName = val.pluName;
      this.displayImg = val.imagePath;
      this.product_service.getProductDetail(this.products.itemId, this.createdBy).subscribe({
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
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.pageLoader = false;
        }
      });
    }
  }
  /* CONTINUE PRODUCT */
  continueProduct() {
    this.Proddetails = { itemId: this.products.itemId, quantity: 1, price: this.selectedPrice, varient: this.selectedSize, createdby: this.createdBy, sellingPrice: this.selectedPrice };
    this.product_service.addtoCart(this.Proddetails).subscribe({
      next: (data) => {
        this.app.openSnackBar('Item added to cart!');
      },error: (err) => {
        this.app.openSnackBar('Something went wrong. Please try again later');
        this.app.pageLoader = false;
      },complete: () => {
        this.getCartItems();
        this.GetProductDetails();
      },
    });
  }
  //VARIANT CHANGES
  varientChange(price: any, size: any, index: any, itemId: any, stockQty: any) {
    this.app.pageLoader = true;
    this.selectedPrice = price;
    this.selectedSize = size;
    this.varianceindex = index;
    this.isProductOutOfStock = (stockQty === 0) ? true : false;
    this.app.pageLoader = false;
  }
  // CLOSE VARIANT
  closeVariant() {
    this.variantView = false;
    this.modalPatch = false;
  }
  // update price as per quantity
  UpdateQuantPrice(id: any, data: any) {
    data.createdby = this.createdBy;
    this.local.UpdateQuantPrice(id, data).subscribe({
      next: (data) => {},
      error: (err) => {
        this.app.openSnackBar('Something went wrong. Please try again later');
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.getCartItems();
      },
    });
  }
  // plus counter
  handlePlus(product: any) {
    this.str = product.quantity;
    if (this.str < product.stockQty) {
      this.quantity = parseInt(this.str) + 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
      this.UpdateQuantPrice(product.id, product);
    } else {
      this.app.openSnackBar('Order Limit Exceed');
    }
  }
  // minus counter
  handleMinus(product: any) {
    this.str = product.quantity
    if (parseInt(this.str) != 1 && parseInt(this.str) != 0) {
      this.quantity = parseInt(this.str) - 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
      this.UpdateQuantPrice(product.id, product);
    } else {
      this.RemoveProdFromCart(product.id);
    }
  }
  //on Input Update qty
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
      this.app.openSnackBar(`Order Limits Exceed`);
    }
  }
  // remove from cart
  RemoveProdFromCart(id: any) {
    if (id != null) {
      this.app.pageLoader = true;
      this.local.RemoveProdFromCart(id, this.createdBy).subscribe({
        next: (data) => {
          this.app.openSnackBar('Item removed from the cart');
        }, error: (err) => {
          this.app.commonLoader = false;
          this.app.pageLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.getCartItems();
          this.GetProductDetails();
        },
      });
    }
  }
}
