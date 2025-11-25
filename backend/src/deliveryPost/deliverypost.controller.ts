import { Controller, Post, Get, Body, Query, UseGuards, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { DeliveryPostService } from './deliverypost.services';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPost } from '../entities/foodpost.entity';
import { User } from '../entities/user.entity';
import { EmailService } from '../auth/strategies/passwordless-auth/services/email.service';

@Controller('delivery-post')
export class DeliveryPostController {
  constructor(
    private service: DeliveryPostService,
    @InjectRepository(FoodPost) private readonly foodPostRepo: Repository<FoodPost>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  /**
   * Generate a SAS token for a blob URL
   */
  private generateSasUrl(blobUrl: string): string {
    try {
      const connStr = process.env.BLOB_CONNECTION_STRING;
      if (!connStr || !blobUrl) return blobUrl;

      // Parse connection string to get account name and key
      const accountNameMatch = connStr.match(/AccountName=([^;]+)/);
      const accountKeyMatch = connStr.match(/AccountKey=([^;]+)/);
      
      if (!accountNameMatch || !accountKeyMatch) return blobUrl;

      const accountName = accountNameMatch[1];
      const accountKey = accountKeyMatch[1];

      // Parse blob URL to get container and blob name
      const url = new URL(blobUrl);
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length < 2) return blobUrl;

      const containerName = pathParts[0];
      const blobName = pathParts.slice(1).join('/');

      // Create shared key credential
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

      // Set SAS token expiry to 24 hours from now
      const expiresOn = new Date();
      expiresOn.setHours(expiresOn.getHours() + 24);

      // Generate SAS token
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse('r'), // read-only
          expiresOn,
        },
        sharedKeyCredential
      ).toString();

      return `${blobUrl}?${sasToken}`;
    } catch (error) {
      console.error('Error generating SAS token:', error);
      return blobUrl; // Return original URL if SAS generation fails
    }
  }

  // 1. create entry
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any) {
    return this.service.createDelivery(body);
  }

  // 2. get all
  @Get('all')
  async findAll() {
    const deliveryPosts = await this.service.findAll();
    
    // Add SAS tokens to picture URLs and update llm_response.image_url with fresh SAS token
    const deliveryPostsWithSas = deliveryPosts.map(delivery => {
      if (delivery.foodpost) {
        const updatedFoodpost = { ...delivery.foodpost };
        
        // Update picture_url with fresh SAS token
        if (updatedFoodpost.picture_url) {
          updatedFoodpost.picture_url = this.generateSasUrl(updatedFoodpost.picture_url);
        }
        
        // Parse and update llm_response.image_url with fresh SAS token
        if (updatedFoodpost.llm_response) {
          try {
            const llmData = typeof updatedFoodpost.llm_response === 'string' 
              ? JSON.parse(updatedFoodpost.llm_response) 
              : updatedFoodpost.llm_response;
            
            if (llmData.image_url) {
              // Extract base URL (remove any existing SAS token)
              const baseUrl = llmData.image_url.split('?')[0];
              // Generate fresh SAS token
              llmData.image_url = this.generateSasUrl(baseUrl);
              // Store back as string
              updatedFoodpost.llm_response = JSON.stringify(llmData);
            }
          } catch (error) {
            console.error('Error updating llm_response image_url:', error);
          }
        }
        
        return {
          ...delivery,
          foodpost: updatedFoodpost,
        };
      }
      return delivery;
    });
    
    return deliveryPostsWithSas;
  }

  // 3. find by ANY field
  @Get('find')
  async find(@Query('field') field: string, @Query('value') value: string) {
    return this.service.findByField(field as any, value);
  }

  // 4. notify donor about volunteer
  @Post('notify-donor/:deliveryPostId')
  @UseGuards(JwtAuthGuard)
  async notifyDonorAboutVolunteer(
    @Param('deliveryPostId') deliveryPostId: string,
    @Body() body: { volunteerName: string; volunteerEmail: string; volunteerContact: string },
  ) {
    try {
      console.log('Notify donor about volunteer request received:', { deliveryPostId, body });
      
      const id = parseInt(deliveryPostId, 10);
      if (isNaN(id)) {
        throw new BadRequestException('Invalid delivery post ID');
      }

      // Find the delivery post with foodpost relation
      const deliveryPost = await this.service.findByField('id', id.toString());
      if (!deliveryPost || deliveryPost.length === 0) {
        throw new NotFoundException('Delivery post not found');
      }

      const delivery = deliveryPost[0];
      const foodpost = delivery.foodpost;

      if (!foodpost || !foodpost.donor_id) {
        throw new BadRequestException('Foodpost or donor not found');
      }

      console.log('Found delivery post and foodpost:', { 
        deliveryId: delivery.id, 
        foodpostId: foodpost.id, 
        donorId: foodpost.donor_id 
      });

      // Find the donor
      const donor = await this.userRepo.findOne({ where: { id: foodpost.donor_id } });
      if (!donor) {
        throw new NotFoundException('Donor not found');
      }

      console.log('Donor found:', { id: donor.id, email: donor.email, name: donor.name });

      // Send email to donor
      await this.emailService.sendVolunteerDetailsToDonor(
        donor.email,
        donor.name,
        body.volunteerName,
        body.volunteerEmail,
        body.volunteerContact
      );

      console.log('Email sent successfully to donor:', donor.email);

      return {
        success: true,
        message: 'Donor notified successfully about volunteer'
      };
    } catch (error) {
      console.error('Error notifying donor:', error);
      throw new BadRequestException('Failed to notify donor: ' + error.message);
    }
  }
}
