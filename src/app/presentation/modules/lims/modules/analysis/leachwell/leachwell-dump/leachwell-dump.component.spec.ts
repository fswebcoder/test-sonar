import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeachwellDumpComponent } from './leachwell-dump.component';

describe('LeachwellDumpComponent', () => {
  let component: LeachwellDumpComponent;
  let fixture: ComponentFixture<LeachwellDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeachwellDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeachwellDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
