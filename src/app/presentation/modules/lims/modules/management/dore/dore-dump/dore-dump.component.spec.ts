import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoreDumpComponent } from './dore-dump.component';

describe('DoreDumpComponent', () => {
  let component: DoreDumpComponent;
  let fixture: ComponentFixture<DoreDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoreDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoreDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
