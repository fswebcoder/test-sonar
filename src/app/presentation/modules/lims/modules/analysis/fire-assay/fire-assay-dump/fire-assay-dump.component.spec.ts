import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireAssayDumpComponent } from './fire-assay-dump.component';

describe('FireAssayDumpComponent', () => {
  let component: FireAssayDumpComponent;
  let fixture: ComponentFixture<FireAssayDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireAssayDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FireAssayDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
