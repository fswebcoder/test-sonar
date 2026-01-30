import { Provider } from "@angular/core";
import { ScaleDashboardRepository } from "@/domain/repositories/scale/dashboard/scale-dashboard.repository";
import { ScaleDashboardRepositoryImp } from "@/infrastructure/repositories/scale/dashboard/scale-dashboard.repository-imp";

export default function scaleDashboardProvider(): Provider[] {
  return [
    {
      provide: ScaleDashboardRepository,
      useClass: ScaleDashboardRepositoryImp
    },
  ];
}
