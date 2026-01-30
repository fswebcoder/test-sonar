import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionSampleDumpComponent } from './reception-sample-dump.component';

describe('ReceptionSampleDumpComponent', () => {
  let component: ReceptionSampleDumpComponent;
  let fixture: ComponentFixture<ReceptionSampleDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionSampleDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionSampleDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
