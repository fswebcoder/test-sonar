import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesDumpComponent } from './samples-dump.component';

describe('SamplesDumpComponent', () => {
  let component: SamplesDumpComponent;
  let fixture: ComponentFixture<SamplesDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
