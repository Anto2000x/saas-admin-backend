import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from 'src/common/dto';
import { UserRole } from '../users/entities/user.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

   async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(dto.email);
        if (userExists) {
         throw new BadRequestException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: UserRole.USER,
            refreshToken: null,
        });

     return user;
    }


    async login(dto: LoginDto){
        const user = await this.usersService.findByEmail(dto.email);
        if(!user)
        {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if(!passwordMatch){
            throw new UnauthorizedException('Invalid Credentials');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return { user, ...tokens};
    }

    async logout(userId: string){
        const user = await this.usersService.findOne(userId);

        if(!user){
            throw new ForbiddenException('User not found');
        }
        await this.usersService.update(userId, { refreshToken : null});
        
        return {message: 'Logged out succesfully!'};
    }

 async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token missing');
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const userId = payload.sub;

    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }


     async getTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }


      async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }



}
