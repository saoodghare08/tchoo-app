import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleOfferComponent } from './bundle-offer.component';

describe('BundleOfferComponent', () => {
  let component: BundleOfferComponent;
  let fixture: ComponentFixture<BundleOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BundleOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
