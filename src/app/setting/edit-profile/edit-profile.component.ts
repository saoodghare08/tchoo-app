import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/_services/product/product.service';
import { Location } from "@angular/common";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  selectedlanguage: any = 'English';

  userdetails: any = [];
  private history: string[] = [];

  SuccesMD: any;
  validateCM: any;
  submitted: any;
  navigateToUrl: any;
  ContactNumber: any;
  otpValue: any;
  otpResErr: any;
  otpErr: any;
  updatedContactNumber: any;

  isotpVerified: boolean = false;
  isOtpVerification: boolean = false;

  phoneFormVal: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required])
  });

  details = this.fb.group({
    id: [0],
    fullName: ['', [Validators.required, Validators.pattern("^(?=[a-zA-Z\u00C0-\u00FF']*[a-zA-Z\u00C0-\u00FF]{2,})(?=.*[a-zA-Z\u00C0-\u00FF])[a-zA-Z\u00C0-\u00FF']+([',. -][a-zA-Z\u00C0-\u00FF ]+)*$")]],
    userID: [''],
    createdBy: ['']
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private product_service: ProductService,
    private fb: FormBuilder,
    private location: Location) {
    if (this.createdBy != 0 || this.createdBy != undefined) {
      this.getuserdetails();
    }
  }
  // set otp fields configuration
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '45px',
      height: '45px',
      'border-radius': '12px',
    },
  };
  //get user details
  getuserdetails() {
    this.app.commonLoader = true;
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
        console.log(this.userdetails);
        this.isotpVerified=this.userdetails?.phoneNumberConfirmed;
        this.selectedlanguage = this.userdetails.language;
        this.details.patchValue({
          fullName: this.userdetails?.fullName,
        });
        this.phoneForm.patchValue({
          phone: this.userdetails?.phoneNumber == null ? '' : this.userdetails?.phoneNumber
        });
      }, error: (err) => {
        // console.log(err);
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      }, complete: () => {
        this.app.commonLoader = false;
        this.app.pageLoader = false;
      },
    });
  }
  get formData() {
    return this.details.controls;
  }
  get phoneformData() {
    return this.phoneForm.controls;
  }
  //update profile
  sendOtp() {
    this.submitted = true;
    if (this.details.status == "INVALID" || this.phoneForm.status == 'INVALID') {
      this.app.pageLoader = false;
      return;
    } else {
      this.app.pageLoader = true;
      this.details.value.userID = this.createdBy;
      this.phoneFormVal = this.phoneForm.value.phone;
      this.ContactNumber = this.phoneFormVal.internationalNumber;
      this.product_service.sendOtp(this.details.value, this.phoneForm.value).subscribe({
        next: (data: any) => {
          this.validateCM = { 'display': 'block' };
          this.ngOtpInput.setValue('');
          this.otpResErr = '';
          this.otpErr = false;
        },
        error: (err) => {
          this.validateCM = { 'display': 'none' };
          this.app.pageLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.app.pageLoader = false;
        },
      })
    }
  }
  submitForm(event: any) {
    if (event.submitter.name == 'showSuccessBtn') {
      this.showSuccess();
    } else if (event.submitter.name == 'sendOtpBtn') {
      this.sendOtp();
    }
  }
  backNavigation(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/Home/" + this.createdBy);
    }
  }
  ProceedToHome() {
    this.SuccesMD = { 'display': 'none' };
    const lastUrl = this.app.ReturnParam.pop();
    if (lastUrl.url.split('/')[1] == 'Home') {
      this.router.navigateByUrl("/Home/" + this.createdBy);
    }
  }
  showSuccess() {
    this.app.pageLoader = true;
    this.submitted = true;
    this.details.value.userID = this.createdBy;
    if (this.details.status == "INVALID") {
      this.app.pageLoader = false;
      return;
    } else {
      this.product_service.editProfile(this.details.value, this.phoneForm.value).subscribe({
        next: (data: any) => {
          this.SuccesMD = { 'display': 'block' };
        }, error: (err) => {
          this.app.pageLoader = false;
          this.app.openSnackBar('Something went wrong. Please try again later');
        }, complete: () => {
          this.app.pageLoader = false;
        },
      })
    }
  }
  closeVerifyModal() {
    this.validateCM = { 'display': 'none' };
  }
  onOtpChange(otpValue: any) {
    this.otpValue = otpValue;
    this.otpResErr = '';
    this.isOtpVerification = false;
  }
  onContactchange() {
    this.updatedContactNumber = this.phoneForm.value.phone;
    if( this.updatedContactNumber != null){
      if (this.updatedContactNumber.number != this.userdetails?.phoneNumber || this.updatedContactNumber.dialCode != this.userdetails?.countryDialCode) {
        this.isotpVerified = false;
      } else if ((this.updatedContactNumber.number == this.userdetails?.phoneNumber || this.updatedContactNumber.dialCode == this.userdetails?.countryDialCode)&& this.userdetails?.phoneNumberConfirmed ==true) {
        this.isotpVerified =true;
      }else{
        this.isotpVerified=false;
      }
    }
  }
  // verify otp
  verifyBttn() {
    this.isOtpVerification = true;
    if (this.otpValue != undefined) {
      if (this.otpValue.length == 6) {
        this.product_service.otpVerification(this.details.value.userID, this.otpValue).subscribe({
          next: async (res: any) => {
            this.otpResErr = '';
            this.otpErr = false;
            this.ngOtpInput.setValue('');
            this.isotpVerified = true;
            this.validateCM = { 'display': 'none' };
          },
          error: (err: any) => {
            this.otpErr = true;
            this.isotpVerified = false;
            this.otpResErr = 'Invalid otp please try again!';
            return;
          },
        });
      } else {
        this.otpErr = true;
        return;
      }
    } else {
      this.otpErr = true;
      return;
    }
  }
}
