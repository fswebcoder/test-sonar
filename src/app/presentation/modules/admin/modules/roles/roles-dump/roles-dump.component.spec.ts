import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesDumpComponent } from './roles-dump.component';

describe('RolesDumpComponent', () => {
  let component: RolesDumpComponent;
  let fixture: ComponentFixture<RolesDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
