import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity.js';
import { Category } from '../categories/category.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId: number;

  @Column({ name: 'product_name', length: 40 })
  productName: string;

  @Column({ name: 'supplier_id', type: 'smallint', nullable: true })
  supplierId: number;

  @Column({ name: 'category_id', type: 'smallint', nullable: true })
  categoryId: number;

  @Column({ name: 'quantity_per_unit', length: 20, nullable: true })
  quantityPerUnit: string;

  @Column({ name: 'unit_price', type: 'real', nullable: true })
  unitPrice: number;

  @Column({ name: 'units_in_stock', type: 'smallint', nullable: true })
  unitsInStock: number;

  @Column({ name: 'units_on_order', type: 'smallint', nullable: true })
  unitsOnOrder: number;

  @Column({ name: 'reorder_level', type: 'smallint', nullable: true })
  reorderLevel: number;

  @Column({ name: 'discontinued', type: 'smallint', default: 0 })
discontinued: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;


}