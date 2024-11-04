import { Address } from './address';

export interface Client {
  id: number;
  name: string;
  birthdate: Date;
  addresses: Address[];
}
