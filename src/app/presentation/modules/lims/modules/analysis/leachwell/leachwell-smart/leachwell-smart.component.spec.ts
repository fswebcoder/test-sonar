import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeachwellSmartComponent } from './leachwell-smart.component';

describe('LeachwellSmartComponent', () => {
  let component: LeachwellSmartComponent;
  let fixture: ComponentFixture<LeachwellSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeachwellSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeachwellSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
