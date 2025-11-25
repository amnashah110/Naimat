import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { createReadStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPost } from '../entities/foodpost.entity';
import { User } from '../entities/user.entity';
import axios from 'axios';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmailService } from '../auth/strategies/passwordless-auth/services/email.service';

@Controller('donation')  // <-- defines /donation route
export class DonationController {
  constructor(
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
            // llm_response: will be filled after AI call                         // 7. llm response
            latitude: latitude ? parseFloat(latitude) : null,                     // 8. latitude
            longitude: longitude ? parseFloat(longitude) : null,                  // 9. longitude
            quantity: quantity ? parseInt(quantity) : null,                       // 10. quantity
            
            // Fields to leave empty/null:
            donor_id: req.user.id, // Set donor_id to logged-in user's id
            recipient_id: null,
            availability: true,
            pickup_date: null,
            rider_id: null,
          });

          const saved = await this.foodPostRepo.save(post);
          (response as any).foodPostId = saved.id;
          
          // Increment user's donation count
          try {
            await this.userRepo.increment({ id: req.user.id }, 'num_donations', 1);
          } catch (userErr) {
            console.error('Failed to increment user donation count:', userErr);
          }
          
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDonation(
    @Param('id') id: string,
    @Req() req
  ): Promise<{ success: boolean; message: string }> {
    const donationId = parseInt(id, 10);
    
    if (isNaN(donationId)) {
      throw new NotFoundException('Invalid donation ID');
    }

    // Find the donation
    const donation = await this.foodPostRepo.findOne({
      where: { id: donationId }
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    // Verify the logged-in user is the donor
    if (donation.donor_id !== req.user.id) {
      throw new ForbiddenException('You can only delete your own donations');
    }

    try {
      // Delete the image from Azure Blob Storage if it exists
      if (donation.picture_url) {
        try {
          // Extract blob name from the URL
          // Expected format: https://<account>.blob.core.windows.net/<container>/<blobname>?<sas>
          const connStr = process.env.BLOB_CONNECTION_STRING;
          if (connStr) {
            const url = new URL(donation.picture_url.split('?')[0]); // Remove SAS token
            const pathParts = url.pathname.split('/').filter(p => p);
            
            if (pathParts.length >= 2) {
              const containerName = pathParts[0];
              const blobName = pathParts.slice(1).join('/');
              
              // Create BlobServiceClient
              const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
              const containerClient = blobServiceClient.getContainerClient(containerName);
              const blockBlobClient = containerClient.getBlockBlobClient(blobName);
              
              await blockBlobClient.deleteIfExists();
            }
          }
        } catch (blobErr) {
          // Log blob deletion error but continue with database deletion
          console.error('Error deleting blob:', blobErr);
        }
      }

      // Delete the donation from database
      await this.foodPostRepo.remove(donation);

      // Decrement the user's donation counter
      await this.userRepo.decrement({ id: req.user.id }, 'num_donations', 1);

      return {
        success: true,
        message: 'Donation deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw new Error('Failed to delete donation');
    }
  }

  @Post('mark-delivered/:id')
  @UseGuards(JwtAuthGuard)
  async markAsDelivered(
    @Param('id') id: string,
    @Req() req
  ): Promise<{ success: boolean; message: string }> {
    const donationId = parseInt(id, 10);
    
    if (isNaN(donationId)) {
      throw new NotFoundException('Invalid donation ID');
    }

    // Find the donation
    const donation = await this.foodPostRepo.findOne({
      where: { id: donationId }
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    // Verify the logged-in user is the donor
    if (donation.donor_id !== req.user.id) {
      throw new ForbiddenException('You can only mark your own donations as delivered');
    }

    try {
      // Delete the image from Azure Blob Storage if it exists
      if (donation.picture_url) {
        try {
          // Extract blob name from the URL
          const connStr = process.env.BLOB_CONNECTION_STRING;
          if (connStr) {
            const url = new URL(donation.picture_url.split('?')[0]); // Remove SAS token
            const pathParts = url.pathname.split('/').filter(p => p);
            
            if (pathParts.length >= 2) {
              const containerName = pathParts[0];
              const blobName = pathParts.slice(1).join('/');
              
              // Create BlobServiceClient
              const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
              const containerClient = blobServiceClient.getContainerClient(containerName);
              const blockBlobClient = containerClient.getBlockBlobClient(blobName);
              
              await blockBlobClient.deleteIfExists();
            }
          }
        } catch (blobErr) {
          // Log blob deletion error but continue with database deletion
          console.error('Error deleting blob:', blobErr);
        }
      }

      // Delete the donation from database
      await this.foodPostRepo.remove(donation);

      // Increment the user's successful donations counter
      await this.userRepo.increment({ id: req.user.id }, 'num_donations_success', 1);

      return {
        success: true,
        message: 'Donation marked as delivered successfully'
      };
    } catch (error) {
      console.error('Error marking donation as delivered:', error);
      throw new Error('Failed to mark donation as delivered');
    }
  }

  @Post('notify-donor/:donationId')
  @UseGuards(JwtAuthGuard)
  async notifyDonor(
    @Param('donationId') donationId: string,
    @Body() body: { recipientName: string; recipientEmail: string; recipientContact: string },
    @Req() req
  ) {
    try {
      console.log('Notify donor request received:', { donationId, body, userId: req.user?.id });
      
      const id = parseInt(donationId, 10);
      if (isNaN(id)) {
        throw new BadRequestException('Invalid donation ID');
      }

      // Find the donation
      const donation = await this.foodPostRepo.findOne({ where: { id } });
      if (!donation) {
        throw new NotFoundException('Donation not found');
      }

      console.log('Donation found:', { id: donation.id, donor_id: donation.donor_id });

      if (!donation.donor_id) {
        throw new BadRequestException('Donation has no donor');
      }

      // Find the donor
      const donor = await this.userRepo.findOne({ where: { id: donation.donor_id } });
      if (!donor) {
        throw new NotFoundException('Donor not found');
      }

      console.log('Donor found:', { id: donor.id, email: donor.email, name: donor.name });

      // Send email to donor
      await this.emailService.sendRecipientDetailsToDonar(
        donor.email,
        donor.name,
        body.recipientName,
        body.recipientEmail,
        body.recipientContact
      );

      console.log('Email sent successfully to donor:', donor.email);

      return {
        success: true,
        message: 'Donor notified successfully'
      };
    } catch (error) {
      console.error('Error notifying donor:', error);
      throw new BadRequestException('Failed to notify donor: ' + error.message);
    }
  }

  @Post('add-to-index/:donationId')
  async addToSearchIndex(
    @Param('donationId') donationId: string
  ) {
    try {
      console.log('Adding donation to search index:', donationId);
      
      const id = parseInt(donationId, 10);
      if (isNaN(id)) {
        throw new BadRequestException('Invalid donation ID');
      }

      // Find the donation
      const donation = await this.foodPostRepo.findOne({ where: { id } });
      if (!donation) {
        throw new NotFoundException('Donation not found');
      }

      console.log('Found donation:', {
        id: donation.id,
        description: donation.description,
        llm_response: donation.llm_response ? 'present' : 'missing'
      });

      // Parse LLM response
      let llmData: any = {};
      try {
        llmData = donation.llm_response ? JSON.parse(donation.llm_response) : {};
      } catch (e) {
        console.error('Error parsing LLM response:', e);
      }

      const category = llmData.category || {};
      
      // Prepare document for Azure Search - ensure all arrays are valid
      const searchDocument = {
        id: id.toString(),
        caption: category.caption || donation.description || "No description",
        smart_tags: Array.isArray(category.smart_tags) && category.smart_tags.length > 0 
          ? category.smart_tags 
          : ["uncategorized"],
        ingredients: Array.isArray(category.ingredients) && category.ingredients.length > 0
          ? category.ingredients 
          : ["not specified"],
        azure_tags: Array.isArray(category.azure_tags) && category.azure_tags.length > 0
          ? category.azure_tags 
          : ["food"],
        storage: category.storage || "room temperature",
        allergens: Array.isArray(category.allergens) && category.allergens.length > 0
          ? category.allergens 
          : ["unknown"],
        meal_type: Array.isArray(category.meal_type) && category.meal_type.length > 0
          ? category.meal_type 
          : ["any"],
      };

      console.log('Prepared search document:', JSON.stringify(searchDocument, null, 2));

      // Call Azure Search API with correct payload structure
      const azureSearchUrl = 'https://naimat-ai-service.happybush-55cf3067.southeastasia.azurecontainerapps.io/upload_doc';
      
      console.log('Calling Azure Search API at:', azureSearchUrl);
      
      const payload = {
        documents: [searchDocument]
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(azureSearchUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30 seconds timeout
        validateStatus: function (status) {
          return status < 500; // Don't throw for 4xx errors, we'll handle them
        }
      });

      console.log('Azure Search API response status:', response.status);
      console.log('Azure Search API response data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: 'Successfully added to search index',
          azure_response: response.data
        };
      } else {
        console.error('Azure Search API error response:', response.data);
        throw new BadRequestException(
          'Azure Search API returned error: ' + JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error('Error adding to search index:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      const errorDetail = error.response?.data?.detail || error.message;
      throw new BadRequestException(
        'Failed to add to search index: ' + (typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail))
      );
    }
  }

  @Post('search')
  async searchDonations(
    @Body() body: { 
      query: string; 
      select?: string[]; 
      search_fields?: string[] 
    }
  ) {
    try {
      console.log('Search request received:', body);

      if (!body.query || body.query.trim().length === 0) {
        throw new BadRequestException('Search query is required');
      }

      // Call Azure Search API
      const azureSearchUrl = 'https://naimat-ai-service.happybush-55cf3067.southeastasia.azurecontainerapps.io/search';
      
      const payload = {
        query: body.query,
        select: body.select || ["id", "caption"],
        search_fields: body.search_fields || ["caption", "ingredients", "azure_tags", "smart_tags", "allergens", "meal_type"]
      };

      console.log('Calling Azure Search API with payload:', payload);
      
      const response = await axios.post(azureSearchUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('Azure Search API response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error searching donations:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      throw new BadRequestException(
        'Failed to search donations: ' + (error.response?.data?.detail || error.message)
      );
    }
  }
}
