import { UserRole } from "src/modules/users/entities/user.enum";

export class UpdateUserDto{
    email?: string;
    password?: string;
    role?: UserRole;
}