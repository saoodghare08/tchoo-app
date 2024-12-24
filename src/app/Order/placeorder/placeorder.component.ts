import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.scss']
})
export class PlaceorderComponent {
  createdby: any = this.activatedRoute.snapshot.params['userId'];
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    setInterval(() => {
      window.location.href = '/Home/' + this.createdby
    }, 30000);
  }
}