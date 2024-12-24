import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { CardNumberComponent } from './card-number.component';
import { ExpiryDateComponent } from './expiry-date.component';
import { CvvComponent } from './cvv.component';


@NgModule({
  declarations: [
    CardNumberComponent,
    ExpiryDateComponent,
    CvvComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CardNumberComponent,
    ExpiryDateComponent,
    CvvComponent
  ]
})
export class Frames { }
