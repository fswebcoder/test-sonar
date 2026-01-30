import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierSmartComponent } from './edit-supplier-smart.component';

describe('EditSupplierSmartComponent', () => {
  let component: EditSupplierSmartComponent;
  let fixture: ComponentFixture<EditSupplierSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSupplierSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSupplierSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
