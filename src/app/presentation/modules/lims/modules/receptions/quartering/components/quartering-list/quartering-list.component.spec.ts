import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarteringListComponent } from './quartering-list.component';

describe('QuarteringListComponent', () => {
  let component: QuarteringListComponent;
  let fixture: ComponentFixture<QuarteringListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarteringListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuarteringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
