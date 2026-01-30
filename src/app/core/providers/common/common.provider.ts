import { ActionsRepository } from '@/domain/repositories/common/actions.repository';
import { CatalogsRepository } from '@/domain/repositories/common/catalogs.repository';
import { CitiesRepository } from '@/domain/repositories/common/cities.repository';
import { DepartmentsRepository } from '@/domain/repositories/common/departments.repository';
import { PrintersRepository } from '@/domain/repositories/common/printers.repository';
import { SuppliersListRepository } from '@/domain/repositories/common/suppliers-list.repository';
import { ActionsRepositoryImp } from '@/infrastructure/repositories/common/actions.repository-imp';
import { CatalogsRepositoryImp } from '@/infrastructure/repositories/common/catalogs.repository-imp';
import { CitiesRepositoryImp } from '@/infrastructure/repositories/common/cities.repository-imp';
import { DepartmentsRepositoryImp } from '@/infrastructure/repositories/common/department.repository-imp';
import { PrintersRepositoryImp } from '@/infrastructure/repositories/common/printers.repository-imp';
import { SuppliersListRepositoryImp } from '@/infrastructure/repositories/common/suppliers-list.repository-imp';
import { Provider } from '@angular/core';

export function commonProvider(): Provider[] {
  return [
    {
      provide: SuppliersListRepository,
      useClass: SuppliersListRepositoryImp
    },
    {
      provide: DepartmentsRepository,
      useClass: DepartmentsRepositoryImp
    },
    {
      provide: CitiesRepository,
      useClass: CitiesRepositoryImp
    },
    {
      provide: CatalogsRepository,
      useClass: CatalogsRepositoryImp
    },
    {
      provide: PrintersRepository,
      useClass: PrintersRepositoryImp
    },
    {
      provide: ActionsRepository,
      useClass: ActionsRepositoryImp
    }
  ];
}
