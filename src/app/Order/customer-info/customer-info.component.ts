import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressDTOs } from 'src/app/_common/DTOs/Order/AddressDTOs';
import { LocalService } from 'src/app/_services/local.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { AppComponent } from 'src/app/app.component';
import { MyCartDTOs } from 'src/app/_common/DTOs/Order/MyCartDTOs';
import { OrderService } from 'src/app/_services/orders/order.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})

export class CustomerInfoComponent implements OnInit {
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  cartId: any = this.activatedRoute.snapshot.params['cartId'];

  selectedlanguage: any = "English";
  Totalqty: number = 0;
  Totalamount: number = 0;
  productTotal: any = 0;
  taxAmount: number = 0;
  deliveryCharge: any = 0;
  grandTotalAmount: any = 0;
  discount: any = 0;

  changePasswordMD: any;
  selectedAdd: any;
  TaxPercent: any;
  firstName: any;
  lastName: any;
  grandTotal: any;
  returnbody: any;
  descdata: any;
  OrderId: any;
  Coupon: any;
  Discount: any;
  selectedCouponId: any;
  DiscountPercent: any;
  
  filteredArray: any = []
  addlist: any = [];
  Hub: any = [];
  selectedAddById: any = [];
  userdetails: any = [];
  mycart: MyCartDTOs[] = [];
  Tax: any = [];
  defaultadd: any = [];
  addId: any = [];
  hubaddress: any = [];
  shippingCharges: any = [];
  CouponArr: any = [];
  navlink:any[]=[];

  active: boolean = false;
  arrowactive: boolean = false;
  addNewAddress: boolean = false;
  changeAddressopen: boolean = false;
  modalPatch: boolean = false;
  choosePayment: boolean = false;
  appycouponModal: boolean = false;

