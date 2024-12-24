import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonSliderService {
  constructor() { }
  commonSlider = {
    dots: false,
    infinite: true,
    arrows: false,
    slidesToShow: 8,
    centerMode: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  }
}