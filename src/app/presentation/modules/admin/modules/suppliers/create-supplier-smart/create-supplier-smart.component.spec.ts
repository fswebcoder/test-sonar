import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplierSmartComponent } from './create-supplier-smart.component';

describe('CreateSupplierSmartComponent', () => {
  let component: CreateSupplierSmartComponent;
  let fixture: ComponentFixture<CreateSupplierSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSupplierSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSupplierSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
