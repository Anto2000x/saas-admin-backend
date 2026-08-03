import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import{ TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

import { Product } from './modules/products/entities/product.entity';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      '.env',
      'C:/Users/anton/Desktop/saas-admin-backend/.env'
    ],
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product, Order, OrderItem],
      synchronize: true,
    }),

    AuthModule, UsersModule, ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
