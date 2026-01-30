import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRolFormComponent } from './create-rol-form.component';

describe('CreateRolFormComponent', () => {
  let component: CreateRolFormComponent;
  let fixture: ComponentFixture<CreateRolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRolFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
