import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAddressComponent } from './save-address.component';

describe('SaveAddressComponent', () => {
  let component: SaveAddressComponent;
  let fixture: ComponentFixture<SaveAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
