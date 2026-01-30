import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTypesDumpComponent } from './sample-types-dump.component';

describe('SampleTypesDumpComponent', () => {
  let component: SampleTypesDumpComponent;
  let fixture: ComponentFixture<SampleTypesDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleTypesDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleTypesDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
