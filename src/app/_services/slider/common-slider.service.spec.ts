import { TestBed } from '@angular/core/testing';

import { CommonSliderService } from './common-slider.service';

describe('CommonSliderService', () => {
  let service: CommonSliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonSliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
