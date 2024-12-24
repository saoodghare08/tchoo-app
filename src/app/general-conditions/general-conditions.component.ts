import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-general-conditions',
  templateUrl: './general-conditions.component.html',
  styleUrls: ['./general-conditions.component.scss']
})
export class GeneralConditionsComponent {
  constructor(private location: Location){}

  backNavigation() {
    this.location.back();
  }
}
