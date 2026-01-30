import IMill from '@/domain/entities/plant/milling/mill.entity';
import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { ButtonComponent } from '@/shared/components/form/button/button.component';
import { ICONS } from '@/shared/enums/general.enum';
import { EmillingStates } from '@/shared/enums/milling-states.enum';
import IVariable from '@/domain/entities/plant/milling/variable.entity';
import IEquipment from '@/domain/entities/plant/milling/equipments.entity';
import ILocation from '@/domain/entities/plant/milling/location.entity';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from 'primeng/tabs';

@Component({
  selector: 'svi-milling-card',
  standalone: true,
  imports: [CommonModule, Badge, ButtonComponent, Tabs, TabList, TabPanels, Tab, TabPanel],
  template: `
    <article class="management-card surface-card border-round-xl p-4 flex flex-column gap-4 shadow-2 w-full">
      <header class="management-card__header flex flex-column md:flex-row md:justify-content-between align-items-start gap-4 border-bottom-1 surface-border pb-3">
        <div class="management-card__title flex align-items-start gap-3">
          <i class="{{ ICONS.INDUSTRY }} management-card__icon"></i>
          <div class="management-card__heading flex flex-column gap-2">
            <h3 class="management-card__name">{{ mill().mill.name }}</h3>
            <span class="management-card__hint">Administra las lecturas y operaciones asociadas.</span>
          </div>
        </div>

  <div class="management-card__actions flex flex-wrap gap-3 justify-content-start md:justify-content-end w-full md:w-auto">
          @switch (mill().status) {
            @case (EMillingStates.INITIAL) {
              <div class="management-card__actions-group flex flex-wrap gap-2">
                <svi-button size="small" icon="{{ ICONS.CHECK }}" severity="secondary" (onClick)="operation('finish')">
                  Finalizar
                </svi-button>
                <svi-button size="small" icon="{{ ICONS.STOP }}" severity="danger" (onClick)="operation('stop')">
                  Detener
                </svi-button>
              </div>
            }
            @case (EMillingStates.STOPPED) {
              <svi-button severity="primary" size="small" icon="{{ ICONS.PLAY }}" (onClick)="operation('start')">
                Iniciar
              </svi-button>
            }
            @case (EMillingStates.FINISHED) {}
            @default {
              <svi-button size="small" icon="{{ ICONS.ADD }}" (onClick)="operation('add')">
                Asignar lote
              </svi-button>
            }
          }
        </div>
      </header>

      <div class="management-card__meta flex align-items-center justify-content-between flex-wrap gap-3">
        @if (mill().batch.id && mill().batch.name) {
          <span class="management-card__badge">Lote: {{ mill().batch.name }}</span>
        } @else {
          <span class="management-card__badge management-card__badge--empty">Sin lote asignado</span>
        }
        <p-badge class="management-card__status" [severity]="getMillingStateColor" [value]="getMillingStateLabel"></p-badge>
      </div>

      <section class="management-card__body flex flex-column gap-4">
        @if (!equipmentList().length) {
          <p class="management-card__empty">
            @if (mill().status === EMillingStates.STOPPED) {
              La molienda debe estar en curso para poder editar las variables.
            } @else {
              Asigna un lote al molino para habilitar la edición de variables.
            }
          </p>
        } @else {
          <p-tabs
            class="equipment-tabs"
            [value]="activeEquipmentTab() ?? firstEquipmentTab()"
            (valueChange)="onEquipmentTabChange($event)"
            [scrollable]="true"
          >
            <p-tablist>
              @for (equipment of equipmentList(); track equipment.id ?? equipment.name ?? $index; let eqIndex = $index) {
                <p-tab [value]="equipmentTabValue(equipment, eqIndex)">
                  {{ equipment.name || 'Equipo' }}
                </p-tab>
              }
            </p-tablist>
            <p-tabpanels>
              @for (equipment of equipmentList(); track equipment.id ?? equipment.name ?? $index; let eqIndex = $index) {
                <p-tabpanel [value]="equipmentTabValue(equipment, eqIndex)">
                  <section class="equipment-panel flex flex-column gap-4">
                    <header class="equipment-panel__header flex justify-content-between align-items-start gap-3 pb-2 border-bottom-1 border-dashed surface-border">
                      <div class="equipment-panel__title flex align-items-start gap-3">
                        <i class="{{ ICONS.WRENCH }} equipment-panel__icon"></i>
                        <div class="equipment-panel__heading flex flex-column gap-1">
                          <h4 class="equipment-panel__name">{{ equipment.name || 'Equipo' }}</h4>
                          @if (equipment.description) {
                            <small class="equipment-panel__description">{{ equipment.description }}</small>
                          }
                        </div>
                      </div>
                      <span class="equipment-panel__meta">{{ locations(equipment).length }} ubicaciones</span>
                    </header>

                    @if (locations(equipment).length) {
                      <div class="flex flex-column gap-4">
                        @for (location of locations(equipment); track location.id ?? location.name ?? $index) {
                          <section class="location-group flex flex-column gap-3 py-3 border-bottom-1 border-dashed surface-border">
                            <header class="flex align-items-center justify-content-between gap-3 flex-wrap">
                              <div class="flex align-items-center gap-2">
                                <i class="{{ ICONS.LOCATION_DOT }} location-group__icon"></i>
                                <h5 class="m-0 text-base font-semibold">{{ location.name || 'Ubicación' }}</h5>
                              </div>
                              <span class="text-sm text-color-secondary">
                                {{ variables(location).length }} variables
                              </span>
                            </header>

                            @if (variables(location).length) {
                              <div class="flex flex-wrap align-items-center gap-2">
                                @for (variable of variables(location); track variable.id ?? variable.name ?? $index) {
                                  <button
                                    type="button"
                                    class="variable-pill surface-ground border-1 border-round-3xl px-3 py-2 flex align-items-center gap-2"
                                    (click)="editVariable({ equipment, location, variable })"
                                    title="Editar {{ variable.name }}"
                                  >
                                    <span class="font-semibold">{{ variable.name }}</span>
                                    <span class="flex align-items-center gap-2 text-sm text-primary font-medium">
                                      <i class="{{ ICONS.LIST_CHECK }} variable-pill__icon"></i>
                                      Editar lectura
                                    </span>
                                  </button>
                                }
                              </div>
                            } @else {
                              <p class="location-empty">Sin variables configuradas.</p>
                            }
                          </section>
                        }
                      </div>
                    } @else {
                      <p class="location-empty">Sin ubicaciones configuradas.</p>
                    }
                  </section>
                </p-tabpanel>
              }
            </p-tabpanels>
          </p-tabs>
        }
      </section>
    </article>
  `,
  styleUrls: ['./milling-card.component.scss']
})
export class MillingCardComponent {
  ICONS = ICONS;
  EMillingStates = EmillingStates;

