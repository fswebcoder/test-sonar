import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { WeightInputComponent } from './weight-input.component';

describe('WeightInputComponent', () => {
  let component: WeightInputComponent;
  let fixture: ComponentFixture<WeightInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightInputComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeightInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.label()).toBe('Peso');
    expect(component.unit()).toBe('Gr');
    expect(component.mask()).toBe('separator.1');
    expect(component.thousandSeparator()).toBe('.');
    expect(component.decimalMarker()).toBe(',');
  });

  it('should compute suffix correctly', () => {
    expect(component.suffix()).toBe(' Gr');
  });

  it('should implement ControlValueAccessor', () => {
    const mockFn = jasmine.createSpy('mockFn');
    
    component.registerOnChange(mockFn);
    component.registerOnTouched(mockFn);
    
    expect(component.onChangeFn).toBe(mockFn);
    expect(component.onTouchedFn).toBe(mockFn);
  });

  it('should validate control correctly', () => {
    const mockControl = new FormControl();
    const result = component.validate(mockControl);
    expect(result).toBeDefined();
  });
}); 