import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTypesSmartComponent } from './sample-types-smart.component';

describe('SampleTypesSmartComponent', () => {
  let component: SampleTypesSmartComponent;
  let fixture: ComponentFixture<SampleTypesSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleTypesSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleTypesSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
