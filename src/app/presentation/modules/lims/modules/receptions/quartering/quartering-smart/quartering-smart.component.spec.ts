import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarteringSmartComponent } from './quartering-smart.component';

describe('QuarteringSmartComponent', () => {
  let component: QuarteringSmartComponent;
  let fixture: ComponentFixture<QuarteringSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarteringSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuarteringSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
