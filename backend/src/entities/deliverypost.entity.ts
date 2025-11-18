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

  @Column()
  rider_id: number;

  @Column({ type: 'timestamp' })
  shipment_date: Date;
}
