import { TestBed } from '@angular/core/testing';

import { MaincategoryService } from './maincategory.service';

describe('MaincategoryService', () => {
  let service: MaincategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaincategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
