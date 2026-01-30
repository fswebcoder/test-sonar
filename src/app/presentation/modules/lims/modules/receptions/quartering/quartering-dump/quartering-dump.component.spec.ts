import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarteringDumpComponent } from './quartering-dump.component';

describe('QuarteringDumpComponent', () => {
  let component: QuarteringDumpComponent;
  let fixture: ComponentFixture<QuarteringDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarteringDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuarteringDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
