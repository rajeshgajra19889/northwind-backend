import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./employee.entity.js";
import { EmployeeController } from "./employee.controller.js";
import { EmployeeService } from "./employee.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService]
})
export class EmployeeModule { }
