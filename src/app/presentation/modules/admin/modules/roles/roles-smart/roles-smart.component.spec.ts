import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesSmartComponent } from './roles-smart.component';

describe('RolesSmartComponent', () => {
  let component: RolesSmartComponent;
  let fixture: ComponentFixture<RolesSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
