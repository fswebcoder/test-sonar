import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePikerComponent } from './date-piker.component';

describe('DatePikerComponent', () => {
  let component: DatePikerComponent;
  let fixture: ComponentFixture<DatePikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePikerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
