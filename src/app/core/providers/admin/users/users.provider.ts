import { UsersRepository } from "@/domain/repositories/admin/users/users.repository";
import { UsersRepositoryImp } from "@/infrastructure/repositories/admin/users/users.respository-imp";
import { Provider } from "@angular/core";

export function usersProvider(): Provider[] {
    return [
        {
            provide: UsersRepository,
            useClass: UsersRepositoryImp
        }
    ]
}