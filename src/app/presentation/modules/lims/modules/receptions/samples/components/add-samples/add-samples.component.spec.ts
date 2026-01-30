import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSamplesComponent } from './add-samples.component';

describe('AddSamplesComponent', () => {
  let component: AddSamplesComponent;
  let fixture: ComponentFixture<AddSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
