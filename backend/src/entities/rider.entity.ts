import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
//import { Location } from './location.entity';
import { Foodpost } from './foodpost.entity';

@Entity('rider')
export class Rider {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  // Rider's User relation (1:1)
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  active: boolean;

  // Rider's current location (optional)
  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_location_id' })
  currentLocation: Location | null;

}
