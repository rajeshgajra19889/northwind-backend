import { Entity, Column } from "typeorm";

@Entity('region')
export class Region {
    @Column({ name: 'region_id', primary: true, type: 'smallint' })
    regionId: number;

    @Column({ name: 'region_description', length: 60 })
    regionDescription: string;
}