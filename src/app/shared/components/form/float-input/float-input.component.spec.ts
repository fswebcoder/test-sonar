import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatInputComponent } from './float-input.component';

describe('FloatInpuComponent', () => {
  let component: FloatInputComponent;
  let fixture: ComponentFixture<FloatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FloatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
