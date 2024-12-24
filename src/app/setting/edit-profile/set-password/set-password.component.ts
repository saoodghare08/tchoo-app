import { Component } from '@angular/core';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent {
  PasswordSetMd:any;

  showDialog() {
    this.PasswordSetMd = { 'display': 'block' };
  }

  closemd() {
    this.PasswordSetMd = { 'display': 'none' };
  }
}
