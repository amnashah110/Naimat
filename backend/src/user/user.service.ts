import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createuser.dto';

@Injectable()
export class UserService
{
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async findbyusername(username: string)
    {
        return this.userRepo.findOne({where: {username}});
    }

    async createUser(user)
    {
        return this.userRepo.save(user);
    }

    async findbyemail(email: string)
    {
        return await this.userRepo.findOne({where: {email}});
    }
}
