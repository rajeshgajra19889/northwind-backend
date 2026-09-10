import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Order } from '../orders/order.entity.js';
import { Product } from '../products/product.entity.js';

@Entity('order_details')
export class OrderDetail {
  @PrimaryColumn({ name: 'order_id', type: 'smallint' })
  orderId: number;

  @PrimaryColumn({ name: 'product_id', type: 'smallint' })
  productId: number;

  @Column({ name: 'unit_price', type: 'real', nullable: true })
  unitPrice: number;

  @Column({ name: 'quantity', type: 'smallint', nullable: true })
  quantity: number;

  @Column({ name: 'discount', type: 'real', nullable: true })
  discount: number;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;
}