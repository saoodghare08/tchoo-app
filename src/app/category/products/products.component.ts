import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDTOs } from 'src/app/_common/DTOs/Order/ProductDTOs';
import { CategoryService } from 'src/app/_services/category/category.service';
import { LocalService } from 'src/app/_services/local.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { AppComponent } from 'src/app/app.component';
import { ItemDTO } from 'src/app/_common/DTOs/Category/ItemDTO';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  MNCTG: any = this.activatedRoute.snapshot.params['mncatId'];
  sortId: any = this.activatedRoute.snapshot.params['sortId'];
  orderby: any = this.activatedRoute.snapshot.params['orderby'];
  catIds: any = this.activatedRoute.snapshot.params['catId'];
  itemid: any = this.activatedRoute.snapshot.params['id'];

  selectedlanguage: any = 'English';
  showTxt: any = 'Show More';
  varianceindex: any = 0;
  qty: any = 1;
  last_index: any = 100;
  counter: any = 100;
  firstCount: any = 100;

  displayImg: any;
  cartId: any;
  addtocart: any;
  gotocart: any;
  returnurl: any;
  proddescleng: any;
  ishubMap: any;
  addid: any;
  str: any;
  cartqty: any;
  changePrice: any;
  selectedPrice: any;
  selectedSize: any;
  selectedVariantName: any;
  selectedStockQty: any;
  pdfPreview:any
  cartlist: any = [];
  userdetails: any = [];
  getItems: ItemDTO[] = [];
  defaultadd: any = [];
  addlist: any = [];
  ItemInCart: any = [];
  cart: any = [];
  imgArray: any = [];
  variantImages: any = [];
  mycart: any = [];
  navlink:any[]=[];

  isProductOutOfStock: boolean = false;
  product: ProductDTOs = {
    id: 0,
    img: '',
    itemId: '',
    productName: '',
    description: '',
    pluName: '',
    price: '',
    createby: '',
    quantity: 0,
    pattern: '',
    isAdded: '',
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
  categorySlide = {
    infinite: true,
    autoplay: false,
    centerMode: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    swipe: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  relatedItems = {
    dots: false,
    infinite: true,
    arrows: false,
    slidesToShow: 8,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  productdetails = this.fb.group({
    varient: [''],
    quantity: [''],
    itemId: [''],
    price: [0],
    sellingPrice: [''],
    createdby: [''],
  });
  constructor(
    private fb: FormBuilder,
    private categoryservices: CategoryService,
    private product_service: ProductService,
    private router: Router,
    private local: LocalService,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,

  ) { }
  ngOnInit() {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    if (this.createdBy !== '0') {
      this.getuserdetails();
    } else {
      this.getProductDetail();
    }

  }
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.postRecenltyviewItems();
      },
    });
  }
  // post recently viewed products
  postRecenltyviewItems() {
    this.product_service.addViewItems(this.createdBy, this.itemid).subscribe({
      next: (data) => { },
      error: (err) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
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
        this.local.cartCountBool$.subscribe((value: any) => {
          if (value.length != undefined || value) {
            this.cartqty = value;
          }
        });
        for (let i = 0; i < this.mycart.length; i++) {
          if (this.mycart[i].itemId == this.itemid) {
            this.ItemInCart.push(this.mycart[i]);
          }
          this.changePrice = this.ItemInCart[0]?.price
          this.qty = this.ItemInCart[0]?.quantity
        }
        this.cartqty = this.mycart.length;
      },
      error: (e) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        // console.error(e);
      }, complete: () => {
        this.getProductDetail();
      }
    });
  }
  // add to cart and go to cart button logic
  itemadded() {
    let i = 0;
    let j = 0;
    for (j = 0; j < this.cartlist.length; j++);
    for (i = 0; i < this.cartqty; i++) {
      if (this.cartlist.product[j].itemId === this.cartqty[i].itemId) {
        this.addtocart = { display: 'none' };
        this.gotocart = { display: 'block' };
        continue;
      }
    }
    this.getProductDetail();
  }
