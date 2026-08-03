import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { Not } from 'typeorm/browser';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]>{
        return this.userRepository.find({
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
            }
        });
    }

    findByEmail(email: string){
        return this.userRepository.findOne({ where: {email} });
    }


    async findOne(id: string):Promise<User | null>{
        const user = await this.userRepository.findOne({ where: {id},});

        if (!User) {
            throw new NotFoundException('User with id ${id} not found')
        }

        return user;
    }

    async create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);   
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
        }

        Object.assign(user, data);
        return this.userRepository.save(user);
    }

   async delete(id: string): Promise<User | null> {
        const user = await this.findOne(id);

        await this.userRepository.delete(id);

        return user;
    }


      
      





}
