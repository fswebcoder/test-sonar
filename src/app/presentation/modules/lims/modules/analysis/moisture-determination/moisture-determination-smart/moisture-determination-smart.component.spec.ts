import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoistureDeterminationSmartComponent } from './moisture-determination-smart.component';

describe('MoistureDeterminationSmartComponent', () => {
  let component: MoistureDeterminationSmartComponent;
  let fixture: ComponentFixture<MoistureDeterminationSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoistureDeterminationSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoistureDeterminationSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
