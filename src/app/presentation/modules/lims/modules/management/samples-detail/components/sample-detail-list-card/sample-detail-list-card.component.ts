import { Input, TemplateRef } from "@angular/core";

import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'svi-sample-list-card',
  standalone: true,
  imports: [CommonModule, TagModule, NgTemplateOutlet],
  templateUrl: './sample-detail-list-card.component.html',
  styleUrl: './sample-detail-list-card.component.scss'
})
export class SampleDetailListCard<T> {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) icon!: string;
  @Input() color: 'blue' | 'orange' | 'green' = 'blue';
  @Input({ required: true }) items: T[] = [];
  @Input() emptyMessage = 'Sin elementos';
  @Input() tagSeverity: "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined = 'info';
  @Input() itemTemplate!: TemplateRef<any>;
}

