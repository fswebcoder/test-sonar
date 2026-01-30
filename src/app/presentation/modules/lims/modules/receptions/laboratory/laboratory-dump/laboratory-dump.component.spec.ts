import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryDumpComponent } from './laboratory-dump.component';

describe('LaboratoryDumpComponent', () => {
  let component: LaboratoryDumpComponent;
  let fixture: ComponentFixture<LaboratoryDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
