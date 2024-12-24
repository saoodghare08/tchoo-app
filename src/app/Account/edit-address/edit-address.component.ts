import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalService } from 'src/app/_services/local.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  addId: any = this.activatedRoute.snapshot.params['addId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  submitted :boolean= false;
  Landmark: boolean = false;
  altContact: boolean = false;

  id: any;
  defaultzip: any;

  editaddress: any = [];
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  navlink:any[]=[];
  
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
    private app: AppComponent,
    private activatedRoute: ActivatedRoute
  ) { }
  // alternate contact field hide and show
  addAltContact() {
    this.altContact = true;
  }
  // landmark field hide and show
  addLandmark() {
    this.Landmark = true;
  }
  ngOnInit(): void {
    if (this.createdBy == '0') {
      window.location.href = '/SignIn/Goback'
    }
    else {
      this.app.commonLoader = true;
      this.localService.getAddressById(this.addId).subscribe({
        next: (data) => {
          this.editaddress = data;
        }, error: (err) => {
          this.app.commonLoader = false;
          // console.log(err);
        }, complete: () => {
          this.getAddress();
        }
      });
    }
  }
   // Get user's all addresses
   getAddress() {
    this.localService.getAddress(this.createdBy).subscribe({
      next: (data) => {
        this.addlist = data;
        this.DefultAdd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzip = this.DefultAdd?.zipCode;
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
  // Get Hub details
  getHub() {
    this.localService.getHub(this.defaultzip).subscribe({
      next: (data) => {
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.Hub = data;
          this.HubId = this.Hub.hubId;
        }
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
      },
    });
  }
  // onsubmit validation
  get f() {
    return this.add_address.controls;
  }
  // edit address
  EditAddress() {
    this.submitted = true;
    if ((this.add_address.status == 'INVALID' || this.editaddress == null)) {
      this.app.commonLoader=false;
      return;
    } else {
      this.app.commonLoader = true;
      this.add_address.value.customerId = this.createdBy;
      this.add_address.value.createdBy = this.createdBy;
      this.add_address.value.addId = this.addId;
      this.id = this.addId.split('AI', 2);
      this.add_address.value.id = Number(this.id[1]);
      this.localService.Updateadd(this.id[1], this.add_address.value).subscribe({
        next: (data) => {
          this.navlink = JSON.parse(sessionStorage.getItem("navlinkParam") || '[]');
          window.location.href=this.navlink[this.navlink.length-1].url;
        },
        error: (err) => {
          this.app.commonLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
          // console.log(err);
        }
      });
    }
  }
}