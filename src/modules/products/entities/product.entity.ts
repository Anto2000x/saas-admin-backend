
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column()
  stock!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrderItem, item => item.product)
  orderItems!: OrderItem[]
}
