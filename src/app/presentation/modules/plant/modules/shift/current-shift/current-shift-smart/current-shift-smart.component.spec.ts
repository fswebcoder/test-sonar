import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentShiftSmartComponent } from './current-shift-smart.component';

describe('CurrentShiftSmartComponent', () => {
  let component: CurrentShiftSmartComponent;
  let fixture: ComponentFixture<CurrentShiftSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentShiftSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentShiftSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
