import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify, hash } from 'argon2';
import refreshConfig from 'src/auth/config/refresh.config';
import { User } from 'src/entities/user.entity';
import { LegacyCreateUserDto } from 'src/user/dto/legacycreateuser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>
    ) { }

    async signTokens(id: number) {
        return {
            id,
            jwtToken: this.jwtService.sign({ sub: id }),
            refreshToken: this.jwtService.sign({ sub: id }, this.refreshTokenConfig),
        };
    }

    async signup(user: LegacyCreateUserDto) {
        const createdUser = await this.userService.createUser({
            name: user.name,
            email: user.email,
            auth_provider: user.auth_provider || 'Email', // default to 'Email' if not provided
        });

        return {
            id: createdUser.id,
            jwt: this.jwtService.sign({ sub: createdUser.id }),
            refresh: this.jwtService.sign({ sub: createdUser.id }, this.refreshTokenConfig),
        };
    }

    async validate(username: string, password: string) {
        let user = await this.userService.findbyemail(username);

        if (!user)
            throw new UnauthorizedException("Error: Email doesn't exist!");

        if (user.auth_provider !== 'Email')
            throw new UnauthorizedException("Error: Invalid authentication provider!");

        // Note: Password validation removed as user entity no longer stores password_hash
        // This method is legacy and should be replaced with passwordless OTP authentication

        return user;
    }

    refresh(id: number) {
        let payload = { sub: id };

        let jwt = this.jwtService.sign(payload);

        return { id, jwt };
    }

    async validateGoogleUser(googleUser) {
        const user = await this.userService.findbyemail(googleUser.email);
        if (!user) return await this.userService.createUser(googleUser);
        if (user.auth_provider !== 'Google') throw new UnauthorizedException("Error: Invalid authentication provider!");

        return user;
    }

    async userinfofromemail(email: string): Promise<User> {
        let user = await this.userService.findbyemail(email);
        if (!user) throw new UnauthorizedException("Error: Email doesn't exist!");

        return user;
    }

    async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.userService.findbyemail(email);
        return !!user; // Returns true if user exists, false otherwise
    }
}