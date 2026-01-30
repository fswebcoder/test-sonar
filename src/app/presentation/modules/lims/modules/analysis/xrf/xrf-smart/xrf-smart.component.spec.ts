import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XrfSmartComponent } from './xrf-smart.component';

describe('XrfSmartComponent', () => {
  let component: XrfSmartComponent;
  let fixture: ComponentFixture<XrfSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XrfSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XrfSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
