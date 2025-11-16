import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../entities/user.entity';
import { Rider } from '../entities/rider.entity'; // Assuming the Rider entity path

// Define the allowed values for the ENUM columns
export enum FoodPostCategory {
    COOKED = 'cooked',
    RAW = 'raw',
    PACKAGED = 'packaged',
}

export enum FoodPostStatus {
    AVAILABLE = 'available',
    CLAIMED = 'claimed',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

export enum FoodPostUrgency {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@Entity('foodpost') // Explicitly map to the plural table name
export class Foodpost {

    @PrimaryGeneratedColumn()
    id: number;

    // --- FOREIGN KEY PROPERTIES ---

    @Column({ name: 'donor_id' }) // Store the ID value
    donorId: number; 

    @Column({ name: 'recipient_id', nullable: true })
    recipientId: number | null;

    @Column({ name: 'rider_id', nullable: true })
    riderId: number | null; 

    // --- RELATIONSHIPS ---

    // Donor (Many FoodPosts to One User)
   /* @ManyToOne(() => User, user => user.donatedPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'donor_id', referencedColumnName: 'id' })
    donor: User;

    // Recipient (Many FoodPosts to One User)
    @ManyToOne(() => User, user => user.claimedPosts, { nullable: true })
    @JoinColumn({ name: 'recipient_id', referencedColumnName: 'id' })
    recipient: User | null;

    // Rider (Many FoodPosts to One Rider)
    @ManyToOne(() => Rider, rider => rider.assignedPosts, { onDelete: 'SET NULL', nullable: true })
    // Join column links 'rider_id' in foodpost to 'user_id' (PK) in the Rider table
    @JoinColumn({ name: 'rider_id', referencedColumnName: 'user_id' }) 
    rider: Rider | null;
*/
    // --- SIMPLE COLUMNS ---

    @Column({ default: true })
    availability: boolean;

    @Column({ length: 500, nullable: true })
    picture_url: string | null; 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    posting_date: Date;

    @Column({ type: 'date', nullable: true })
    expiry_date: Date | null;

    @Column({ type: 'date', nullable: true })
    pickup_date: Date | null;
    
    // --- ENUM/CHECK COLUMNS ---

    @Column({
        type: 'enum',
        enum: FoodPostCategory,
        default: FoodPostCategory.COOKED,
    })
    category: FoodPostCategory;

    @Column({ 
        length: 255, 
        nullable: true 
    })
    tags: string | null;

    @Column({
        type: 'enum',
        enum: FoodPostStatus,
        default: FoodPostStatus.AVAILABLE,
    })
    status: FoodPostStatus;

    @Column({
        type: 'enum',
        enum: FoodPostUrgency,
        default: FoodPostUrgency.MEDIUM,
    })
    urgency: FoodPostUrgency;
}