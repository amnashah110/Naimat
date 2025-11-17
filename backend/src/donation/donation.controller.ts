import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { BlobServiceClient } from '@azure/storage-blob';
import { createReadStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPost } from '../entities/foodpost.entity';
import axios from 'axios';

@Controller('donation')  // <-- defines /donation route
export class DonationController {
  constructor(@InjectRepository(FoodPost) private readonly foodPostRepo: Repository<FoodPost>) {}
  @Get()
  getAllDonations() {
    return 'List of donations';
  }

  @Post('upload')
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
    @UploadedFile() file: any,
    @Body('foodType') foodType?: string,
    @Body('quantity') quantity?: string,
    @Body('address') address?: string,
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

    if (!address || address.trim().length < 5) {
      throw new BadRequestException('address is required');
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
      address,
      description,
      expiry: foodType === 'packaged' ? expiry : null,
      contact,
      specialInstructions: specialInstructions || null,
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
            donor_id: null,
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
