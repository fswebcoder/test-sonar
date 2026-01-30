import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetailsGeneralInformationComponent } from './sample-details-general-information.component';

describe('SampleDetailsGeneralInformationComponent', () => {
  let component: SampleDetailsGeneralInformationComponent;
  let fixture: ComponentFixture<SampleDetailsGeneralInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDetailsGeneralInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDetailsGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
