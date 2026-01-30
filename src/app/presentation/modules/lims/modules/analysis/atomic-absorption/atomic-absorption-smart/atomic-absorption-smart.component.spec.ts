import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicAbsorptionSmartComponent } from './atomic-absorption-smart.component';

describe('AtomicAbsorptionSmartComponent', () => {
  let component: AtomicAbsorptionSmartComponent;
  let fixture: ComponentFixture<AtomicAbsorptionSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomicAbsorptionSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtomicAbsorptionSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
