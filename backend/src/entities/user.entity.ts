import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')  // Specify the table name as 'users' (plural)
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, nullable: false})
    name: string;

    @Column({length: 100, unique: true, nullable: false})
    email: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;

    @Column({default: "Email"})
    auth_provider: string;
}