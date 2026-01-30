import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownButtonComponent, DropdownItem } from './dropdown-button.component';

describe('DropdownButtonComponent', () => {
  let component: DropdownButtonComponent;
  let fixture: ComponentFixture<DropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label correctly', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    
    const labelElement = fixture.nativeElement.querySelector('.dropdown-label');
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should toggle dropdown when clicked', () => {
    const button = fixture.nativeElement.querySelector('.dropdown-button-main');
    
    expect(component.isOpen()).toBe(false);
    
    button.click();
    fixture.detectChanges();
    
    expect(component.isOpen()).toBe(true);
    
    button.click();
    fixture.detectChanges();
    
    expect(component.isOpen()).toBe(false);
  });

  it('should not toggle dropdown when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('.dropdown-button-main');
    button.click();
    fixture.detectChanges();
    
    expect(component.isOpen()).toBe(false);
  });

  it('should emit itemClick event when item is clicked', () => {
    const testItem: DropdownItem = {
      label: 'Test Item',
      command: () => {}
    };
    
    component.items = [testItem];
    component.isOpen.set(true);
    fixture.detectChanges();
    
    const spy = spyOn(component.itemClick, 'emit');
    const itemElement = fixture.nativeElement.querySelector('.dropdown-item');
    
    itemElement.click();
    
    expect(spy).toHaveBeenCalledWith(testItem);
  });

  it('should close dropdown when clicking outside', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    
    expect(component.isOpen()).toBe(true);
    
    // Simular clic fuera del componente
    const event = new Event('click');
    Object.defineProperty(event, 'target', {
      value: document.createElement('div')
    });
    
    component.onDocumentClick(event);
    
    expect(component.isOpen()).toBe(false);
  });

  it('should not close dropdown when clicking inside', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    
    expect(component.isOpen()).toBe(true);
    
    // Simular clic dentro del componente
    const event = new Event('click');
    const mockElement = document.createElement('div');
    mockElement.className = 'svi-dropdown-button';
    Object.defineProperty(event, 'target', {
      value: mockElement
    });
    
    component.onDocumentClick(event);
    
    expect(component.isOpen()).toBe(true);
  });
}); 