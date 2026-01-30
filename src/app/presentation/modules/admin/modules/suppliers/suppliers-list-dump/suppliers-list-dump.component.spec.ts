import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersListDumpComponent } from './suppliers-list-dump.component';

describe('SuppliersListDumpComponent', () => {
  let component: SuppliersListDumpComponent;
  let fixture: ComponentFixture<SuppliersListDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliersListDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersListDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