displayImagArray:any=[]
  // get product details by id
  getProductDetail() {
    this.product_service.getProductDetail(this.itemid, this.createdBy).subscribe({
      next: (data) => {
        this.cartlist = data;
        console.log(data);
        this.product = this.cartlist.product;
        this.pdfPreview=this.product.iFrame;
        console.log(this.product);
        this.proddescleng = this.product.description?.length;
        this.isProductOutOfStock = (this.cartlist?.pricelist[0]?.stockQty === 0) ? true : false;
        this.selectedStockQty = this.cartlist?.pricelist[0]?.stockQty;
        this.selectedPrice = this.cartlist?.pricelist[0]?.sellingPrice;
        this.selectedSize = this.cartlist?.pricelist[0]?.priceId;
        this.selectedVariantName = this.cartlist?.pricelist[0]?.size;
        this.ishubMap = this.cartlist?.pricelist[0]?.ishubMap;
        if (this.ishubMap == "true" && this.ItemInCart != null) {
          this.changePrice = this.ItemInCart[0]?.price;
          this.qty = this.ItemInCart[0]?.quantity;
        } else {
          this.qty = 1;
        }
      }, error: (err) => {
        this.app.pageLoader = false;
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.categoryservices.getcategorybyId(this.MNCTG, this.createdBy,this.itemid).subscribe({
          next: (response: any) => {
            this.getItems = response;
          }, error: (err) => {
            this.app.pageLoader = false;
            this.app.commonLoader = false;
            // console.log(err);
          }, complete: () => {
            this.app.pageLoader = false;
            this.app.commonLoader = false;
          },
        });
        this.imgArray = []
        for (let i = 0; i < this.product.imagesCount; i++) {
          const imgPath = `https://automatebuddy.oss-ap-southeast-3.aliyuncs.com/VilliyantGroup/Product-image/${this.product.itemId}_${i}.png`
          this.imgArray.push(imgPath);
        }
        this.getImagesToDisplay(null)

        this.app.pageLoader = false;
        this.app.commonLoader = false;
      },
    });
  }
  getImagesToDisplay(priceId:any) {
    this.displayImagArray=[]
    if(priceId){
      this.displayImagArray=this.imgArray.concat(this.variantImages)
    }else{
      this.displayImagArray=this.imgArray;
    }
    console.log(this.displayImagArray);

    // return this.variantImages[this.selectedSize]?.concat(this.imgArray) || this.imgArray;
  }
  // change variant
  varientChange(sellingprice: any, priceId: any, img: any, index: any, ishubMap: any, price: any, qty: any, stockQty: any, size: any, calledFrom: any,displayWithImg:any,imageCount:any) {
    this.app.pageLoader = true;
     this.variantImages = []
    if (ishubMap != "false") {
      let r: any = this.ItemInCart.find((a: any) => a.pattern == priceId);
      this.selectedPrice = sellingprice;
      this.qty = r.pattern == priceId && calledFrom == 2 ? qty : r.pattern == priceId && calledFrom == 1 ? r.quantity : qty;
      if(displayWithImg){
        for (let i = 0; i < imageCount; i++) {
          const imgPath = `https://automatebuddy.oss-ap-southeast-3.aliyuncs.com/VilliyantGroup/Product-image/${priceId}_${i}.png`
          this.variantImages.push(imgPath);
        }
        this.getImagesToDisplay(priceId)
    }

      this.varianceindex = index;
      this.ishubMap = ishubMap;
      this.selectedSize = r.pattern;
      this.selectedVariantName = size;
      this.selectedStockQty = stockQty;
      this.changePrice = r.pattern == priceId && calledFrom == 2 ? price : r.pattern == priceId && calledFrom == 1 ? r.price : price;
      this.isProductOutOfStock = (stockQty === 0) ? true : false;
    }
    else {
      this.selectedPrice = sellingprice;
      this.selectedSize = priceId;
      if(displayWithImg){
        for (let i = 0; i < imageCount; i++) {
          const imgPath = `https://automatebuddy.oss-ap-southeast-3.aliyuncs.com/VilliyantGroup/Product-image/${priceId}_${i}.png`
          this.variantImages.push(imgPath);
        }
      }
        this.getImagesToDisplay(priceId)
      this.varianceindex = index;
      this.ishubMap = ishubMap;
      this.qty = qty;
      this.changePrice = price;
      this.selectedVariantName = size;
      this.selectedStockQty = stockQty;
      this.isProductOutOfStock = (stockQty === 0) ? true : false;
    }
    this.app.pageLoader = false;

  }
  backNavigation() {
    if (this.navlink.length == 0 || (this.navlink.length == 1 && this.router.url == this.navlink[this.navlink.length-1]?.url)) {
      window.location.href='/Home/' + this.createdBy;
    } else if(this.router.url == this.navlink[this.navlink.length - 1]?.url){
      this.navlink.splice(this.navlink.length-1);
      sessionStorage.removeItem(this.navlink[this.navlink.length-1].url);
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
      this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
      if(this.navlink[this.navlink.length - 1]?.url.split('/')[1]=="search-list"){
        this.router.navigate(['/search-list/' + this.createdBy + '/' + this.navlink[this.navlink.length - 1]?.url.split('/')[3]+ '/' + this.HubId]);
      }else{
        window.location.href=this.navlink[this.navlink.length - 1]?.url;
      }
    }else{
      setTimeout(() => {
        this.navlink.splice(this.navlink.length-1);
        sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
       }, 100);
        this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
        window.location.href=encodeURIComponent(this.navlink[this.navlink.length-2]?.url);
    }
  }

  // show less nad show more for product description
  toggleSkil(e: any) {
    if (this.counter < 101) {
      this.counter = this.product.description.length;
      this.showTxt = 'Show less';
    } else {
      this.counter = this.last_index;
      this.showTxt = 'Show More';
    }
  }
  // seee all recent viewed products
  getALLRecenltyviewItems() {
    window.location.href='/recentview/' + this.createdBy;
  }

  // add to cart
  addToCart() {
    if (this.createdBy == '0') {
      this.returnurl = '/SignIn/Goback'
      window.location.href = this.returnurl;
    }
    else {
      var quantity: any = (document.getElementById('qty') as HTMLInputElement).value;
      this.productdetails.value.quantity = quantity;
      if (this.productdetails.value.quantity != '0' && this.productdetails.value.quantity != '') {
        this.app.pageLoader = true;
        this.productdetails.value.itemId = this.activatedRoute.snapshot.params['id'];
        this.productdetails.value.createdby = this.activatedRoute.snapshot.params['userId'];
        this.productdetails.value.price = this.selectedPrice * quantity;
        this.productdetails.value.varient = this.selectedSize;
        this.productdetails.value.sellingPrice = this.selectedPrice;
        this.product_service.addtoCart(this.productdetails.value).subscribe({
          next: (data) => {
            this.cart = data;
            this.app.openSnackBar('Item Added in the Cart');
          },
          error: (err) => {
            this.app.openSnackBar('Something went wrong. Please try again later');
            this.app.pageLoader = false;
          }, complete: () => {
            this.getCartItems();
          },
        });
      }
    }
  }

  // buy now the particular select product or variant
  BuyNow() {
    debugger
    if (this.createdBy == '0') {
      this.returnurl = '/SignIn/Goback'
      window.location.href = this.returnurl;
    } else {
      var quantity: any = (document.getElementById('qty') as HTMLInputElement).value;
      this.productdetails.value.quantity = quantity;
      if (this.productdetails.value.quantity != '0' && this.productdetails.value.quantity != '') {
        this.app.commonLoader = true;
        this.productdetails.value.itemId = this.activatedRoute.snapshot.params['id'];
        this.productdetails.value.createdby = this.activatedRoute.snapshot.params['userId'];
        this.productdetails.value.price = this.selectedPrice * Number(quantity);
        this.productdetails.value.varient = this.selectedSize;
        this.productdetails.value.sellingPrice = this.selectedPrice;
        this.product_service.addtoCart(this.productdetails.value).subscribe({
          next: (data) => {
            debugger
            this.cart = data;
            this.cartId = this.cart[0].id;
            if (this.addlist.length === 0) {
              window.location.href = '/Order/CustomerInfo/' + this.createdBy + '/' + this.cartId + '/' + this.HubId
            } else {
              this.defaultadd = this.addlist.find((a: any) => a.type === 'Default');
              this.addid = this.defaultadd.addId;
              window.location.href = '/Order/ShippingMethod/' + this.createdBy + '/' + this.cartId + '/' + this.addid + '/' + this.HubId
            }
          }, error: (err) => {
            // console.log(err);
            this.app.openSnackBar('Something went wrong. Please try again later');
            this.app.commonLoader = false;
          }
        });
      }
    }
  }

  // qty plus counter
  plus(product: any) {
    this.qty = (<HTMLInputElement>document.getElementById('qty')).value;
    if (this.qty < product.stockQty) {
      if (this.qty != '') {
        if (parseInt(this.qty) != 1000) {
          this.str = parseInt(this.qty) + 1;
          this.changePrice = this.str * this.selectedPrice;
          (document.getElementById('qty') as HTMLInputElement).value = this.str;
          this.qty = this.str;
        }
        this.varientChange(
          this.selectedPrice,
          this.selectedSize,
          this.displayImg,
          this.varianceindex,
          this.ishubMap,
          this.changePrice,
          this.qty,
          product.stockQty,
          this.selectedVariantName,
          2,
          product.displayWithImg,
          product.imageCount
        );
      } else {
        this.str = 1;
        this.changePrice = this.str * this.selectedPrice;
        (document.getElementById('qty') as HTMLInputElement).value = this.str;
        this.qty = this.str;
        this.varientChange(
          this.selectedPrice,
          this.selectedSize,
          this.displayImg,
          this.varianceindex,
          this.ishubMap,
          this.changePrice,
          this.qty,
          product.stockQty,
          this.selectedVariantName,
          2,
          product.displayWithImg,
          product.imageCount
        );
      }
    } else {
      this.app.openSnackBar('Order Limit Exceed');
    }
  }

  onInputUpdateqty(enteredQty: any, product: any) {
    this.qty = enteredQty.value;
    if (this.qty <= product.stockQty) {
      if (this.qty != '' && this.qty != '0') {
        if (parseInt(this.qty) != 1000) {
          this.str = parseInt(this.qty);
          this.changePrice = this.str * this.selectedPrice;
          (document.getElementById('qty') as HTMLInputElement).value = this.str;
          this.qty = this.str;
        }
        this.varientChange(
          this.selectedPrice,
          this.selectedSize,
          this.displayImg,
          this.varianceindex,
          this.ishubMap,
          this.changePrice,
          this.qty,
          product.stockQty,
          this.selectedVariantName,
          2,
          product.displayWithImg,
          product.imageCount
        );
      } else {
        this.varientChange(
          this.selectedPrice,
          this.selectedSize,
          this.displayImg,
          this.varianceindex,
          this.ishubMap,
          this.selectedPrice,
          1,
          product.stockQty,
          this.selectedVariantName,
          2,
          product.displayWithImg,
          product.imageCount
        );
      }
    } else {
      this.qty = product.stockQty;
      if (parseInt(this.qty) != 1000) {
        this.str = parseInt(this.qty);
        this.changePrice = this.str * this.selectedPrice;
        (document.getElementById('qty') as HTMLInputElement).value = this.str;
        this.qty = this.str;
      }
      this.varientChange(
        this.selectedPrice,
        this.selectedSize,
        this.displayImg,
        this.varianceindex,
        this.ishubMap,
        this.changePrice,
        this.qty,
        product.stockQty,
        this.selectedVariantName,
        2,
        product.displayWithImg,
        product.imageCount
      );
      this.app.openSnackBar('Order Limit Exceed');
    }
  }

  //QTY MINUS counter
  minus(product: any) {
    this.qty = (document.getElementById('qty') as HTMLInputElement).value;
    if (parseInt(this.qty) != 1 && parseInt(this.qty) != 0 && this.qty != '') {
      this.str = parseInt(this.qty) - 1;
      this.changePrice = this.str * this.selectedPrice;
      (document.getElementById('qty') as HTMLInputElement).value = this.str;
      this.qty = this.str;
      this.varientChange(
        this.selectedPrice,
        this.selectedSize,
        this.displayImg,
        this.varianceindex,
        this.ishubMap,
        this.changePrice,
        this.qty,
        product.stockQty,
        this.selectedVariantName,
        2,
        product.displayWithImg,
        product.imageCount
      );
    } else {
      this.varientChange(
        this.selectedPrice,
        this.selectedSize,
        this.displayImg,
        this.varianceindex,
        this.ishubMap,
        this.selectedPrice,
        1,
        product.stockQty,
        this.selectedVariantName,
        2,
        product.displayWithImg,
        product.imageCount
      );
    }
  }

  //add to wishlist
  addedWishlist(item: any) {
    if (this.createdBy == '0') {
      this.returnurl = '/SignIn/Goback'
      window.location.href = this.returnurl;
    } else {
      this.app.pageLoader = true;
      item.customerId = this.createdBy;
      item.priceId = this.cartlist?.pricelist[0].priceId;
      this.categoryservices.addWishList(item).subscribe({
        next: (d: any) => {
          this.app.openSnackBar('Added to wishlist successfully');
        },
        error: (e: any) => {
          this.app.openSnackBar('Something went wrong. Please try again later');
          this.app.pageLoader = false;
        },
        complete: () => {
          this.getCartItems();
        },
      });
    }
  }

  // remove from wishlist
  removeWishlist(id: any) {
    this.app.pageLoader = true;
    this.categoryservices.removeWishlist(id).subscribe({
      next: (d: any) => {
        this.app.openSnackBar('Removed from wishlist successfully');
      },
      error: (e: any) => {
        this.app.openSnackBar('Something went wrong. Please try again later');
        this.app.pageLoader = false;
      },
      complete: () => {
        this.getCartItems();
      },
    });
  }

  // AAMIR 14-03-2024
  zoomImageModal: boolean = false;
  displayMainImg:any;
  fullCategorySlide = {
    infinite: true,
    autoplay: true,
    centerMode: false,
    slidesToShow: 1,
    dots: false,
    arrows: false,
    swipe: false,
    autoplaySpeed: 10000,
    swipeToSlide: false,
  };
  openZoomImageMd(imgLink:any) {
      this.zoomImageModal = true;
      this.displayMainImg = imgLink;
      //console.log(this.displayMainImg);
  }

  closeZoomImageModal() {
    this.zoomImageModal = false;
  }

  zoomProperties = {
    'double-tap': true, // double tap to zoom in and out.
    overflow: 'hidden', // Am not sure. But Documentation says, it will not render elements outside the container.
    wheel: false, // Disables mouse - To enable scrolling. Else mouse scrolling will be used to zoom in and out on web.
    disableZoomControl: 'disable', // stops showing zoom + and zoom - images.
    backgroundColor: 'rgba(0,0,0,0)' // Makes the pinch zoom container color to transparent. So that ionic themes can be applied without issues.
  };

}
