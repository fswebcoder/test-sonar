import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftConfigSmartComponent } from './shift-config-smart.component';

describe('ShiftConfigSmartComponent', () => {
  let component: ShiftConfigSmartComponent;
  let fixture: ComponentFixture<ShiftConfigSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftConfigSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftConfigSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
