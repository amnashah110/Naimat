import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, nullable: false})
    name: string;

    @Column({length: 50, unique: true, nullable: false})
    username: string;

    @Column({length: 255, nullable: false})
    password_hash: string;

    @Column({length: 100, unique: true, nullable: false})
    email: string;

    @Column({length: 20})
    phone_number: string;
    
    @Column({
        type: "enum",
        enum: ["donor", "recipient", "volunteer"],
        default: "recipient",   // pick a sensible default if you want
        nullable: false
      })
      role: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;

    @Column({default: "Email"})
    auth_provider: string;
}