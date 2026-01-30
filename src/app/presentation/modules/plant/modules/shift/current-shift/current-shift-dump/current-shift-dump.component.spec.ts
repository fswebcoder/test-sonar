import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentShiftDumpComponent } from './current-shift-dump.component';

describe('CurrentShiftDumpComponent', () => {
  let component: CurrentShiftDumpComponent;
  let fixture: ComponentFixture<CurrentShiftDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentShiftDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentShiftDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
