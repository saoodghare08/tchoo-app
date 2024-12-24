import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CategoryService } from 'src/app/_services/category/category.service';
import { LocalService } from 'src/app/_services/local.service';
import { MaincategoryService } from 'src/app/_services/maincategory/maincategory.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { Sorting } from 'src/app/_common/DTOs/Sorting';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  maincatId: any = this.activatedRoute.snapshot.params['mncatId'];
  orderby: any = this.activatedRoute.snapshot.params['orderby'];
  sortId: any = this.activatedRoute.snapshot.params['sortId'];
  category: any = this.activatedRoute.snapshot.params['catId'];
  selectedlanguage: any = 'English';
  varianceindex: any = 0;

  str: any;
  price: any;
  variantView: any;
  fullname: any;
  prductFilerView: any;
  prductSortView: any;
  searchvalue: any;
  mainCatName: any;
  itemid: any;
  itemName: any;
  selectedPrice: any;
  selectedSize: any;
  prodId: any;
  displayImg: any;
  orderbyFinal: any;
  SortIdFinal: any;
  returnurl: any;
  productId: any;
  columnName: any;
  SortedData: any;

  quantity!: number;
  searchValue!: string;

  modalPatch: boolean = false;
  isProductOutOfStock: boolean = false;

  getItems: any = [];
  mycart: any = [];
  filterCategories: any = [];
  selectedCatIds: any = [];
  userdetails: any = [];
  cartlist: any = [];
  catIds: any = [];
  sortcat: any = [];
  navlink: any[] = [];

  Proddetails: any = {
    itemId: [''],
    sellingPrice: [''],
    quantity: [0],
    varient: [''],
    price: [''],
    createdby: [''],
  };
  sortCategory = [
    {
      name: 'Price (Low to high)',
      SortId: 0,
      orderby: 'asc',
      columnName: 'p.SellingPrice',
    },
    {
      name: 'Price (High to low)',
      SortId: 1,
      orderby: 'desc',
      columnName: 'p.SellingPrice',
    },
    {
      name: 'Newest first',
      SortId: 2,
      orderby: 'desc',
      columnName: 'CreatedOn',
    },
  ];
  /* CONSTRUCTION */
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryservices: CategoryService,
    public app: AppComponent,
    private local: LocalService,
    private service: MaincategoryService,
    private product_service: ProductService,
    private router: Router,
  ) {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.fullname = this.userdetails.fullName;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
      },
    });
  }
  ngOnInit() {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    this.SortedProducts();
  }
  SortedProducts() {
    this.catIds = this.selectedCatIds.length > 0 ? this.selectedCatIds : this.category.split(',');
    this.orderbyFinal = this.sortcat.orderby ? this.sortcat.orderby : this.orderby;
    this.SortIdFinal = this.sortcat.SortId ? this.sortcat.SortId : this.sortId;
    this.columnName = this.SortIdFinal == 2 ? 'CreatedOn' : 'p.SellingPrice';
    var data: Sorting = {
      orderby: this.orderbyFinal,
      columnName: this.columnName,
      maincatId: this.maincatId,
      sortId: this.SortIdFinal,
      catId: this.catIds,
      userId: this.createdBy,
    };
    this.service.sortcategory(data).subscribe({
      next: (data) => {
        this.getItems = [];
        this.getItems = data;
        console.log('getItems', this.getItems);

        this.mainCatName = this.getItems[0]?.subCategory;
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.prductFilerView = { display: 'none' };
        this.prductSortView = { display: 'none' };
        this.getCartItems();
      },
    });
  }
  /* GET ALL PRODUCTS */
  getCartItems() {
    this.local.getCartItems(this.createdBy).subscribe({
      next: (d) => {
        this.mycart = d;
      }, error: (e) => {
        // console.error(e);
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.Getfilter();
      },
    });
  }
  /* GET FILTERS */
  Getfilter() {
    this.categoryservices.getcategory(this.maincatId, this.createdBy).subscribe({
      next: (d: any) => {
        this.filterCategories = d;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  SortProducts() {
    this.app.pageLoader = true;
    this.SortedProducts();
  }
  /* BACK TO NAVIGATION */
  backNavigation(): void {
    if (this.navlink.length == 0 || (this.navlink.length == 1 && this.router.url == this.navlink[this.navlink.length - 1]?.url)) {
      window.location.href = '/Home/' + this.createdBy;
    } else if (this.router.url == this.navlink[this.navlink.length - 1]?.url) {
      this.navlink.splice(this.navlink.length - 1);
      sessionStorage.removeItem(this.navlink[this.navlink.length - 1].url);
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
      this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
      window.location.href = this.navlink[this.navlink.length - 1]?.url;
    } else {
      setTimeout(() => {
        this.navlink.splice(this.navlink.length - 1);
        sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
      }, 100);
      this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
      window.location.href = this.navlink[this.navlink.length - 2]?.url;
    }
  }
  /* ADDED WISH LIST */
  addedWishlist(item: any) {
    if (this.createdBy == 0 || null) {
      window.location.href = '/SignIn/Goback';
    } else {
      this.app.pageLoader = true;
      item.customerId = this.createdBy;
      this.categoryservices.addWishList(item).subscribe({
        next: (d: any) => {
          this.app.openSnackBar('Added to wishlist successfully');
        },
        error: (e: any) => {
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.commonLoader = false;
          this.app.pageLoader = false;
        },
        complete: () => {
          this.SortedProducts();
        },
      });
    }
  }
  /* REMOVE ADD WISH LIST*/
  removeWishlist(id: any) {
    this.app.pageLoader = true;
    this.categoryservices.removeWishlist(id).subscribe({
      next: (d: any) => {
        this.app.openSnackBar('Removed from wishlist successfully');
      },
      error: (e: any) => {
        this.app.openSnackBar('Something went wrong. Please try again later');
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
      complete: () => {
        this.SortedProducts();
      },
    });
  }
  // PRODUCT FILTER
  productFilter() {
    this.prductFilerView = { display: 'block' };
    this.Getfilter();
  }
  /* CLOSE MODAL */
  closemd() {
    this.prductFilerView = { display: 'none' };
    this.prductSortView = { display: 'none' };
    this.SortedProducts();
  }
  /* ADD CATEGORY ID */
  AddCatIds(catId: any) {
    var checked = this.filterCategories.find((a: any) => (a = catId));
    var isExist = this.selectedCatIds.find((c: string) => c == catId);
    if (checked != undefined || checked != null) {
      if (isExist == undefined || isExist == null || isExist.length == 0) {
        this.selectedCatIds.push(catId);
      }
    }
  }
  /* PRODUCT SORT */
  productSort() {
    this.SortedData = [];
    this.prductSortView = { display: 'block' };
  }
  /* SORT CATEGORY */
  setradio(e: number): void {
    this.sortcat = this.sortCategory[e];
  }
  /* SEARCH */
  search() {
    this.searchvalue = this.searchValue;
    window.location.href =
      '/search-list/' +
      this.createdBy +
      '/' +
      this.searchvalue +
      '/' +
      this.HubId;
  }
  /* CLOSE MD SORT */
  closemdsort() {
    this.prductFilerView = { display: 'none' };
    this.prductSortView = { display: 'none' };
    this.returnurl = 'Main-Category/SubCategory/ProductList/' + this.maincatId + '/' + this.createdBy + '/' + this.HubId + '/' + this.orderby + '/' + this.sortId + '/' + this.category
    window.location.href = this.returnurl;
  }
  /* PRODUCT DETAILS PAGE */
  producdetailspage(itemId: any) {
    if (this.catIds == '') {
      this.catIds = '0';
      window.location.href = '/Main-Category/SubCategory/Category/Products/' + itemId + '/' + this.maincatId + '/' + this.createdBy + '/' + this.HubId + '/' + this.orderbyFinal + '/' + this.SortIdFinal + '/' + this.catIds;
    } else {
      window.location.href = '/Main-Category/SubCategory/Category/Products/' + itemId + '/' + this.maincatId + '/' + this.createdBy + '/' + this.HubId + '/' + this.orderbyFinal + '/' + this.SortIdFinal + '/' + this.catIds;
    }
  }
  /* ADD TO CART */
  addToCart(val: { id: any; itemId: any; priceId: any; quantity: any; customerId: any; addedby: any; sellingPrice: any; pluName: any; imagePath: any; }) {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback';
    } else {
      this.app.pageLoader = true;
      this.varianceindex = 0;
      this.prodId = val.id;
      this.itemid = val.itemId;
      this.itemName = val.pluName;
      this.displayImg = val.imagePath;
      this.product_service.getProductDetail(this.itemid, this.createdBy).subscribe({
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
          // console.log(err);
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.pageLoader = false;
        },
      });
    }
  }
  /* CONTINUE PRODUCT */
  continueProduct() {
    if (this.createdBy == 0 || null) {
      window.location.href = '/SignIn/Goback';
    } else {
      this.Proddetails = {
        itemId: this.itemid,
        quantity: 1,
        price: this.selectedPrice,
        varient: this.selectedSize,
        createdby: this.createdBy,
        sellingPrice: this.selectedPrice,
      };
      this.product_service.addtoCart(this.Proddetails).subscribe({
        next: (data) => {
          this.app.openSnackBar('Item added to cart!');
        },
        error: (err) => {
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.pageLoader = false;
        }, complete: () => {
          this.SortedProducts();
          this.GetProductDetails();
        },
      });
    }
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
  /* CLOSE VARIANT MODAL */
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
      }
    })
  }
  Updatequantity(product: any, quantity: any) {
    this.str = quantity.value;
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
  /* HANDLE MINUS */
  handlePlus(product: any) {
    this.str = product.quantity;
    if (this.str != null) {
      this.quantity = parseInt(this.str) + 1;
      if (this.quantity <= product.stockQty) {
        this.price = this.quantity * product.sellingPrice;
        product.price = Number(this.price);
        product.quantity = this.quantity;
        this.UpdateQuantPrice(product.id, product);
        this.app.openSnackBar(`${product.prodName} quantity changed to ${this.quantity}`);
      } else {
        this.price = product.stockQty * product.sellingPrice;
        product.price = Number(this.price);
        product.quantity = product.stockQty;
        this.UpdateQuantPrice(product.id, product);
        (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
        this.app.openSnackBar(`Order Limits Exceed`);
      }
    } else {
      this.price = 1 * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = 1;
      this.UpdateQuantPrice(product.id, product);
      (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
    }
  }
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
  // get product details from cart
  GetProductDetails() {
    this.product_service.getProductDetail(this.itemid, this.createdBy).subscribe({
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
  // delete product from cart
  RemoveProdFromCart(id: any) {
    this.app.pageLoader = true;
    if (id != null) {
      this.local.RemoveProdFromCart(id, this.createdBy).subscribe({
        next: (d) => {
          this.app.openSnackBar('Item Removed From the Cart');
        }, error: (err) => {
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.pageLoader = false;
        }, complete: () => {
          this.SortedProducts();
          this.GetProductDetails();
        },
      });
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
}
