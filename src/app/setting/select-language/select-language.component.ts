import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private product_service: ProductService) {
    this.getuserdetails();
  }
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  HubId: any = this.activatedRoute.snapshot.params['HubId'];

  backNavigation() {
    this.location.back();
  }
  selectedlanguage: any = "English"
  userdetails: any;

  getuserdetails() {
    this.product_service.getuserdetails(this.createdBy).subscribe({
      next:(data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language;
      },error:(err)=> {
        // console.log(err);
      },
    });
  }
}
