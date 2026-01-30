import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XrfDumpComponent } from './xrf-dump.component';

describe('XrfDumpComponent', () => {
  let component: XrfDumpComponent;
  let fixture: ComponentFixture<XrfDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XrfDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XrfDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
