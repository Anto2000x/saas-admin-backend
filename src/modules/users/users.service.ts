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

    async findOne(id: string):Promise<User | null>{
        const user = await this.userRepository.findOne({ where: {id},});

        if (!User) {
            throw new NotFoundException('User with id ${id} not found')
        }

        return user;
    }

    async create(dto: CreateUserDto):Promise<User> {
        const exists = await this.userRepository.findOne({ where: {email: dto.email}});

        if (exists){
            throw new BadRequestException('Email already in use');
        }
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async update(id: string, dto: UpdateUserDto):Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});

        if(!user) {
           throw new NotFoundException('User with id ${id} not found')
        }

        Object.assign(user, dto);
        return await this.userRepository.save(user);
    }

    async remove(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if(!user) {
            throw new NotFoundException('User with id ${id} not found')
        }

        await this.userRepository.remove;
        return user;
    }
      
      





}
