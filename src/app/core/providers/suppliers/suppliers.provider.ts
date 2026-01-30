import { SuppliersRepository } from "@/domain/repositories/admin/suppliers/suppliers.repository";
import { SuppliersRepositoryImpl } from "@/infrastructure/repositories/admin/suppliers/supliers.repository-imp";

export function suppliersProvider(){
    return [
        {
            provide: SuppliersRepository,
            useClass: SuppliersRepositoryImpl
        }
    ]
}