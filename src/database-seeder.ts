import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
    private readonly logger = new Logger(DatabaseSeeder.name);

    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async onApplicationBootstrap(): Promise<void> {
        try {
            const [{ count }] = await this.dataSource.query(
                `SELECT COUNT(*)::int AS count FROM orders`,
            );
            if (count > 0) {
                this.logger.log(`Database already seeded (${count} orders), skipping.`);
                return;
            }
        } catch (error: any) {
            this.logger.warn(`Could not check orders table: ${error.message}`);
            return;
        }

        const filePath = join(process.cwd(), 'db', 'northwind.sql');
        if (!existsSync(filePath)) {
            this.logger.warn(`Seed file not found at ${filePath}, skipping seed.`);
            return;
        }

        this.logger.log('Seeding Northwind database...');
        const sql = readFileSync(filePath, 'utf8')
            .split('\n')
            .filter((line) => !line.trim().startsWith('\\'))
            .join('\n');

        try {
            await this.dataSource.query(`${sql}\nRESET search_path;`);
            this.logger.log('Northwind database seeded successfully.');
        } catch (error: any) {
            this.logger.error(`Database seeding failed: ${error.message}`);
        }
    }
}