import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoreSmartComponent } from './dore-smart.component';

describe('DoreSmartComponent', () => {
  let component: DoreSmartComponent;
  let fixture: ComponentFixture<DoreSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoreSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoreSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
