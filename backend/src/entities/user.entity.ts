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

    @Column({type: "integer", default: 0})
    num_donations: number;

    @Column({type: "integer", default: 0})
    num_volunteered: number;

    @Column({type: "integer", default: 0})
    num_donations_success: number;
}