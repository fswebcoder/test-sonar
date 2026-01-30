import { IMineEntity } from "./mine.entity";

export interface IUpdateMineParamsEntity
  extends Partial<Pick<IMineEntity, "name">>,
    Pick<IMineEntity, "id"> {}
