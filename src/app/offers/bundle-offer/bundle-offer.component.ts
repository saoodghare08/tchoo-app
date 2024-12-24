import { Component } from '@angular/core';

@Component({
  selector: 'app-bundle-offer',
  templateUrl: './bundle-offer.component.html',
  styleUrls: ['./bundle-offer.component.scss']
})
export class BundleOfferComponent {
  modalPatch: boolean = false;
  selectedlanguage:any="English";
  constructor() {};
}
