import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesSmartComponent } from './samples-smart.component';

describe('SamplesSmartComponent', () => {
  let component: SamplesSmartComponent;
  let fixture: ComponentFixture<SamplesSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
