import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySmartComponent } from './laboratory-smart.component';

describe('LaboratorySmartComponent', () => {
  let component: LaboratorySmartComponent;
  let fixture: ComponentFixture<LaboratorySmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorySmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratorySmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
