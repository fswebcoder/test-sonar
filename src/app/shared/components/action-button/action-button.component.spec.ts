import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionButtonComponent, ActionButtonConfig } from './action-button.component';
import { EActionSeverity } from '@/shared/enums/action-severity.enum';

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let fixture: ComponentFixture<ActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit actionClick event when button is clicked', () => {
    const config: ActionButtonConfig = { type: 'view' };
    component.config = config;
    fixture.detectChanges();

    const spy = spyOn(component.actionClick, 'emit');
    component.onButtonClick();

    expect(spy).toHaveBeenCalledWith('view');
  });

  it('should not emit event when button is disabled', () => {
    const config: ActionButtonConfig = { type: 'edit', disabled: true };
    component.config = config;
    fixture.detectChanges();

    const spy = spyOn(component.actionClick, 'emit');
    component.onButtonClick();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit event when button is loading', () => {
    const config: ActionButtonConfig = { type: 'delete', loading: true };
    component.config = config;
    fixture.detectChanges();

    const spy = spyOn(component.actionClick, 'emit');
    component.onButtonClick();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should allow overriding severity', () => {
    const config: ActionButtonConfig = { type: 'view', severity: EActionSeverity.DELETE };
    component.config = config;
    fixture.detectChanges();

    expect(component.buttonConfig.severity).toBe(EActionSeverity.DELETE);
  });
}); 