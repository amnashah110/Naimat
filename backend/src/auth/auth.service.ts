import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify, hash } from 'argon2';
import refreshConfig from 'src/auth/config/refresh.config';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService
{
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>
    ) {}

    async login(username: string, password: string)
    {
        const user = await this.validate(username, password);

        return {
            id: user.id,
            jwt: this.jwtService.sign({ sub: user.id }),
            refresh: this.jwtService.sign({ sub: user.id }, this.refreshTokenConfig),
        };
    }

    async signup(user: CreateUserDto)
    {
        const password_hash = await hash(user.password);
        const { password, ...restuser } = user;
        const createdUser = await this.userService.createUser({ ...restuser, password_hash });

        return {
            id: createdUser.id,
            jwt: this.jwtService.sign({ sub: createdUser.id }),
            refresh: this.jwtService.sign({ sub: createdUser.id }, this.refreshTokenConfig),
        };
    }

    async validate(username: string, password: string)
    {
        const user = await this.userService.findbyusername(username);

        if (!user)
            throw new UnauthorizedException("Error: Username doesn't exist!");

        if (!await verify(user.password_hash, password))
            throw new UnauthorizedException("Error: Invalid password!");

        return user;
    }

    refresh(id: number)
    {
        let payload = { sub: id };

        let jwt = this.jwtService.sign(payload);

        return { id, jwt };
    }
}
