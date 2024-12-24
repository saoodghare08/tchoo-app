import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../_services/category/category.service';
import { MaincategoryService } from '../_services/maincategory/maincategory.service';
import { LocalService } from '../_services/local.service';
import { ProductService } from '../_services/product/product.service';
import { AppComponent } from 'src/app/app.component';
import { BannerDTOs } from '../_common/DTOs/Home/BannerDTOs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  maincatId: any = this.activatedRoute.snapshot.params['mncatId'];
  selectedlanguage: any = 'English';
  HubId: any = 'HID01';
  varianceindex: any = 0;

  modalPatch: boolean = false;
  isProductOutOfStock: boolean = false;

  topBanner: BannerDTOs[] = [];
  bottomBanner: BannerDTOs[] = [];
  userdetails: any = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  catIds: any = [];
  mycart: any = [];
  navlink: any[] = [];

  searchValue!: string;
  quantity!: number;
  feature: any;
  getmaincategory: any;
  getViewedProducts: any;
  defaultzip: any;
  searchvalue: any;
  transcript$?: any;
  str: any;
  price: any;
  variantView: any;
  displayImg: any;
  itemName: any;
  selectedPrice: any;
  selectedSize: any;
  itemid: any;
  orderbyFinal: any;
  SortIdFinal: any;
  cartlist: any;
  prodid: any;
  productId: any;

  Proddetails: any = {
    itemId: [''],
    sellingPrice: [''],
    quantity: [0],
    varient: [''],
    price: [''],
    createdby: [''],
  };

  /* MAIN BANNER */
  mainBanner = {
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    dots: false,
    arrows: true,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
  };

  // CATEGORY SLIDER
  categorySlider = {
    infinite: true,
    centerMode: true,
    slidesToShow: 4,
    dots: false,
    arrows: true,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
  };

  /* CONSTRUCTOR */
  constructor(
    private router: Router,
    private service: MaincategoryService,
    private ProductService: ProductService,
    private app: AppComponent,
    private activatedRoute: ActivatedRoute,
    private local: LocalService,
    private categoryservices: CategoryService
  ) {
    if (this.createdBy != 0 && this.createdBy != "undefined") {
      const details = { createdBy: this.createdBy };
      this.local.getdetails(details);
      this.getuserdetails();
    } else {
      this.getTopBannerList();
    }
  }
  /* NG ONININT */
  ngOnInit() {
    if (this.app.ReturnParam[this.app.ReturnParam.length - 1]?.url != this.router.url) {
      this.app.ReturnParam.push({ url: this.router.url });
    }
    sessionStorage.clear();
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
  }
  /* GET USER DETAILS */
  getuserdetails() {
    if (this.createdBy !== "0") {
      this.app.commonLoader = true;
      this.ProductService.getuserdetails(this.createdBy).subscribe({
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
  }
  /* GET address list of user */
  getAddress() {
    this.local.getAddress(this.createdBy).subscribe({
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
  /* GET HUB ID */
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
        this.getTopBannerList();
      }
    });
  }
  /* GET BANNER LIST */
  getTopBannerList() {
    this.app.commonLoader = true;
    this.ProductService.getTopBannerList(this.HubId).subscribe({
      next: (res: any) => {
        this.topBanner = res;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getBottomBannerList();
      },
    });
  }
  getBottomBannerList() {
    this.ProductService.getBottomBannerList(this.HubId).subscribe({
      next: (res: any) => {
        this.bottomBanner = res;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getMainCategory();
      },
    });
  }
  getMainCategory() {
    this.service.getmaincategory('All', this.createdBy).subscribe({
      next: (response) => {
        this.getmaincategory = response;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getRecenltyviewItems();
      },
    });
  }
  /* GET top 5 RECENTLY viewed ITEMS */
  getRecenltyviewItems() {
    this.ProductService.getRecenltyviewItems(this.createdBy, 'Top_5').subscribe({
      next: (data) => {
        this.getViewedProducts = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.GetAllProducts();
      },
    });
  }
  /* GET ALL PRODUCT */
  GetAllProducts() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (data) => {
        this.mycart = data;
      },
      error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.error(err);
      }, complete: () => {
        this.getfeature();
      },
    });
  }
  /* FEATURES list top 5 */
  getfeature() {
    this.ProductService.getFeaturedProducts('Top_5', this.createdBy).subscribe({
      next: (response) => {
        this.feature = response;
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
  /* GET ALL FEATURES nav */
  getAllfeature() {
    window.location.href = '/featured-item/' + this.createdBy + '/' + this.HubId;
  }
  /* GET CATEGORY nav*/
  getAllCategory(id: any) {
    window.location.href = 'Main-Category/SubCategory/ProductList/' + id + '/' + this.createdBy + '/' + this.HubId + '/asc/0/0';
  }
  /* PRODDUCT DETAILS */
  proddetails(itemId: any) {
    this.ProductService.getProductDetail(itemId, this.createdBy).subscribe({
      next: (data) => {
        this.cartlist = data;
        var mnctg = this.cartlist.product.mainCategory;
        window.location.href = '/Main-Category/SubCategory/Category/Products/' + itemId + '/' + mnctg + '/' + this.createdBy + '/' + this.HubId + '/asc/0/0';
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      },
    });
    // }
  }
  /* PRODUCT SERACH FUNCTION */
  search() {
    this.searchvalue = this.searchValue;
    if (this.searchvalue != undefined && this.searchvalue != '') {
      this.router.navigate(['/search-list/' + this.createdBy + '/' + encodeURI(this.searchvalue) + '/' + this.HubId]);
    }
  }
  /* ADDED WISH LIST */
  addedWishlist(item: any) {
    if (this.createdBy == 0) {
      window.location.href = '/SignIn/Goback'
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
          // console.log(err);
        },
        complete: () => {
          this.getfeature();
        },
      });
    }
  }
  /* REMOVE WISH LIST */
  removeWishlist(id: any) {
    this.app.pageLoader = true;
    this.categoryservices.removeWishlist(id).subscribe({
      next: (data) => {
        this.app.openSnackBar('Removed from wishlist successfully');
      },
      error: (e) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        this.app.openSnackBar('Something went wrong, Please try again later');
      },
      complete: () => {
        this.getfeature();
      },
    });
  }
  /* PRODUCT DETAILS PAGE  */
  producdetailspage(itemId: any) {
    if (this.catIds == '') {
      this.catIds = '0';
      window.location.href =
        '/Main-Category/SubCategory/Category/Products/' +
        itemId +
        '/' +
        this.maincatId +
        '/' +
        this.createdBy +
        '/' +
        this.HubId +
        '/' +
        this.orderbyFinal +
        '/' +
        this.SortIdFinal +
        '/' +
        this.catIds
        ;
    } else {
      window.location.href =
        '/Main-Category/SubCategory/Category/Products/' +
        itemId +
        '/' +
        this.maincatId +
        '/' +
        this.createdBy +
        '/' +
        this.HubId +
        '/' +
        this.orderbyFinal +
        '/' +
        this.SortIdFinal +
        '/' +
        this.catIds
        ;
    }
  }
  // add to cart
  addToCart(val: { id: any; itemId: any; priceId: any; quantity: any; customerId: any; addedby: any; sellingPrice: any; pluName: any; imagePath: any; }) {
    if (this.createdBy == 0) {
      window.location.href = '/SignIn/Goback'
    } else {
      this.app.pageLoader = true;
      this.prodid = val.id;
      this.itemid = val.itemId;
      this.itemName = val.pluName;
      this.displayImg = val.imagePath;
      this.ProductService.getProductDetail(this.itemid, this.createdBy).subscribe({
        next: (data) => {
          this.cartlist = data;
          this.isProductOutOfStock = (this.cartlist?.pricelist[0]?.stockQty === 0) ? true : false;
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
        }
      });
    }
  }
  /* CONTINUE PRODUCT */
  continueProduct() {
    this.Proddetails = { itemId: this.itemid, quantity: 1, price: this.selectedPrice, varient: this.selectedSize, createdby: this.createdBy, sellingPrice: this.selectedPrice };
    this.ProductService.addtoCart(this.Proddetails).subscribe({
      next: (data) => {
        this.app.openSnackBar('Item added to cart!');
        this.ProductService.getProductDetail(this.itemid, this.createdBy).subscribe({
          next: (data) => {
            this.cartlist = data;
          }, error: (err) => {
            // console.log(err);
            this.app.commonLoader = false;
            this.app.pageLoader = false;
          }, complete: () => {
            this.app.commonLoader = false;
            this.app.pageLoader = false;
          },
        });
      },
      error: (err) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        this.app.openSnackBar('Something went wrong. Please try again later');
      },
      complete: () => {
        this.GetAllProducts();
      },
    });
  }
  /* VARIANT CHANGES */
  varientChange(price: any, size: any, index: any, itemId: any, stockQty: any) {
    this.app.pageLoader = true;
    this.selectedPrice = price;
    this.selectedSize = size;
    this.varianceindex = index;
    this.productId = itemId;
    this.isProductOutOfStock = (stockQty === 0) ? true : false;
    this.app.pageLoader = false;
  }
  /* CLOSE VARIANT */
  closeVariant() {
    this.variantView = false;
    this.modalPatch = false;
  }
  // update price as per quantity
  UpdateQuantPrice(id: any, data: any) {
    data.createdby = this.createdBy;
    this.local.UpdateQuantPrice(id, data).subscribe({
      next: (d) => { },
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
  onInputUpdateqty(product: any, enteredQty: any) {
    this.str = enteredQty.value;
    if (this.str <= product.stockQty) {
      if (this.str != '' && this.str != '0') {
        this.price = this.str * product.sellingPrice;
        product.price = Number(this.price);
        product.quantity = Number(this.str);
        if (this.str == 0) {
          this.RemoveProdFromCart(product)
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
  /* HANDLE plus counter */
  handlePlus(product: any) {
    this.str = product.quantity;
    if (this.str < product.stockQty) {
      this.quantity = parseInt(this.str) + 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.UpdateQuantPrice(product.id, product);
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
    } else {
      this.app.openSnackBar('Order Limit Exceed');
    }
  }
  /* HANDLE MINUS */
  handleMinus(product: any) {
    this.str = product.quantity

    if (parseInt(this.str) != 1 && parseInt(this.str) != 0) {
      this.quantity = parseInt(this.str) - 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
    } else {
      this.RemoveProdFromCart(product);
    }
    this.UpdateQuantPrice(product.id, product);
  }
  //remove product from cart
  RemoveProdFromCart(data: any) {
    if (data.id != null) {
      this.app.pageLoader = true;
      this.local.RemoveProdFromCart(data.id, this.createdBy).subscribe({
        next: (d) => {
          this.ProductService.getProductDetail(data.itemId, this.createdBy).subscribe({
            next: (data) => {
              this.cartlist = data;
            }, error: (err) => {
              this.app.commonLoader = false;
            },
          })
          this.app.openSnackBar('Item Removed From Cart');
        },
        error: (err) => {
          this.app.pageLoader = false;
          //console.log(err);
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.GetAllProducts();
        },
      });
    }
  }
}
