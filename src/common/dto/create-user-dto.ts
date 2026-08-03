import { UserRole } from "src/modules/users/entities/user.enum";

export class CreateUserDto {
  email!: string;
  password!: string;
  name!: string;
  role!: UserRole;
}