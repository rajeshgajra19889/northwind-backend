import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('employees')
export class Employee {
  @Column({ name: 'employee_id', primary: true })
  employeeId: number;

  @Column({ name: 'last_name', length: 20 })
  lastName: string;

  @Column({ name: 'first_name', length: 10 })
  firstName: string;

  @Column({ name: 'title', length: 30, nullable: true })
  title: string;

  @Column({ name: 'title_of_courtesy', length: 25, nullable: true })
  titleOfCourtesy: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate: Date;

  @Column({ name: 'address', length: 60, nullable: true })
  address: string;

  @Column({ name: 'city', length: 15, nullable: true })
  city: string;

  @Column({ name: 'region', length: 15, nullable: true })
  region: string;

  @Column({ name: 'postal_code', length: 10, nullable: true })
  postalCode: string;

  @Column({ name: 'country', length: 15, nullable: true })
  country: string;

  @Column({ name: 'home_phone', length: 24, nullable: true })
  homePhone: string;

  @Column({ name: 'extension', length: 4, nullable: true })
  extension: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'reports_to' })
  reportsToEmployee: Employee | null;

  @OneToMany(() => Employee, (employee) => employee.reportsToEmployee)
  reportsToEmployees: Employee[];

  @Column({ name: 'photo', type: 'bytea', nullable: true, select: false })
  photo: Buffer;

  @Column({ name: 'photo_path', length: 255, nullable: true })
  photoPath: string;
}
