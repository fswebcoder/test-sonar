import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillingManagementDumpComponent } from './milling-management-dump.component';

describe('MillingManagementDumpComponent', () => {
  let component: MillingManagementDumpComponent;
  let fixture: ComponentFixture<MillingManagementDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillingManagementDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MillingManagementDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
