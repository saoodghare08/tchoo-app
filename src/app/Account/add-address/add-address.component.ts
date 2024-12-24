import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalService } from 'src/app/_services/local.service';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/_services/product/product.service';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  addId: any = this.activatedRoute.snapshot.params['addId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];
  type: any = this.activatedRoute.snapshot.params['type'];
  cartId: any = this.activatedRoute.snapshot.params['cartId'];
  backUrl: any = this.activatedRoute.snapshot.params['backurl'];

  editaddress: any = [];
  address: any = [];
  hub: any = [];
  userdetails: any = [];

  submitted: boolean = false;
  altContact!: boolean;
  Landmark!: boolean;

  fullname: any;
  city: any;
  zipcode: any;
  country: any;
  street: any;
  // formbuilder for address form
  add_address = this.fb.group({
    id: [0],
    addId: [''],
    customerId: [''],
    firstName: ['',[Validators.required,Validators.pattern("^(?=[a-zA-Z\u00C0-\u00FF']*[a-zA-Z\u00C0-\u00FF]{2,})[a-zA-Z\u00C0-\u00FF']+([',. -][a-zA-Z\u00C0-\u00FF ]+)*$")]],
    lastName: [''],
    email:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    contact: ['', [Validators.required, Validators.pattern('[- +()0-9]{10,12}')]],
    alternativeContact: ['',Validators.pattern('[- +()0-9]{10,12}')],
    country: ['', Validators.required],
    landmark: [''],
    city: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)],],
    buildingName: [''],
    roomNo: [''],
    sector: [''],
    locality: ['', Validators.required],
    createdBy: [''],
    lastUpdatedBy: [''],
    type: [''],
    addressType: ['home', Validators.required],
    hub: [''],
  });
  constructor(
    private fb: FormBuilder,
    private localService: LocalService,
    private router: Router,
    private app: AppComponent,
    private activatedRoute: ActivatedRoute,
    private product_service: ProductService,
  ) {
    this.app.ReturnParam.push({ url: this.router.url })
  }
  ngOnInit(): void {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback'
    } else {
      this.getuserdetails();
      if (this.type == 'updated') {
        this.updatedlocation();
      }
    }
  }
  // get userdetails
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        this.fullname = this.userdetails.fullName;
        this.userdetails.phoneNumber = this.userdetails.phoneNumber == 'null' ? '' : this.userdetails.phoneNumber == null ? '' : this.userdetails.phoneNumber
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  get f() {
    return this.add_address.controls;
  }
  // add new address
  AddAddress() {
    this.submitted = true;
    if (this.add_address.status == 'INVALID') {
      this.app.commonLoader = false;
      return;
    }
    else {
      this.app.commonLoader = true;
      this.add_address.value.customerId = this.createdBy;
      this.add_address.value.createdBy = this.createdBy;
      this.localService.AddAddress(this.add_address.value).subscribe({
        next: (data) => {
          const backnav = this.router.url
          var navdata = backnav.split('/', 6);
          this.app.openSnackBar('Add Address Successfully');
          if (navdata[5] == 'customerinfo') {
            window.location.href = `/Order/CustomerInfo/${this.createdBy}/${this.cartId}/${this.HubId}`;
          }
          else if (navdata[5] == 'SavedAddress') {
            window.location.href = `/Setting/SaveAddress/${this.createdBy}/${this.HubId}`;
          }
          else if (navdata[5] == 'Mycartaddr') {
            window.location.href = `/MyCart/${this.createdBy}/${this.HubId}`;
          }
        },
        error: (err) => {
          this.app.openSnackBar('someting went wrong try again later;');
          this.app.commonLoader = false;
        }, complete: () => {
          this.app.commonLoader = false;
        },
      });
    }
  }
  // alternate contact field hide and show
  addAltContact() {
    this.altContact = true;
  }
  // landmark field hide and show
  addLandmark() {
    this.Landmark = true;
  }
  //zipcode servicible check
  checkZipcode(e: any) {
    let zip = this.add_address.value.zipCode;
    this.localService.getHub(zip).subscribe({
      next: (data) => {
        this.hub = data;
        if (this.hub == null) {
          this.app.openSnackBar('Product is not deliberable on this address');
          this.add_address.get('zipCode')?.reset();
        }
      },
      error: (err) => {
        this.app.openSnackBar('someting went wrong try again later;');
      },
    });
  }
  // locate me url sending
  locateme() {
    this.router.navigate(['/Locateme']);
  }
  // get locate me address
  updatedlocation() {
    this.app.commonLoader = true;
    this.localService.getuserlocation(this.createdBy).subscribe({
      next: (data) => {
        this.address = data;
        // this.city = this.address.city;
        this.city = "";
        this.zipcode = this.address.postalcode;
        this.street = this.address.mainAddress;
        // this.country = this.address.country;
        this.country = "";
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
}