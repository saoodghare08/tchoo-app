import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent {
  constructor(private location: Location){}

  backNavigation() {
    this.location.back();
  }
}
