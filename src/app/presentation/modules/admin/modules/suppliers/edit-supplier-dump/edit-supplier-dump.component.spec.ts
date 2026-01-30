import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierDumpComponent } from './edit-supplier-dump.component';

describe('EditSupplierDumpComponent', () => {
  let component: EditSupplierDumpComponent;
  let fixture: ComponentFixture<EditSupplierDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSupplierDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSupplierDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
