import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSmartComponent } from './login-smart.component';

describe('LoginSmartComponent', () => {
  let component: LoginSmartComponent;
  let fixture: ComponentFixture<LoginSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
