import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "./order.status.enum";

@Entity('orders')
export class Order{

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('decimal')
    total!: number;
    
    @Column({ type: 'enum', enum : OrderStatus })
    status!: OrderStatus;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User)
    user!: User;
}