  mill = input.required<IMill>();

  onEditVariable = output<{ variable: IVariable; equipment: IEquipment; location: ILocation; mill: IMill }>();
  onOperation = output<{mill:IMill} & {
    operation: 'start' | 'stop' | 'finish' | 'add';
  }>();

  activeEquipmentTab = signal<string | null>(null);

  equipmentList = () => (this.mill().equipment ?? []) as IEquipment[];

  constructor() {
    effect(() => {
      const equipments = this.equipmentList();
      const current = this.activeEquipmentTab();

      if (!equipments.length && current !== null) {
        this.activeEquipmentTab.set(null);
        return;
      }

      if (!equipments.length) {
        return;
      }

      const values = equipments.map((equipment, index) => this.equipmentTabValue(equipment, index));
      const next = current && values.includes(current) ? current : values[0];

      if (next !== current) {
        this.activeEquipmentTab.set(next);
      }
    });

  }

  editVariable(selection: { variable: IVariable; equipment: IEquipment; location: ILocation }) {
    this.onEditVariable.emit({ ...selection, mill: this.mill() });
  }

  operation(action: 'start' | 'stop' | 'finish' | 'add') {
    this.onOperation.emit({ mill: this.mill(), operation: action });
  }

  get getMillingStateLabel() {
    switch (this.mill().status) {
      case EmillingStates.STOPPED:
        return 'Detenido';
      case EmillingStates.INITIAL:
        return 'En Proceso';
      case EmillingStates.FINISHED:
        return 'Finalizado';
      default:
        return 'Sin lote';
    }
  }

  get getMillingStateColor(): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (this.mill().status) {
      case EmillingStates.STOPPED:
        return 'warn';
      case EmillingStates.INITIAL:
        return 'info';
      case EmillingStates.FINISHED:
        return 'secondary';
      default:
        return 'contrast';
    }
  }

  onEquipmentTabChange(value: string | number) {
    const tabValue = value.toString();
    if (this.activeEquipmentTab() !== tabValue) {
      this.activeEquipmentTab.set(tabValue);
    }
  }

  equipmentTabValue(equipment: IEquipment, index: number) {
    const identifier = equipment.id ?? `idx-${index}`;
    return `equipment-${identifier}`;
  }

  locations(equipment: IEquipment) {
    return (equipment.location ?? []) as ILocation[];
  }

  variables(location: ILocation) {
    return (location.variables ?? []) as IVariable[];
  }

  firstEquipmentTab() {
    const equipments = this.equipmentList();
    return equipments.length ? this.equipmentTabValue(equipments[0], 0) : '';
  }
}
