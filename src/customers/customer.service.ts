import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./customer.entity.js";
import { Repository } from "typeorm/browser";
import { BadRequestException } from "@nestjs/common";
import { DataSource } from "typeorm/browser/data-source/index.js";

export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
        @InjectDataSource() private readonly dataSource: DataSource,
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

    async getCustomerById(id: string): Promise<Customer | null> {
        return this.customerRepo.findOne({ where: { customerId: id } });
    }
    async createCustomer(customer: Partial<Customer>): Promise<Customer> {
        const newCustomer = this.customerRepo.create(customer);
        return this.customerRepo.save(newCustomer);
    }

    async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer | null> {
        await this.customerRepo.update({ customerId: id }, customer);
        return this.getCustomerById(id);
    }
    async deleteCustomer(id: string): Promise<void> {
        const orderCount = await this.dataSource.query(
            `SELECT COUNT(*)::int AS count FROM orders WHERE customer_id = $1`,
            [id],
        );

        if (orderCount[0].count > 0) {
            throw new BadRequestException(
                `Cannot delete customer ${id}: they have ${orderCount[0].count} order(s).`,
            );
        }

        await this.customerRepo.delete({ customerId: id });
    }

}