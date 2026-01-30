import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireAssaySmartComponent } from './fire-assay-smart.component';

describe('FireAssaySmartComponent', () => {
  let component: FireAssaySmartComponent;
  let fixture: ComponentFixture<FireAssaySmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireAssaySmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FireAssaySmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
