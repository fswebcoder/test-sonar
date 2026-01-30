import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersListSmartComponent } from './suppliers-list-smart.component';

describe('SuppliersListSmartComponent', () => {
  let component: SuppliersListSmartComponent;
  let fixture: ComponentFixture<SuppliersListSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliersListSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersListSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
