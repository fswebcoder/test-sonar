import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSupplierComponent } from './management-supplier.component';

describe('ManagementSupplierComponent', () => {
  let component: ManagementSupplierComponent;
  let fixture: ComponentFixture<ManagementSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
