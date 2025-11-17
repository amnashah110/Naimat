import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService
{
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async findbyemail(email: string)
    {
        return await this.userRepo.findOne({where: {email}});
    }

    async findById(id: number)
    {
        return await this.userRepo.findOne({where: {id}});
    }

    async createUser(user)
    {
        return this.userRepo.save(user);
    }

    async updateuser(user: UpdateUserDto)
    {
        const { id, ...updateData } = user;

        const result = await this.userRepo.update(id, updateData);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID "${id}" not found.`);
        }

        return this.userRepo.findOneBy({ id });
    }
}
