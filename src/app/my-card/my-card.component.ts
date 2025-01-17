import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CategoryService } from '../_services/category/category.service';
import { LocalService } from '../_services/local.service';
import { ProductService } from '../_services/product/product.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.scss', './place-rder-animation.scss']
})
export class MyCardComponent {
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  selectedlanguage: any = 'English';

  subTotal!: any;
  defaultzipcode: any;
  mycart: any;
  str: any;
  price: any;
  getViewedProducts: any;
  TaxPercent: any;
  userdetails: any;
  selectedProd: any;
  products: any;
  Hub: any;
  DeliveryCharge: any;
  quantity!: number;

  addlist: any = [];
  defaultadd: any = [];
  Tax: any = [];
  hubaddress: any = [];
  navlink:any[]=[];

  removeconformationModal: boolean = false;
  modalPatch: boolean = false;
  active: boolean = false;
  paddingClss: boolean = false;
  constructor(
    private product_service: ProductService,
    private router: Router,
    private local: LocalService,
    private activatedRoute: ActivatedRoute,
    public app: AppComponent,
    private categoryservices: CategoryService,
    private location: Location
  ) {}
  ngOnInit() {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined ) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    if (this.createdby == 0) {
      window.location.href = '/SignIn/Goback'
    } else {
      this.getuserdetails();
    }
  }
  get TotalPrice() {
    var itemarr = this.mycart;
    var result = itemarr?.map((a: { price: number }) => a.price),
      numbers = result?.map(Number);
    const sum = numbers?.reduce((a: number, b: number) => {
      return a + b;
    }, 0);
    return (this.subTotal = Number(sum));
  }
  // Get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdby).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getAddressList();
      },
    });
  }
  // get addresslist by user Id
  getAddressList() {
    this.local.getAddress(this.createdby).subscribe({
      next: (data) => {
        this.addlist = data;
        this.defaultadd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzipcode = this.defaultadd?.zipCode;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getHub();
      },
    });
  }
  // get hub details
  getHub() {
    this.local.getHub(this.defaultzipcode).subscribe({
      next: (data) => {
        this.Hub = data;
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.HubId = this.Hub.hubId;
        }
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getRecenltyviewItems();
      },
    });
  }
  // get RecenltyviewItems list
  getRecenltyviewItems() {
    this.product_service.getRecenltyviewItems(this.createdby, 'Top_5').subscribe({
      next: (data) => {
        this.getViewedProducts = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getCartItems();
      },
    });
  }
  //get product list of cart
  getCartItems() {
    this.local.getCartItems(this.createdby).subscribe({
      next: (data) => {
        this.mycart = data;
        var itemarr = this.mycart;
        var result = itemarr?.map((a: { price: number }) => a.price),
          numbers = result?.map(Number);
        const sum = numbers?.reduce((a: number, b: number) => {
          return a + b;
        }, 0);
        this.subTotal = Number(sum);
        setTimeout(() => {
          for (var i = 0; i < this.mycart?.length; i++) {
            if (this.mycart[i].stockQty != 0) {
              (document.getElementById(this.mycart[i].id + '_productId') as HTMLInputElement).value = this.mycart[i].quantity;
              (document.getElementById(this.mycart[i].id + '_priceid') as HTMLInputElement).value = this.mycart[i].price;
            } else {
              this.mycart[i].price = 0;
              this.mycart[i].quantity = 0;
            }
          }
        }, 100);
      }, error: (e) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        // console.error(e);
      }, complete: () => {
        this.getVatTaxValue();
      },
    });
  }
  // get taxable amount
  getVatTaxValue() {
    if (this.defaultzipcode == undefined) {
      this.defaultzipcode = '400614';
    }
    this.local.getTaxValue(this.HubId, 'Tax', 'REB02', this.defaultzipcode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe({
      next: (tax) => {
        this.Tax = tax;
        this.TaxPercent = (this.TotalPrice * this.Tax?.vatTaxpercent) / 100;
        this.DeliveryCharge = (this.TotalPrice) > 165 ? 0 : 32;
      }, error: (err) => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
        // console.error(err);
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  backNavigation(): void {
    if (this.navlink.length == 0 || (this.navlink.length == 1 && this.router.url == this.navlink[this.navlink.length-1]?.url)) {
      window.location.href='/Home/' + this.createdby;
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
  /* HANDLE plus counter */
  plus(product: any) {
    this.str = product.quantity;
    if (this.str < product.stockQty) {
      this.quantity = parseInt(this.str) + 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
      (document.getElementById(product.id + '_priceid') as HTMLInputElement).value = product.price;
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
      this.UpdateQuantPrice(product.id, product);
    } else {
      this.app.openSnackBar('Order Limit Exceed');
    }
  }
  /* HANDLE minus counter */
  minus(product: any) {
    this.str = product.quantity;
    if (parseInt(this.str) != 1 && parseInt(this.str) != 0) {
      this.quantity = parseInt(this.str) - 1;
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
      (document.getElementById(product.id + '_priceid') as HTMLInputElement).value = product.price;
      this.UpdateQuantPrice(product.id, product);
      this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
    } else {
      this.openRemoveModal(product)
    }
  }
  onInputUpdateqty(product: any, enteredQty: any) {
    this.str = enteredQty.value;
    if (this.str <= product.stockQty) {
      if (this.str != '' && this.str != '0') {
        this.quantity = parseInt(this.str);
        this.price = this.quantity * product.sellingPrice;
        product.price = Number(this.price);
        product.quantity = this.quantity;
        if (this.str == 0) {
          this.RemoveProdFromCart(product.id, 1);
        } else {
          (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
          (document.getElementById(product.id + '_priceid') as HTMLInputElement).value = product.price;
          this.UpdateQuantPrice(product.id, product);
          this.app.openSnackBar(`${product.prodName} quantity changed to ${product.quantity}`);
        }
      }
    } else {
      this.quantity = parseInt(product.stockQty);
      this.price = this.quantity * product.sellingPrice;
      product.price = Number(this.price);
      product.quantity = this.quantity;
      this.UpdateQuantPrice(product.id, product);
      (document.getElementById(product.id + '_productId') as HTMLInputElement).value = product.quantity;
      (document.getElementById(product.id + '_priceid') as HTMLInputElement).value = product.price;
      this.app.openSnackBar('Order Limit Exceed');
    }
  }
  // open delete item from cart modal
  openRemoveModal(product: any) {
    this.removeconformationModal = true;
    this.modalPatch = true;
    this.products = product
    this.selectedProd = product.id;
  }
  // delete item from cart
  RemoveProdFromCart(id: any, fromwhere: any) {
    if (id != null) {
      this.app.pageLoader = true;
      this.local.RemoveProdFromCart(id, this.createdby).subscribe({
        next: (d) => {
          this.removeconformationModal = false;
          this.modalPatch = false;
          if (fromwhere == 1) {
            this.app.openSnackBar('Item Removed From the Cart');
          } else {
            this.app.openSnackBar('Removed from cart and added to Favourites successfully');
          }
        },
        error: (err) => {
          this.app.pageLoader = false;
          //console.log(err);
          this.app.openSnackBar('Something went wrong. Please try again later');
        },
        complete: () => {
          this.getCartItems();
        }
      });
    }
  }
  // close delete item from cart modal
  closeModal() {
    this.removeconformationModal = false;
    this.modalPatch = false;
  }
  // update price as per quantity
  UpdateQuantPrice(id: any, data: any) {
    data.createdby = this.createdby;
    this.local.UpdateQuantPrice(id, data).subscribe({
      next: (d) => {
        this.getVatTaxValue();
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
  // buy this product now
  BuyNow(data: any) {
    data.createby = this.createdby;
    window.location.href='/Order/CustomerInfo/' + this.createdby + '/' + data.id + '/' + this.HubId;
  }
  // placeorder
  isAnimating: boolean = false;
  //createdby: string = '123'; // Example value, replace with actual dynamic value
  //HubId: string = '456';    // Example value, replace with actual dynamic value

  Placeorderlocal(): void {
    if (!this.isAnimating) {
      this.isAnimating = true;

      // Reset animation state after 10 seconds
      setTimeout(() => {
        this.isAnimating = false;

        // Redirect after animation completes
        //window.location.href = `/Order/CustomerInfo/${this.createdby}/0/${this.HubId}`;
      }, 7500);
    }
  }



  // add to wishlist
  addedWishlist(data: any) {
    this.app.pageLoader = true;
    data.customerId = this.createdby;
    this.categoryservices.addWishList(data).subscribe({
      next: () => {
        this.RemoveProdFromCart(data.id, 0);
      },
      error: (err) => {
        this.app.pageLoader = false;
        // console.error(err);
      }, complete: () => {
        this.app.pageLoader = false;
      },
    });
  }
  priceDetails() {
    this.active = !this.active;
    this.paddingClss = !this.paddingClss;
  }
}
// get shipping charges
// getShippingCharges() {
//   if (this.defaultzipcode == undefined) {
//     this.defaultzipcode = '400614';
//   }
//   this.local.getTaxValue(this.hubId, 'HubZipcode', 'REB02', this.defaultzipcode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe((shipValue) => { });
// }
// get discounted value
// getDiscountValue() {
//   if (this.defaultzipcode == undefined) {
//     this.defaultzipcode = '400614';
//   }
//   this.local.getTaxValue(this.hubId, 'Discount', 'REB02', this.defaultzipcode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe((discount) => { });
// }