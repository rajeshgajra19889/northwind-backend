import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async getOverview() {
        const [statsRaw] = await this.dataSource.query(`
            SELECT
                (SELECT COUNT(*) FROM customers) AS customers,
                (SELECT COUNT(*) FROM products) AS products,
                (SELECT COUNT(*) FROM orders) AS orders,
                (SELECT COUNT(*) FROM employees) AS employees
        `);

        const salesOverview = await this.dataSource.query(`
            SELECT
                TO_CHAR(date_trunc('month', o.order_date), 'Mon YY') AS month,
                ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount))::numeric, 2)::float8 AS revenue
            FROM orders o
            JOIN order_details od ON od.order_id = o.order_id
            WHERE date_trunc('month', o.order_date) >= (
                SELECT date_trunc('month', MAX(order_date)) - INTERVAL '5 months'
                FROM orders
            )
            GROUP BY date_trunc('month', o.order_date)
            ORDER BY date_trunc('month', o.order_date)
        `);

        const orderStatus = await this.dataSource.query(`
            SELECT
                CASE
                    WHEN shipped_date IS NULL THEN 'Pending'
                    WHEN shipped_date > required_date THEN 'Late'
                    ELSE 'On Time'
                END AS status,
                COUNT(*) AS count
            FROM orders
            GROUP BY status
            ORDER BY count DESC
        `);

        const recentOrders = await this.dataSource.query(`
            SELECT
                o.order_id AS "orderId",
                c.company_name AS "customerName",
                TO_CHAR(o.order_date, 'YYYY-MM-DD') AS "orderDate",
                ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount))::numeric, 2)::float8 AS "total"
            FROM orders o
            JOIN customers c ON c.customer_id = o.customer_id
            JOIN order_details od ON od.order_id = o.order_id
            GROUP BY o.order_id, c.company_name, o.order_date
            ORDER BY o.order_date DESC
            LIMIT 5
        `);

        const topProducts = await this.dataSource.query(`
            SELECT
                p.product_name AS "productName",
                ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount))::numeric, 0)::int AS "revenue"
            FROM order_details od
            JOIN products p ON p.product_id = od.product_id
            GROUP BY p.product_name
            ORDER BY "revenue" DESC
            LIMIT 5
        `);

        const [ordersMonthRaw] = await this.dataSource.query(`
            SELECT
                (SELECT COUNT(*) FROM orders WHERE order_date >= date_trunc('month', CURRENT_DATE)) AS currentMonth,
                (SELECT COUNT(*) FROM orders
                    WHERE order_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                      AND order_date <  date_trunc('month', CURRENT_DATE)) AS prevMonth
        `);

        return {
            stats: {
                customers: statsRaw.customers,
                products: statsRaw.products,
                orders: statsRaw.orders,
                employees: statsRaw.employees,
                ordersMonthlyChange: ordersMonthRaw.prevMonth > 0
                    ? Math.round(((ordersMonthRaw.currentMonth - ordersMonthRaw.prevMonth) / ordersMonthRaw.prevMonth) * 100)
                    : null,
            },
            salesOverview,
            orderStatus,
            recentOrders,
            topProducts,
        };
    }
}