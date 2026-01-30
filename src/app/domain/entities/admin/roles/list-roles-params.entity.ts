import { TPaginationParams } from "@SV-Development/utilities";

export interface IListRolesParamsEntity extends Pick<TPaginationParams, 'page' | 'limit'> {
    withDeleted?: boolean;
}