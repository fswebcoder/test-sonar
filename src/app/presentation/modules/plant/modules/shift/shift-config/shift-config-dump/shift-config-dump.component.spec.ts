import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftConfigDumpComponent } from './shift-config-dump.component';

describe('ShiftConfigDumpComponent', () => {
  let component: ShiftConfigDumpComponent;
  let fixture: ComponentFixture<ShiftConfigDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftConfigDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftConfigDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
