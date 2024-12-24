import { Component } from '@angular/core';
import { Location } from "@angular/common"

@Component({
  selector: 'app-termsand-conditions',
  templateUrl: './termsand-conditions.component.html',
  styleUrls: ['./termsand-conditions.component.scss']
})
export class TermsandConditionsComponent {
  constructor(
    private location: Location
  ) { }
  backNavigation() {
    this.location.back();
  }
}