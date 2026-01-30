import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetallaDumpComponent } from './retalla-dump.component';

describe('RetallaDumpComponent', () => {
  let component: RetallaDumpComponent;
  let fixture: ComponentFixture<RetallaDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetallaDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetallaDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
