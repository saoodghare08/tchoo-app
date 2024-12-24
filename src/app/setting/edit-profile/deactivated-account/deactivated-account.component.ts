import { Component } from '@angular/core';

@Component({
  selector: 'app-deactivated-account',
  templateUrl: './deactivated-account.component.html',
  styleUrls: ['./deactivated-account.component.scss']
})
export class DeactivatedAccountComponent {
  confirmDeactivationMD:any;

  showDialog() {
    this.confirmDeactivationMD = { 'display': 'block' };
  }
  closemd() {
    this.confirmDeactivationMD = { 'display': 'none' };
  }
}
