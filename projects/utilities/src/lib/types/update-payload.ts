import { DeepPartial } from './deep-partial';

export type UpdatePayload<T> = {
  id: string;
  input: DeepPartial<T>;
};
