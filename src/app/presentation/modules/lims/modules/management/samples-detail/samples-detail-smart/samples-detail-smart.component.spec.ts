import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesDetailSmartComponent } from './samples-detail-smart.component';

describe('SamplesDetailSmartComponent', () => {
  let component: SamplesDetailSmartComponent;
  let fixture: ComponentFixture<SamplesDetailSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesDetailSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesDetailSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
