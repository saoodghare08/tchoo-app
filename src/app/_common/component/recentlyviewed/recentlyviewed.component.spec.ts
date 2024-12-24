import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyviewedComponent } from './recentlyviewed.component';

describe('RecentlyviewedComponent', () => {
  let component: RecentlyviewedComponent;
  let fixture: ComponentFixture<RecentlyviewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyviewedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyviewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
