import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { SmartScanInputComponent } from './smart-scan-input.component';

describe('SmartScanInputComponent', () => {
  let component: SmartScanInputComponent;
  let fixture: ComponentFixture<SmartScanInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartScanInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartScanInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should replace '/' with '-' for pasted/input values", fakeAsync(() => {
    fixture.componentRef.setInput('debounceTime', 0);
    component.isScanning.set(true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'ABC/DEF';
    input.dispatchEvent(new Event('input'));

    tick(0);
    fixture.detectChanges();

    expect(input.value).toBe('ABC-DEF');
    expect(component.value()).toBe('ABC-DEF');
  }));
});
