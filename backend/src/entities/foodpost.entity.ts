import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'foodpost' })
export class FoodPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true })
  donor_id: number | null;

  @Column({ type: 'integer', nullable: true })
  recipient_id: number | null;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({ type: 'text', nullable: true })
  picture_url: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  posting_date: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date: string | null;

  @Column({ type: 'date', nullable: true })
  pickup_date: string | null;

  @Column({ type: 'varchar', length: 20 })
  category: string;

  @Column({ type: 'integer', nullable: true })
  rider_id: number | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  special_instructions: string | null;

  @Column({ type: 'text', nullable: true })
  contact_details: string | null;

  @Column({ type: 'text', nullable: true })
  llm_response: string | null;
}
