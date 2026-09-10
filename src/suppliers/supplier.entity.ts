import { Entity, Column } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @Column({ name: 'supplier_id', primary: true, type: 'smallint' })
  supplierId: number;

  @Column({ name: 'company_name', length: 40 })
  companyName: string;

  @Column({ name: 'contact_name', length: 30, nullable: true })
  contactName: string;

  @Column({ name: 'contact_title', length: 30, nullable: true })
  contactTitle: string;

  @Column({ name: 'address', length: 60, nullable: true })
  address: string;

  @Column({ name: 'city', length: 15, nullable: true })
  city: string;

  @Column({ name: 'region', length: 15, nullable: true })
  region: string;

  @Column({ name: 'postal_code', length: 10, nullable: true })
  postalCode: string;

  @Column({ name: 'country', length: 15, nullable: true })
  country: string;

  @Column({ name: 'phone', length: 24, nullable: true })
  phone: string;

  @Column({ name: 'fax', length: 24, nullable: true })
  fax: string;

  @Column({ name: 'homepage', type: 'text', nullable: true })
  homepage: string;
}