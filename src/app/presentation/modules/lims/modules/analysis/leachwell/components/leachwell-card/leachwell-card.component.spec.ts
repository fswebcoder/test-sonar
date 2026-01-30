import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeachwellCardComponent } from './leachwell-card.component';

describe('LeachwellCardComponent', () => {
  let component: LeachwellCardComponent;
  let fixture: ComponentFixture<LeachwellCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeachwellCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeachwellCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
