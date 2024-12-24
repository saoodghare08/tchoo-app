import { HttpClient } from '@angular/common/http';
import { NotificationDTOs } from './../_common/DTOs/AccountSetting/NotificationDTOs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notificationList: NotificationDTOs[] = [];
  private history: string[] = [];

  createdby: any = this.activatedRoute.snapshot.params['userId'];

  pushNotificationView: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private app: AppComponent
  ) { }
  ngOnInit(): void {
    this.getNotification();
  }
  getNotification() {
    this.app.commonLoader = true;
     this.http.get("https://villiyantapi.cxengine.net/api/Notification/GetNotifications/" + this.createdby).subscribe({
  //  this.http.get("http://localhost:5114/apii/Notification/GetNotifications/" + this.createdby).subscribe({
      next: (data: any) => {
        this.notificationList = data;
      }, error: (err) => {
        this.app.commonLoader = false;
        // console.log(err);
      }, complete: () => {
        this.app.commonLoader = false;
      },
    })
  }
  backNavigation(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      window.location.href = "/Home/" + this.createdby;
    }
  }
}
