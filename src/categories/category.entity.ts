import {
    Entity,
    Column,
} from "typeorm"


@Entity('categories')
export class Category {
    @Column({ name: 'category_id', primary: true })
    categoryId: number

    @Column({ name: 'category_name', length: 15 })
    categoryName: string

    @Column({ name: 'description',type: 'text', nullable: true  })
    description: string

    @Column({ name: 'picture', type: 'bytea', nullable: true, select: false  })
    picture: Buffer

   
}