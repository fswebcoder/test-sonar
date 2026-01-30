import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeachwellDialogComponent } from './create-leachwell-form-dialog.component';

describe('CreateLeachwellDialogComponent', () => {
  let component: CreateLeachwellDialogComponent;
  let fixture: ComponentFixture<CreateLeachwellDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLeachwellDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLeachwellDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
