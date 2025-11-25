import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { DeliveryPostService } from './deliverypost.services';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';

@Controller('delivery-post')
export class DeliveryPostController {
  constructor(private service: DeliveryPostService) {}

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
}
