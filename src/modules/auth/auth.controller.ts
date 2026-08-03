import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from 'src/common/dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }
    @Post('logout')
    logout(@Req() req){
        const userId = req.user.sub;
        return this.authService.logout(userId);
    }
}
