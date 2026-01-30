import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplierDumpComponent } from './create-supplier-dump.component';

describe('CreateSupplierDumpComponent', () => {
  let component: CreateSupplierDumpComponent;
  let fixture: ComponentFixture<CreateSupplierDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSupplierDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSupplierDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
