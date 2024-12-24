import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagaOfferComponent } from './baga-offer.component';

describe('BagaOfferComponent', () => {
  let component: BagaOfferComponent;
  let fixture: ComponentFixture<BagaOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BagaOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagaOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
