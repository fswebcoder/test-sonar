import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { formatSampleCode } from '@/core/utils/format-sample-code';
import ISampleDetailEntity from '@/domain/entities/lims/management/sample-detail.entity';
import { EWeightUnits } from '@/shared/enums/weight-units.enum';
import { formatWeight } from '@/core/utils/format-weight';
import { ButtonComponent } from "@/shared/components/form/button/button.component";

@Component({
  selector: 'svi-sample-details-general-information',
  imports: [AvatarModule, TagModule, DatePipe, ButtonComponent],
  templateUrl: './sample-details-general-information.component.html',
  styleUrl: './sample-details-general-information.component.scss'
})
export class SampleDetailsGeneralInformationComponent {
    formatSampleCode = formatSampleCode;
    sampleDetail = input<ISampleDetailEntity>();
    EWeightUnits = EWeightUnits;
  duplicateSample = output<void>();

    get getWeightReceived(): string {
    return formatWeight(this.sampleDetail()?.receivedWeight ?? 0);
  }

}
