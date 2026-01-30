import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoistureDeterminationDumpComponent } from './moisture-determination-dump.component';

describe('MoistureDeterminationDumpComponent', () => {
  let component: MoistureDeterminationDumpComponent;
  let fixture: ComponentFixture<MoistureDeterminationDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoistureDeterminationDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoistureDeterminationDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
