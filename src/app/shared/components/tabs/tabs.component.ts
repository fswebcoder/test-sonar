import { ChangeDetectionStrategy, Component, TemplateRef, computed, effect, input, output, signal } from "@angular/core";
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { TabsModule } from "primeng/tabs";

export type TabValue = string | number | null;
export interface TabTemplateContext<T> {
  $implicit: T;
  index: number;
  value: TabValue;
  isActive: boolean;
}

@Component({
  selector: "svi-tabs",
  standalone: true,
  imports: [TabsModule, NgForOf, NgIf, NgTemplateOutlet, NgClass],
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent<T = unknown> {
  tabs = input<readonly T[]>([]);
  value = input<TabValue | undefined>(undefined);
  scrollable = input<boolean>(true);
  containerClass = input<string>("");
  tabListClass = input<string>("");
  panelsClass = input<string>("");
  tabValueKey = input<string | null>("value");
  tabLabelKey = input<string | null>("label");
  tabValueFn = input<((tab: T, index: number) => TabValue | undefined) | null>(null);
  tabLabelFn = input<((tab: T, index: number) => string | undefined) | null>(null);
  trackByFn = input<((index: number, tab: T) => unknown) | null>(null);

  headerTemplate = input<TemplateRef<TabTemplateContext<T>> | null>(null);
  panelTemplate = input<TemplateRef<TabTemplateContext<T>> | null>(null);

  valueChange = output<TabValue>();

  private internalValue = signal<TabValue>(null);

  tabItems = computed(() => this.tabs() ?? []);

  currentValue = computed<TabValue>(() => {
    const explicit = this.value();
    if (explicit !== undefined && explicit !== null) {
      return explicit;
    }
    return this.internalValue();
  });

  constructor() {
    effect(() => {
      const tabs = this.tabItems();
      const explicit = this.value();
      const current = this.internalValue();

      if (explicit !== undefined && explicit !== null) {
        if (current !== explicit) {
          this.internalValue.set(explicit);
        }
        return;
      }

      if (!tabs.length) {
        if (current !== null) {
          this.internalValue.set(null);
        }
        return;
      }

      const matchesCurrent = current !== null && tabs.some((tab, index) => this.resolveValue(tab, index) === current);
      if (matchesCurrent) {
        return;
      }

      const fallback = this.resolveValue(tabs[0], 0);
      this.internalValue.set(fallback);
    });
  }

  handleValueChange(value: TabValue): void {
    this.internalValue.set(value);
    this.valueChange.emit(value);
  }

  resolveValue(tab: T, index: number): TabValue {
    const valueFn = this.tabValueFn();
    if (valueFn) {
      const resolved = valueFn(tab, index);
      if (resolved !== undefined && resolved !== null) {
        return resolved;
      }
    }

    const key = this.tabValueKey();
    if (key && this.hasProperty(tab, key)) {
      return (tab as Record<string, TabValue>)[key];
    }

    return index;
  }

  resolveLabel(tab: T, index: number): string {
    const labelFn = this.tabLabelFn();
    if (labelFn) {
      const resolved = labelFn(tab, index);
      if (resolved) {
        return resolved;
      }
    }

    const key = this.tabLabelKey();
    if (key && this.hasProperty(tab, key)) {
      return String((tab as Record<string, unknown>)[key] ?? "");
    }

    return `Tab ${index + 1}`;
  }

  trackTab = (index: number, tab: T) => {
    const trackFn = this.trackByFn();
    if (trackFn) {
      return trackFn(index, tab);
    }
    return this.resolveValue(tab, index) ?? index;
  };

  getHeaderTemplate(): TemplateRef<TabTemplateContext<T>> | null {
    return this.headerTemplate() ?? null;
  }

  getPanelTemplate(): TemplateRef<TabTemplateContext<T>> | null {
    return this.panelTemplate() ?? null;
  }

  createContext(tab: T, index: number): TabTemplateContext<T> {
    const value = this.resolveValue(tab, index);
    return {
      $implicit: tab,
      index,
      value,
      isActive: this.currentValue() === value
    };
  }

  private hasProperty(tab: T, prop: string): boolean {
    return !!tab && typeof tab === "object" && prop in (tab as object);
  }
}
