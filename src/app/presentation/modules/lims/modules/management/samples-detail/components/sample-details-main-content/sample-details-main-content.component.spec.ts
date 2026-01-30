import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetailsMainContentComponent } from './sample-details-main-content.component';

describe('SampleDetailsMainContentComponent', () => {
  let component: SampleDetailsMainContentComponent;
  let fixture: ComponentFixture<SampleDetailsMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDetailsMainContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDetailsMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
