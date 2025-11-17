import { Injectable } from '@nestjs/common';

@Injectable()
export class DonationService {
  getDonations() {
    return ['donation1', 'donation2'];
  }
}
