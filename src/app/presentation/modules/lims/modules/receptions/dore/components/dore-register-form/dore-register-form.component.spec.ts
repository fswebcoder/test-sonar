import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoreRegisterFormComponent } from './dore-register-form.component';

describe('DoreRegisterFormComponent', () => {
  let component: DoreRegisterFormComponent;
  let fixture: ComponentFixture<DoreRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoreRegisterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoreRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
