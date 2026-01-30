import FireAssayRepository from "@/domain/repositories/lims/analysis/fire-assay.repository";
import FireAssayRepositoryImp from "@/infrastructure/repositories/lims/analysis/fire-assay.repository-imp";
import { Provider } from "@angular/core";

export default function fireAssayProvider():Provider []{
  return [
    {
      provide: FireAssayRepository,
      useClass: FireAssayRepositoryImp
    }
  ];
}
