import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDumpComponent } from './login-dump.component';

describe('LoginDumpComponent', () => {
  let component: LoginDumpComponent;
  let fixture: ComponentFixture<LoginDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
