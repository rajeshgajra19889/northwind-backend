import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from '../regions/region.entity.js';

@Entity('territories')
export class Territory {
    @Column({ name: 'territory_id', primary: true, length: 20 })
    territoryId: string;

    @Column({ name: 'territory_description', length: 60 })
    territoryDescription: string;

    @Column({ name: 'region_id', type: 'smallint' })
    regionId: number;

    @ManyToOne(() => Region, { nullable: true })
    @JoinColumn({ name: 'region_id' })
    region: Region | null;
}