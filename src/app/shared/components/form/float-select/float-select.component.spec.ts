import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatSelectComponent } from './float-select.component';

describe('FloatSelectComponent', () => {
  let component: FloatSelectComponent;
  let fixture: ComponentFixture<FloatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
