import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Employee } from "./employee.entity.js";
import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepo: Repository<Employee>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getEmployees(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number) {
        const offSet = (page - 1) * pageSize;
        const qb = this.employeeRepo.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.reportsToEmployee', 'reportsToEmployee');
        if (search) {
            qb.where('employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.title ILIKE :search',
                { search: `%${search}%` });
        }
        const allowedSort: Record<string, string> = {
            employeeId:'employee.employeeId',
            firstName: 'employee.firstName',
            lastName: 'employee.lastName',
            title: 'employee.title',
            city: 'employee.city',
            country: 'employee.country',
            reportsTo: 'reportsToEmployee.lastName',
        };
        const orderBy = allowedSort[sortBy] || 'employee.lastName';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');
        const total = await qb.getCount();
        const data = await qb.skip(offSet).take(pageSize).getMany();
        return { data, total, page, pageSize };
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        return this.employeeRepo.findOne({
            where: { employeeId: id },
            relations: { reportsToEmployee: true },
        });
    }

    async createEmployee(employee: Partial<Employee>): Promise<Employee> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(employee_id), 0) + 1 AS "nextId" FROM employees`,
        );
        const reportsToId = (employee as any).reportsTo;
        const newEmployee = this.employeeRepo.create({ ...employee, employeeId: nextId });
        if (reportsToId) {
            newEmployee.reportsToEmployee = { employeeId: reportsToId } as Employee;
        }
        return this.employeeRepo.save(newEmployee);
    }

    async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | null> {
        const reportsToId = (employee as any).reportsTo;
        if (reportsToId !== undefined) {
            employee.reportsToEmployee = reportsToId ? { employeeId: reportsToId } as Employee : null;
        }
        delete (employee as any).reportsTo;
        await this.employeeRepo.update({ employeeId: id }, employee);
        return this.getEmployeeById(id);
    }

    async deleteEmployee(id: number): Promise<void> {
        await this.dataSource.query(
            `DELETE FROM employee_territories WHERE employee_id = $1`,
            [id],
        );
        await this.employeeRepo.delete({ employeeId: id });
    }

    async getEmployeeTerritories(employeeId: number) {
        return this.dataSource.query(
            `SELECT t.territory_id AS "territoryId",
                    t.territory_description AS "territoryDescription",
                    r.region_description AS "regionName"
             FROM employee_territories et
             JOIN territories t ON t.territory_id = et.territory_id
             LEFT JOIN region r ON r.region_id = t.region_id
             WHERE et.employee_id = $1
             ORDER BY t.territory_description`,
            [employeeId],
        );
    }

    async getAvailableTerritories(employeeId: number) {
        return this.dataSource.query(
            `SELECT t.territory_id AS "territoryId",
                    t.territory_description AS "territoryDescription",
                    r.region_description AS "regionName"
             FROM territories t
             LEFT JOIN region r ON r.region_id = t.region_id
             WHERE NOT EXISTS (
                 SELECT 1 FROM employee_territories et
                 WHERE et.territory_id = t.territory_id AND et.employee_id = $1
             )
             ORDER BY t.territory_description`,
            [employeeId],
        );
    }

    async assignTerritory(employeeId: number, territoryId: string): Promise<void> {
        await this.dataSource.query(
            `INSERT INTO employee_territories (employee_id, territory_id)
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [employeeId, territoryId],
        );
    }

    async unassignTerritory(employeeId: number, territoryId: string): Promise<void> {
        await this.dataSource.query(
            `DELETE FROM employee_territories
             WHERE employee_id = $1 AND territory_id = $2`,
            [employeeId, territoryId],
        );
    }
}
