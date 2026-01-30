import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitPageComponent } from './split-page.component';

describe('SplitPageComponent', () => {
  let component: SplitPageComponent;
  let fixture: ComponentFixture<SplitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
