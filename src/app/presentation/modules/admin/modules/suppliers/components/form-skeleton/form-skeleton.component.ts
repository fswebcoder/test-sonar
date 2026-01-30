import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFormFieldCreateSupplierEntity } from '@/domain/entities/admin/suppliers/form-field-create-supplier.entity';

/**
 * Componente de skeleton dinámico para formularios que se adapta
 * automáticamente a los campos reales del formulario.
 * 
 * Características:
 * - Se construye dinámicamente basado en formFields
 * - Mantiene el mismo layout y distribución que el formulario real
 * - Incluye diferentes tipos de campos (text, select, number)
 * - Responsivo y consistente
 */
@Component({
  selector: 'svi-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid">
      @for (field of formFields(); track field.name) {
        @switch (field.type) {
          @case ('text') {
            @if(field.name === 'documentNumber') {
              <div class="col-12 md:col-4">
                <div class="skeleton-input">
                  <div class="skeleton-label"></div>
                  <div class="skeleton-field skeleton-text-right">
                    <div class="skeleton-text-right-indicator"></div>
                  </div>
                </div>
              </div>
            } @else {
              <div class="col-12 md:col-4">
                <div class="skeleton-input">
                  <div class="skeleton-label"></div>
                  <div class="skeleton-field"></div>
                </div>
              </div>
            }
          }
          @case ('select') {
            <div class="col-12 md:col-4">
              <div class="skeleton-input">
                <div class="skeleton-label"></div>
                <div class="skeleton-field skeleton-select">
                  <div class="skeleton-arrow"></div>
                </div>
              </div>
            </div>
          }
          @case ('number') {
            <div class="col-12 md:col-3">
              <div class="skeleton-input">
                <div class="skeleton-label"></div>
                <div class="skeleton-field skeleton-number">
                  <div class="skeleton-number-indicator"></div>
                </div>
              </div>
            </div>
          }
          @case ('email') {
            <div class="col-12 md:col-4">
              <div class="skeleton-input">
                <div class="skeleton-label"></div>
                <div class="skeleton-field skeleton-email">
                  <div class="skeleton-email-indicator"></div>
                </div>
              </div>
            </div>
          }
          @case ('textarea') {
            <div class="col-12">
              <div class="skeleton-input">
                <div class="skeleton-label"></div>
                <div class="skeleton-field skeleton-textarea"></div>
              </div>
            </div>
          }
          @default {
            <div class="col-12 md:col-4">
              <div class="skeleton-input">
                <div class="skeleton-label"></div>
                <div class="skeleton-field"></div>
              </div>
            </div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .skeleton-input {
      margin-bottom: 1rem;
      opacity: 0.9;
      
      .skeleton-label {
        height: 14px;
        width: 70%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        border-radius:10px;
        margin-bottom: 10px;
        opacity: 0.7;
      }
      
      .skeleton-field {
        height: 38px;
        width: 100%;
        background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        border-radius: 10px;
        border: 1px solid #dee2e6;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
        position: relative;
      }
      
      .skeleton-text-right {
        .skeleton-text-right-indicator {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #dee2e6;
          border-radius: 1px;
          opacity: 0.5;
        }
      }
      
      .skeleton-select {
        .skeleton-arrow {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 6px solid #dee2e6;
          opacity: 0.5;
        }
      }
      
      .skeleton-number {
        .skeleton-number-indicator {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #dee2e6;
          border-radius: 2px;
          opacity: 0.4;
          
          &::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 8px;
            height: 1px;
            background: #adb5bd;
            border-radius: 1px;
          }
          
          &::after {
            content: '';
            position: absolute;
            top: 5px;
            left: 2px;
            width: 8px;
            height: 1px;
            background: #adb5bd;
            border-radius: 1px;
          }
        }
      }
      
      .skeleton-email {
        .skeleton-email-indicator {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 16px;
          height: 12px;
          background: #dee2e6;
          border-radius: 2px;
          opacity: 0.4;
          
          &::before {
            content: '@';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 8px;
            color: #adb5bd;
            font-weight: bold;
          }
        }
      }
      
      .skeleton-textarea {
        height: 80px;
        resize: none;
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    @media (max-width: 768px) {
      .skeleton-input {
        .skeleton-label {
          width: 80%;
        }
      }
    }
  `]
})
export class FormSkeletonComponent {
  formFields = input.required<IFormFieldCreateSupplierEntity[]>();
} 