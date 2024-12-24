import { Component } from '@angular/core';

@Component({
  selector: 'app-bulk-offer',
  templateUrl: './bulk-offer.component.html',
  styleUrls: ['./bulk-offer.component.scss']
})
export class BulkOfferComponent {
  modalPatch: boolean = false;
  selectedlanguage:any="English";
  constructor() {};
}
