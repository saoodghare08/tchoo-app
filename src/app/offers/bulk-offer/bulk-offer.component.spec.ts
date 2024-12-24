import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOfferComponent } from './bulk-offer.component';

describe('BulkOfferComponent', () => {
  let component: BulkOfferComponent;
  let fixture: ComponentFixture<BulkOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
