import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customers/customer.entity.js';
import { Employee } from '../employees/employee.entity.js';

@Entity('orders')
export class Order {
  @Column({ name: 'order_id', primary: true })
  orderId: number;

  @Column({ name: 'customer_id', length: 5, nullable: true })
  customerId: string;

  @Column({ name: 'employee_id', type: 'smallint', nullable: true })
  employeeId: number;

  @Column({ name: 'order_date', type: 'timestamp', nullable: true })
  orderDate: string;

  @Column({ name: 'required_date', type: 'timestamp', nullable: true })
  requiredDate: string;

  @Column({ name: 'shipped_date', type: 'timestamp', nullable: true })
  shippedDate: string;

  @Column({ name: 'ship_via', type: 'smallint', nullable: true })
  shipVia: number;

  @Column({ name: 'freight', type: 'real', nullable: true })
  freight: number;

  @Column({ name: 'ship_name', length: 40, nullable: true })
  shipName: string;

  @Column({ name: 'ship_address', length: 60, nullable: true })
  shipAddress: string;

  @Column({ name: 'ship_city', length: 15, nullable: true })
  shipCity: string;

  @Column({ name: 'ship_region', length: 15, nullable: true })
  shipRegion: string;

  @Column({ name: 'ship_postal_code', length: 10, nullable: true })
  shipPostalCode: string;

  @Column({ name: 'ship_country', length: 15, nullable: true })
  shipCountry: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;
}