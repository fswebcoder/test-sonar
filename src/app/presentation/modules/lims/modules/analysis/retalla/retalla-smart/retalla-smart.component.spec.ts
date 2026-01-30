import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetallaSmartComponent } from './retalla-smart.component';

describe('RetallaSmartComponent', () => {
  let component: RetallaSmartComponent;
  let fixture: ComponentFixture<RetallaSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetallaSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetallaSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
