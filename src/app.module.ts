import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customers/customers.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './products/products.module.js';
import { CategoryModule } from './categories/category.module.js';
import { SupplierModule } from './suppliers/suppliers.module.js';
import { EmployeeModule } from './employees/employees.module.js';
import { OrderModule } from './orders/orders.module.js';
import { OrderDetailModule } from './order-details/order-details.module.js';
import { RegionModule } from './regions/regions.module.js';
import { TerritoryModule } from './territories/territories.module.js';
import { ShipperModule } from './shippers/shippers.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DatabaseSeeder } from './database-seeder.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CustomerModule,
    ProductModule,
    CategoryModule,
    SupplierModule,
    EmployeeModule,
    OrderModule,
    OrderDetailModule,
    RegionModule,
    TerritoryModule,
    ShipperModule,
    DashboardModule
  ],
  providers: [DatabaseSeeder],
})
export class AppModule { }
