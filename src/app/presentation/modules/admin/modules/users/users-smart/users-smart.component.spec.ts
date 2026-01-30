import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSmartComponent } from './users-smart.component';

describe('UsersSmartComponent', () => {
  let component: UsersSmartComponent;
  let fixture: ComponentFixture<UsersSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
