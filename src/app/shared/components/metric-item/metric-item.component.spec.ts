import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricItemComponent } from './metric-item.component';

describe('MetricItemComponent', () => {
  let component: MetricItemComponent;
  let fixture: ComponentFixture<MetricItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
