import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "./customer.entity.js";
import { CustomerController } from "./customer.controller.js";
import { CustomerService } from "./customer.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService]
})

export class CustomerModule { }