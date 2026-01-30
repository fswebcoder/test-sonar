import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicAbsorptionDumpComponent } from './atomic-absorption-dump.component';

describe('AtomicAbsorptionDumpComponent', () => {
  let component: AtomicAbsorptionDumpComponent;
  let fixture: ComponentFixture<AtomicAbsorptionDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomicAbsorptionDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtomicAbsorptionDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
