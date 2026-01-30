import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetailListCardComponent } from './sample-detail-list-card.component';

describe('SampleDetailListCardComponent', () => {
  let component: SampleDetailListCardComponent;
  let fixture: ComponentFixture<SampleDetailListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDetailListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDetailListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