  coupon_Code = this.fb.group({
    coupon_Code: ['']
  })
  sAddress: AddressDTOs = {
    firstName: '',
    lastName: '',
    email: '',
    locality: '',
    state: '',
    city: '',
    zipcode: '',
    type: ''
  }
  add_address = this.fb.group({
    id: [0],
    addId: [''],
    customerId: [''],
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    contact: ['', Validators.required],
    alternativeContact: [''],
    country: ['0', Validators.required],
    landmark: [''],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
    buildingName: [''],
    roomNo: [''],
    sector: [''],
    locality: ['', Validators.required],
    createdBy: [''],
    lastUpdatedBy: [''],
    type: [''],
    addressType: ['', Validators.required],
    hub: [''],
  });
  constructor(
    private fb: FormBuilder,
    private localService: LocalService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    private product_service: ProductService,
    private deviceService: DeviceDetectorService
  ) { }
  get device(): any {
    return this.deviceService.getDeviceInfo();
  }
  ngOnInit(): void {
    this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]'); // Parse as an array or initialize with an empty array if null
    if (this.navlink[this.navlink.length - 1]?.url !== this.router.url || this.navlink[this.navlink.length - 1]?.url == undefined) {
      this.navlink.push({ url: this.router.url });
      sessionStorage.setItem("navlinkParam", JSON.stringify(this.navlink));
    }
    this.getuserdetails();
    this.getAddressList();
    this.getCartItemById();
  }
  // get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdby).subscribe({
      next: (data: any) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  // get address
  getAddressList() {
    this.app.commonLoader = true;
    this.localService.getAddress(this.createdby).subscribe({
      next: (data) => {
        this.addlist = data;
        if (this.selectedAddById != 0) {
          this.sAddress.city = this.selectedAddById.city;
          this.sAddress.email = this.selectedAddById.email
          this.sAddress.firstName = this.selectedAddById.firstName
          this.sAddress.lastName =this.selectedAddById.lastName
          this.sAddress.locality =this.selectedAddById.locality
          this.sAddress.state =this.selectedAddById.state
          this.sAddress.type =(this.selectedAddById.type == null) ? 'O' : this.selectedAddById.type
          this.sAddress.zipcode = this.selectedAddById.zipCode
        } else if (this.addlist.find((a: any) => a.type === 'Default')) {
          this.sAddress = this.addlist.find((a: any) => a.type === 'Default')
          this.defaultadd = this.sAddress
        }
        else {
          this.addlist = data;
        }
      },
      error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      },
      complete: () => {
        this.getHub();
      },
    });
  }
  // get hub details
  getHub() {
    this.hubaddress = this.sAddress
    this.localService.getHub(this.hubaddress.zipCode).subscribe({
      next: (data: any) => {
        this.Hub = data;
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.HubId = this.Hub.hubId;
        }
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.getVatTaxValue();
        this.getCouponlist();
      }
    });
  }
  // get taxable amount
  getVatTaxValue() {
    this.addId = this.selectedAdd ? this.selectedAdd : this.defaultadd.addId
    this.localService.getTaxValue(this.HubId, 'Tax', 'REB02', this.addId, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe({
      next: (resp: any) => {
        this.Tax = resp
        this.TaxPercent = (this.Totalamount * (this.Tax?.vatTaxpercent) / 100)
      }, error: (err) => {
        this.app.commonLoader = false;
      },
      complete: () => {
        this.calculateAmount();
      },
    })
  }
  // get  cart details
  getCartItemById() {
    this.app.commonLoader = true;
    if (this.cartId == 0 || null) {
      this.localService.getCartItems(this.createdby).subscribe({
        next: (data: any) => {
          this.mycart = data;
          var itemarr = this.mycart;
          for (let index = 0; index < itemarr?.length; index++) {
            if (itemarr[index].stockQty != 0) {
              this.Totalamount += itemarr[index].quantity * Number(itemarr[index].sellingPrice)
            }
          }
          this.Totalqty = this.mycart?.length;
        }, error: (err) => {
          this.app.commonLoader = false;
          // console.log(err);
        }, complete: () => {
          this.calculateAmount();
        }
      });
    }
    else {
      // get cart item by Id
      this.product_service.getitemdetails(this.cartId, this.createdby).subscribe({
        next: (data: any) => {
          this.mycart = data;
          var itemarr = this.mycart;
          for (let index = 0; index < itemarr?.length; index++) {
            if (itemarr[index].stockQty != 0) {
              this.Totalamount += itemarr[index].quantity * Number(itemarr[index].sellingPrice)
            }
          }
          this.Totalqty = this.mycart?.length;
        }, error: (err) => {
          this.app.commonLoader = false;
          // console.log(err);
        }, complete: () => {
          this.calculateAmount();
        }
      });
    }
  }
  getCouponlist() {
    this.app.commonLoader = true;
    this.orderService.getCouponlist(this.createdby, this.HubId).subscribe({
      next: (data) => {
        this.CouponArr = data;
        this.descdata = this.CouponArr[0]?.shortDescription?.split('end');
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
      },
    })
  }
  calculateAmount() {
    this.productTotal = this.Totalamount;
    this.taxAmount = ((Number(this.Tax?.vatTaxpercent) * Number(this.Totalamount)) / 100);
    this.deliveryCharge = (this.Totalamount > 165 ? 0 : 32);
    this.grandTotalAmount = Math.round(this.productTotal + this.deliveryCharge) - (this.Discount != undefined ? (this.productTotal > this.Discount?.minOrderValue ? this.discount : 0) : this.discount);
    this.app.commonLoader = false;
  }
  // continue to shipping
  Step1() {
    this.app.commonLoader = true;
    const mydata = {
      "userId": this.createdby,
      "cartId": this.cartId,
      "coupenId": this.selectedCouponId ? this.selectedCouponId : 0,
      "addId": this.selectedAdd ? this.selectedAdd : this.defaultadd.addId,
      "hubId": this.HubId,
      "deliveryCharge": "" + this.deliveryCharge,
      "paymentResponse": "-",
      "paymentMethod": "-",
      "paymentStatus": "-",
      "orderId": "-",
      "transactionId": "-"
    }
    this.orderService.createOrder(mydata).subscribe({
      next: (data) => {
        this.OrderId = data
        this.choosePayment = true;
        this.modalPatch = true;
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
        this.app.openSnackBar('Something went wrong. Please try again later');
      }, complete: () => {
        this.app.commonLoader = false;
      }
    })
  }
  payment(method: any) {
    this.app.commonLoader = true;
    if (this.addlist != 0) {
      this.addId = this.selectedAdd ? this.selectedAdd : this.defaultadd.addId
      window.location.href = '/Order/PlaceOrder/' + this.createdby + '/' + this.cartId + '/' + this.addId + '/SO-' + this.OrderId.retVal + '/' + this.HubId + '/' + this.deliveryCharge + '/' + (this.selectedCouponId ? this.selectedCouponId : 0) + '/' + method;
    }
    else {
      this.app.openSnackBar('Add Address');
    }
    this.app.commonLoader = false;
  }
  // select address pop up open
  showSelectAddressMd() {
    this.changeAddressopen = true;
    this.modalPatch = true;
  }
  // select address pop up close
  addressCloseMd() {
    this.changeAddressopen = false;
    this.modalPatch = false;
  }
  closemd() {
    this.changePasswordMD = { 'display': 'none' };
    this.proceed();
  }
  proceed() {
    this.sAddress = this.addlist.find((a: any) => a.addId === this.selectedAdd)
    return this.sAddress;
  }
  // selected address
  selectedAddress() {
    this.app.commonLoader = true;
    this.localService.setDefault(this.createdby, 'Default', this.selectedAdd).subscribe({
      next: (data: any) => { },
      error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      },
      complete: () => {
        this.localService.getAddressById(this.selectedAdd).subscribe({
          next: (data) => {
            this.selectedAddById = data;
            this.sAddress = this.selectedAddById;
            this.getAddressList();
            this.app.openSnackBar('Address Changed');
          }, error: (err) => {
            this.app.commonLoader = false;
            // console.log(err);
          }, complete: () => {
            this.changeAddressopen = false;
            this.modalPatch = false;
            this.productTotal = 0;
            this.taxAmount = 0;
            this.deliveryCharge = 0;
            this.grandTotalAmount = 0;
            this.discount=0;
            this.Totalamount=0;
            this.getAddressList();
            this.getCartItemById();
          },
        });
      }
    })
  }
  // get discounted price
  getDiscountValue() {
    this.app.commonLoader = true;
    this.addId = this.selectedAdd ? this.selectedAdd : this.defaultadd
    this.localService.getTaxValue(this.HubId, 'Discount', this.coupon_Code.value.coupon_Code, this.addId.zipCode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe({
      next: (discount) => {
        this.Discount = discount;
        if (this.Discount != null) {
          if (this.productTotal > this.Discount?.minOrderValue) {
            const elements = document.getElementsByClassName('removecouponId_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
            if (elements[0].style.display == 'none' && elements[0] != null) {
              this.localService.applyCouen(this.createdby, this.coupon_Code.value.coupon_Code).subscribe({
                next: (res) => { },
                error: (err) => {
                  this.app.commonLoader = false;
                  this.app.openSnackBar('Something went wrong. Please try again later.');
                  //console.log(err);
                }, complete: () => {
                  const NewCouponArr = this.CouponArr;
                  this.filteredArray = NewCouponArr.filter((item: { coupenCode: string; }) => item.coupenCode !== this.coupon_Code.value.coupon_Code);
                  for (var i = 0; i < this.filteredArray?.length; i++) {
                    if ((document.getElementsByClassName('applycouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                      const applycouponId_elements = document.getElementsByClassName('applycouponId_' + this.filteredArray[i]?.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                      const bgcssSuccesss = document.getElementsByClassName('apply-coupon-list before_strap_' + this.filteredArray[i]?.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                      for (let k = 0; k < bgcssSuccesss?.length; k++) {
                        const bgcssSuccess = bgcssSuccesss[k];
                        bgcssSuccess.style.setProperty('--coupon-bg-color', '#222222');
                      }
                      for (let j = 0; j < applycouponId_elements?.length; j++) {
                        const applycouponId_element = applycouponId_elements[j];
                        applycouponId_element.style.display = 'block';
                      }
                    }
                  }
                  for (var i = 0; i < this.filteredArray?.length; i++) {
                    if ((document.getElementsByClassName('removecouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                      const removecouponId_elements = document.getElementsByClassName('removecouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                      for (let j = 0; j < removecouponId_elements?.length; j++) {
                        const removecouponId_element = removecouponId_elements[j];
                        removecouponId_element.style.display = 'none';
                      }
                    }
                  }
                  if ((document.getElementsByClassName('removecouponId_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                    const removecouponId_elements = document.getElementsByClassName('removecouponId_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    const bgcssSuccesss = document.getElementsByClassName('apply-coupon-list before_strap_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    for (let k = 0; k < bgcssSuccesss?.length; k++) {
                      const bgcssSuccess = bgcssSuccesss[k];
                      bgcssSuccess.style.setProperty('--coupon-bg-color', 'green');
                    }
                    for (let i = 0; i < removecouponId_elements?.length; i++) {
                      const removecouponId_element = removecouponId_elements[i];
                      removecouponId_element.style.display = 'block';
                    }
                  }
                  if ((document.getElementsByClassName('applycouponId_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                    const applycouponId_elements = document.getElementsByClassName('applycouponId_' + this.coupon_Code.value.coupon_Code?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    for (let i = 0; i < applycouponId_elements?.length; i++) {
                      const applycouponId_element = applycouponId_elements[i];
                      applycouponId_element.style.display = 'none';
                    }
                  }
                  this.DiscountPercent = (this.Totalamount * this.Discount.discountPercnt) / 100
                  this.discount = this.DiscountPercent
                  this.appycouponModal = false;
                  this.modalPatch = false;
                  this.calculateAmount()
                  this.app.openSnackBar('Coupon applied successfully.');
                }
              })
            } else {
              this.app.commonLoader = false;
              this.app.openSnackBar('Coupon already applied.');
            }
          } else {
            this.app.commonLoader = false;
            this.selectedCouponId = 0;
            this.app.openSnackBar('Please reach the minimum order value to use this coupon (Minimum order value: ' + this.Discount?.minOrderValue + ')');
          }
        }
        else {
          this.app.commonLoader = false;
          this.app.openSnackBar('Coupon not applied please try again.');
        }
      },
      error: (err) => {
        this.app.commonLoader = false;
        //console.log(err);
        this.app.openSnackBar('Coupon not applied please try again.');
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  viewCoupon() {
    this.appycouponModal = true;
    this.modalPatch = true;
  }
  closeAppyCouponModal() {
    this.appycouponModal = false;
    this.modalPatch = false;
  }
  getDiscountfromlist(coupon: any) {
    this.app.commonLoader = true;
    this.Coupon = coupon;
    this.selectedCouponId = coupon.id
    this.addId = this.selectedAdd ? this.selectedAdd : this.defaultadd
    this.localService.getTaxValue(this.HubId, 'Discount', this.Coupon.coupenCode, this.addId.zipCode, this.mycart[0]?.id ? this.mycart[0]?.id : 0).subscribe({
      next: (discount) => {
        this.Discount = discount;
        if (this.Discount != null) {
          if (this.productTotal > this.Discount?.minOrderValue) {
            this.localService.applyCouen(this.createdby, this.Coupon.coupenCode).subscribe({
              next: (res) => { },
              error: (err) => {
                this.app.commonLoader = false;
                this.app.openSnackBar('Something went wrong, Please try again later.')
                //console.log(err);
              }, complete: () => {
                const NewCouponArr = this.CouponArr;
                this.filteredArray = NewCouponArr.filter((item: { coupenCode: string; }) => item.coupenCode !== coupon.coupenCode);
                for (var i = 0; i < this.filteredArray?.length; i++) {
                  if ((document.getElementsByClassName('applycouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                    const applycouponId_elements = document.getElementsByClassName('applycouponId_' + this.filteredArray[i]?.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    const bgcssSuccesss = document.getElementsByClassName('apply-coupon-list before_strap_' + this.filteredArray[i]?.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    for (let k = 0; k < bgcssSuccesss?.length; k++) {
                      const bgcssSuccess = bgcssSuccesss[k];
                      bgcssSuccess.style.setProperty('--coupon-bg-color', '#222222');
                    }
                    for (let j = 0; j < applycouponId_elements?.length; j++) {
                      const applycouponId_element = applycouponId_elements[j];
                      applycouponId_element.style.display = 'block';
                    }
                  }
                }
                for (var i = 0; i < this.filteredArray?.length; i++) {
                  if ((document.getElementsByClassName('removecouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                    const removecouponId_elements = document.getElementsByClassName('removecouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                    for (let j = 0; j < removecouponId_elements?.length; j++) {
                      const removecouponId_element = removecouponId_elements[j];
                      removecouponId_element.style.display = 'none';
                    }
                  }
                }
                if ((document.getElementsByClassName('removecouponId_' + this.Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                  const removecouponId_elements = document.getElementsByClassName('removecouponId_' + this.Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                  const bgcssSuccesss = document.getElementsByClassName('apply-coupon-list before_strap_' + this.Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                  for (let k = 0; k < bgcssSuccesss?.length; k++) {
                    const bgcssSuccess = bgcssSuccesss[k];
                    bgcssSuccess.style.setProperty('--coupon-bg-color', 'green');
                  }
                  for (let i = 0; i < removecouponId_elements?.length; i++) {
                    const removecouponId_element = removecouponId_elements[i];
                    removecouponId_element.style.display = 'block';
                  }
                }
                if ((document.getElementsByClassName('applycouponId_' + this.Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
                  const applycouponId_elements = document.getElementsByClassName('applycouponId_' + this.Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
                  for (let i = 0; i < applycouponId_elements?.length; i++) {
                    const applycouponId_element = applycouponId_elements[i];
                    applycouponId_element.style.display = 'none';
                  }
                }
                this.DiscountPercent = (this.Totalamount * this.Discount.discountPercnt) / 100
                this.discount = this.DiscountPercent
                this.appycouponModal = false;
                this.modalPatch = false;
                this.calculateAmount()
                this.app.openSnackBar('Coupon applied successfully.');
              }
            })
          } else {
            this.app.commonLoader = false;
            this.selectedCouponId = 0;
            this.app.openSnackBar('Please reach the minimum order value to use this coupon (Minimum order value: ' + this.Discount?.minOrderValue + ')');
          }
        }
        else {
          this.app.commonLoader = false;
          this.app.openSnackBar('Coupon not applied please try again.');
        }
      },
      error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
        this.app.openSnackBar('Coupon not applied please try again.');
        //console.log(err)
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  RemoveDiscount(Coupon: any) {
    this.app.commonLoader = true;
    for (var i = 0; i < this.filteredArray?.length; i++) {
      if ((document.getElementsByClassName('applycouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
        const applycouponId_elements = document.getElementsByClassName('applycouponId_' + this.filteredArray[i].coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
        for (let j = 0; j < applycouponId_elements?.length; j++) {
          const applycouponId_element = applycouponId_elements[j];
          applycouponId_element.removeAttribute('disabled');
        }
      }
    }
    if ((document.getElementsByClassName('removecouponId_' + Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
      const removecouponId_elements = document.getElementsByClassName('removecouponId_' + Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
      const bgcssSuccesss = document.getElementsByClassName('apply-coupon-list before_strap_' + Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
      for (let k = 0; k < bgcssSuccesss?.length; k++) {
        const bgcssSuccess = bgcssSuccesss[k];
        bgcssSuccess.style.setProperty('--coupon-bg-color', '#222222');
      }
      for (let i = 0; i < removecouponId_elements?.length; i++) {
        const removecouponId_element = removecouponId_elements[i];
        removecouponId_element.style.display = 'none';
      }
    }
    if ((document.getElementsByClassName('applycouponId_' + Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>) != null) {
      const applycouponId_elements = document.getElementsByClassName('applycouponId_' + Coupon.coupenCode?.toUpperCase()) as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < applycouponId_elements?.length; i++) {
        const applycouponId_element = applycouponId_elements[i];
        applycouponId_element.style.display = 'block';
      }
    }
    this.productTotal = this.Totalamount;
    this.discount = 0;
    this.taxAmount = ((Number(this.Tax?.vatTaxpercent) * Number(this.Totalamount)) / 100);
    this.deliveryCharge = (this.Totalamount > 165 ? 0 : 32);
    this.grandTotalAmount = Math.round((this.productTotal + this.deliveryCharge));
    this.app.commonLoader = false;
    this.app.openSnackBar('Coupon removed successfully');
  }
  choosePayCloseMd() {
    this.choosePayment = false;
    this.modalPatch = false;
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
}