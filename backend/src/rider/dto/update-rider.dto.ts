export class UpdateRiderDto {
  userId: number; // PK, required
  active?: boolean;
  currentLocationId?: number | null;
}
