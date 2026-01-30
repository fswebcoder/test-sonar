import { QuarteringsReceptionsRepositoryImp } from "@/infrastructure/repositories/lims/receptions/quarterings-receptions.repository-imp";
import { QuarteringsReceptionRepository } from "@/domain/repositories/lims/receptions/quarterings/quarterings-reception.repository";

export function quarteringsReceptionsProvider() {
  return {
    provide: QuarteringsReceptionRepository,
    useClass: QuarteringsReceptionsRepositoryImp,
  }
}