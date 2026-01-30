import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatInputPasswordComponent } from './float-input-password.component';

describe('FloatInputPasswordComponent', () => {
  let component: FloatInputPasswordComponent;
  let fixture: ComponentFixture<FloatInputPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatInputPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatInputPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
