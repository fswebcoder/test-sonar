import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoreCardComponent } from './dore-card.component';

describe('DoreCardComponent', () => {
  let component: DoreCardComponent;
  let fixture: ComponentFixture<DoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoreCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
