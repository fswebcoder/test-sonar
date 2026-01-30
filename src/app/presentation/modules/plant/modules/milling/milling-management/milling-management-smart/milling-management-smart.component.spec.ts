import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillingManagementSmartComponent } from './milling-management-smart.component';

describe('MillingManagementSmartComponent', () => {
  let component: MillingManagementSmartComponent;
  let fixture: ComponentFixture<MillingManagementSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillingManagementSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillingManagementSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
