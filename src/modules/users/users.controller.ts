import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';

@Controller('users')
export class UsersController {
 constructor(private readonly usersService: UsersService) {}

 @Get()
 findAll() {
    return this.usersService.findAll();
 }

 @Get(':id')
  findOne(@Param('id')id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto){
    return this.usersService.update(id, dto)
  }

 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.usersService.delete(id);
}

}


