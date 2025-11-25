import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FoodPost } from 'src/entities/foodpost.entity';

@Entity('delivery_post')
export class DeliveryPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodpost_id: number;

  @ManyToOne(() => FoodPost)
  @JoinColumn({ name: 'foodpost_id' })
  foodpost: FoodPost;

  @Column({ nullable: true })
  rider_id: number;

  @Column({ nullable: true })
  recipient_id: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;
}
