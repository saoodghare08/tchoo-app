import { Component, OnInit } from '@angular/core';
import { NotificationService } from './_services/toastr.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProductService } from './_services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalService } from './_services/local.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  title = 'TCHOO';

  languageStatus: boolean = false;
  commonLoader: boolean = false;
  pageLoader: boolean = false;

  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];
  ReturnParam: any[] = [];

  userdetails: any;
  defaultzip: any;

  currentUrl: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public notifyService: NotificationService,
    private _snackBar: MatSnackBar,
    private router:Router,
    private product_service: ProductService,
    private local: LocalService  ) { }
  ngOnInit() {
    this.commonLoader = true;
    this.local.detailsBool$.subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        this.createdBy = data.createdBy;
        if (this.createdBy != 0 || this.createdBy != undefined) {
          this.getuserdetails();
        }
      } else {
        this.commonLoader = false;
      }
    });
  }
  getuserdetails() {
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next: (data) => {
        this.userdetails = data;
      }, error: (err) => {
        this.commonLoader = false;
      }, complete: () => {
        if (this.userdetails.phoneNumber == null || this.userdetails.phoneNumberConfirmed==false) {
          this.router.navigate([`Setting/EditProfile/${this.createdBy}/HID01`]);
        }
      }
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
      panelClass: ['warning'],
    
    });
  }
  showSnackbarCssStyles(content: any, action: any, duration: any) {
    let sb = this._snackBar.open(content, action, {
      duration: duration,
      panelClass: ["custom-style"]
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }
}
