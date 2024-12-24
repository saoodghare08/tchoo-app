import { Component } from '@angular/core';
import { Location } from "@angular/common"

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  constructor(
    private location: Location
  ) { }
  backNavigation() {
    this.location.back();
  }
}