import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { createReadStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPost } from '../entities/foodpost.entity';
import axios from 'axios';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('donation')  // <-- defines /donation route
export class DonationController {
  constructor(@InjectRepository(FoodPost) private readonly foodPostRepo: Repository<FoodPost>) {}
  
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

  @Get()
  getAllDonations() {
    return 'List of donations';
  }

  @Get('available')
  async getAvailableDonations() {
    try {
      // Fetch all donations where availability is true
      const donations = await this.foodPostRepo.find({
        where: { availability: true },
        order: { posting_date: 'DESC' }, // Newest first
      });
      
      // Add SAS tokens to picture URLs
      const donationsWithSas = donations.map(donation => ({
        ...donation,
        picture_url: donation.picture_url ? this.generateSasUrl(donation.picture_url) : null,
      }));

      return donationsWithSas;
    } catch (error) {
      throw new BadRequestException('Failed to fetch donations');
    }
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  async getUserDonationStats(@Req() req) {
    try {
      const userId = req.user.id;
      
      // Get all donations by this user
      const donations = await this.foodPostRepo.find({
        where: { donor_id: userId },
        order: { posting_date: 'DESC' },
      });

      // Calculate statistics
      const totalDonations = donations.length;
      const activeDonations = donations.filter(d => d.availability).length;
      const completedDonations = donations.filter(d => !d.availability && d.pickup_date).length;

      // Group by category
      const categoryStats = donations.reduce((acc, donation) => {
        const category = donation.category || 'unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Monthly donations (last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      const monthlyData = donations
        .filter(d => new Date(d.posting_date) >= twelveMonthsAgo)
        .reduce((acc, donation) => {
          const month = new Date(donation.posting_date).toLocaleDateString('en-US', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

      return {
        totalDonations,
        activeDonations,
        completedDonations,
        categoryStats,
        monthlyData,
        recentDonations: donations.slice(0, 5).map(d => ({
          id: d.id,
          description: d.description,
          category: d.category,
          posting_date: d.posting_date,
          availability: d.availability,
        })),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch user donation stats');
    }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      // prefer memoryStorage to get file.buffer available
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
        if (allowedMime.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed (png, jpg, webp, avif)'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('foodType') foodType?: string,
    @Body('quantity') quantity?: string,
    @Body('expiry') expiry?: string,
    @Body('contact') contact?: string,
    @Body('specialInstructions') specialInstructions?: string,
    @Body('description') description?: string,
    @Body('latitude') latitude?: string,
    @Body('longitude') longitude?: string,
  ) {
    // Validate file
    if (!file) throw new BadRequestException('File is required');

    // Validate required form fields
    const allowedFoodTypes = ['cooked', 'raw', 'packaged'];
    if (!foodType || !allowedFoodTypes.includes(foodType)) {
      throw new BadRequestException(`foodType is required and must be one of: ${allowedFoodTypes.join(', ')}`);
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      throw new BadRequestException('quantity is required and must be a positive number');
    }

    // Validate latitude and longitude
    if (!latitude || !longitude) {
      throw new BadRequestException('latitude and longitude are required');
    }

    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      throw new BadRequestException('latitude and longitude must be valid numbers');
    }

    // expiry only required when packaged
    if (foodType === 'packaged') {
      if (!expiry || isNaN(Date.parse(expiry))) {
        throw new BadRequestException('expiry is required for packaged food and must be a valid date string');
      }
    }

    if (!contact || contact.trim().length < 3) {
      throw new BadRequestException('contact (phone or email) is required');
    }

    if (specialInstructions && specialInstructions.length > 500) {
      throw new BadRequestException('specialInstructions cannot exceed 500 characters');
    }

    if (description && description.length > 1000) {
      throw new BadRequestException('description cannot exceed 1000 characters');
    }

    const response = {
      file: { filename: file.filename, originalname: file.originalname, size: file.size, mimetype: file.mimetype },
      foodType,
      quantity: Number(quantity),
      description,
      expiry: foodType === 'packaged' ? expiry : null,
      contact,
      specialInstructions: specialInstructions || null,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    // Upload the file to Azure Blob Storage if connection string is provided
    const connStr = process.env.BLOB_CONNECTION_STRING;
    if (connStr) {
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerName = 'donations';
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const exists = await containerClient.exists();
        if (!exists) {
          await containerClient.create();
        }

        // Determine blob name
        const blobName = file.filename || `${Date.now()}-${(file.originalname || 'upload').split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9-_]/g, '_')}${extname(file.originalname || '')}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        if (file.buffer) {
          // memoryStorage: upload buffer directly
          await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
          });
        } else if (file.path) {
          // diskStorage fallback: stream from disk
          const stream = createReadStream(file.path);
          await blockBlobClient.uploadStream(stream, undefined, undefined, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
          });
        } else {
          throw new Error('Uploaded file has neither buffer nor path');
        }

        (response as any).blobUrl = blockBlobClient.url;
        // Save a FoodPost record with only specified fields
        try {
          const post = this.foodPostRepo.create({
            // Fields to fill:
            picture_url: blockBlobClient.url,                                    // 1. blob url
            description: description || null,                                     // 2. user provided title
            // posting_date: auto-filled by database default (now())             // 3. current timestamp
            expiry_date: null,                                                    // 4. will be updated from AI response
            category: foodType,                                                   // 5. category (cooked/raw/packaged)
            special_instructions: specialInstructions || null,                    // 6. special instructions
            contact_details: contact,                                             // 7. contact details
            // llm_response: will be filled after AI call                         // 8. llm response
            latitude: latitude ? parseFloat(latitude) : null,                     // 9. latitude
            longitude: longitude ? parseFloat(longitude) : null,                  // 10. longitude
            
            // Fields to leave empty/null:
            donor_id: req.user.id, // Set donor_id to logged-in user's id
            recipient_id: null,
            availability: true,
            pickup_date: null,
            rider_id: null,
          });

          const saved = await this.foodPostRepo.save(post);
          (response as any).foodPostId = saved.id;
          (response as any).foodPostId = saved.id;
          // Call LLM image analysis service
          try {
            const llmPayload = { blob_name: blobName, title: post.description, food_type: foodType };
            const llmRes = await axios.post('https://naimat-ai-service.happybush-55cf3067.southeastasia.azurecontainerapps.io/upload/upload_image', llmPayload, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 60000,
            });
            const llmData = llmRes.data;
            
            // Store full JSON string into llm_response
            saved.llm_response = JSON.stringify(llmData);
            
            // Update expiry_date from AI response if available
            if (llmData && llmData.expiry_date) {
              saved.expiry_date = llmData.expiry_date;
            }
            
            await this.foodPostRepo.save(saved);
            (response as any).llm_response = llmData;
          } catch (llmErr) {
            (response as any).llm_error = String(llmErr.message || llmErr);
          }
        } catch (e) {
          (response as any).dbError = String(e.message || e);
        }
      } catch (err) {
        (response as any).blobUploadError = String(err.message || err);
      }
    }


    return response;
  }
}
