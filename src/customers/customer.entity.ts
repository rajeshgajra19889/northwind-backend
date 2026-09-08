import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'country' })
  country: string;
}