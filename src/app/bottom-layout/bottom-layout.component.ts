import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalService } from '../_services/local.service';

@Component({
  selector: 'app-bottom-layout',
  templateUrl: './bottom-layout.component.html',
  styleUrls: ['./bottom-layout.component.scss']
})
export class BottomLayoutComponent {
  Hub: any = [];
  DefultAdd: any = [];
  addlist: any = [];

  fullname: any;
  defaultzip: any;

  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private local: LocalService
  ) {
    this.local.getAddress(this.createdBy).subscribe({
      next: (data) => {
        this.addlist = data;
        this.DefultAdd = this.addlist.find((a: any) => a.type === 'Default');
        this.defaultzip = this.DefultAdd?.zipCode;
      },
      error: (err) => {
        // console.log(err)
      },
      complete: () => {
        this.getHub();
      }
    });
  }
  getHub() {
    this.local.getHub(this.defaultzip).subscribe({
      next:(data: any) => {
        if (data == null) {
          this.HubId = 'HID01';
        } else {
          this.Hub = data;
          this.HubId = this.Hub.hubId;
        }
      },error:(err)=> {
         // console.log(err)
      }
    });
  }
}