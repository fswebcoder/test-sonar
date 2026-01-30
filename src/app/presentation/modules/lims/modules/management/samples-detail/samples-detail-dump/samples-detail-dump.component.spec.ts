import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesDetailDumpComponent } from './samples-detail-dump.component';

describe('SamplesDetailDumpComponent', () => {
  let component: SamplesDetailDumpComponent;
  let fixture: ComponentFixture<SamplesDetailDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesDetailDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesDetailDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
