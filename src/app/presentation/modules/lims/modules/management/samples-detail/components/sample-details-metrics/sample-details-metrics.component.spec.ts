import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetailsMetricsComponent } from './sample-details-metrics.component';

describe('SampleDetailsMetricsComponent', () => {
  let component: SampleDetailsMetricsComponent;
  let fixture: ComponentFixture<SampleDetailsMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDetailsMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDetailsMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
