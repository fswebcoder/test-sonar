import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionSampleSmartComponent } from './reception-sample-smart.component';

describe('ReceptionSampleSmartComponent', () => {
  let component: ReceptionSampleSmartComponent;
  let fixture: ComponentFixture<ReceptionSampleSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionSampleSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionSampleSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
