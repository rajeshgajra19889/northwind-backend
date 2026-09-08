import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./customer.entity.js";
import { Repository } from "typeorm/browser";

export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
    ) { }

    async getCustomers(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number) {
        const offSet = (page - 1) * pageSize;
        const qb = this.customerRepo.createQueryBuilder('customer');
        if (search) {
            qb.where('customer.companyName ILIKE :search OR customer.contactName ILIKE :search',
                { search: `%${search}%` });
        }
        const allowedSort = ['companyName', 'contactName', 'city', 'country'];
        const orderBy = allowedSort.includes(sortBy) ? sortBy : 'companyName';
        qb.orderBy(`customer.${orderBy}`, sortOrder === 'desc' ? 'DESC' : 'ASC');
        const total = await qb.getCount();
        const data = await qb.skip(offSet).take(pageSize).getMany();
        return { data, total, page, pageSize };
    }

}