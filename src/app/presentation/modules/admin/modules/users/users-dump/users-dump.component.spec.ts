import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDumpComponent } from './users-dump.component';

describe('UsersDumpComponent', () => {
  let component: UsersDumpComponent;
  let fixture: ComponentFixture<UsersDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
