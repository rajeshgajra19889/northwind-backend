import { Entity, Column } from "typeorm";

@Entity('shippers')
export class Shipper {
    @Column({ name: 'shipper_id', primary: true, type: 'smallint' })
    shipperId: number;

    @Column({ name: 'company_name', length: 40 })
    companyName: string;

    @Column({ name: 'phone', length: 24, nullable: true })
    phone: string;
}