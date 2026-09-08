import { Injectable, Logger } from '@nestjs/common';
import { ILocationProvider, PlaceDetails, PlaceResult } from '../interfaces/location-provider.interface';

@Injectable()
export class GeoNamesProvider implements ILocationProvider {
  private readonly logger = new Logger(GeoNamesProvider.name);

  async searchPlaces(query: string, _type?: string): Promise<PlaceResult[]> {
    this.logger.log(`Mocking GeoNames search: ${query}`);
    return [];
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    return {
      id: placeId,
      name: 'Mock GeoNames Place',
      formattedAddress: 'Mock GeoNames, Earth',
      latitude: 0,
      longitude: 0,
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<PlaceDetails> {
    return {
      id: 'mock-geo-rev-1',
      name: 'Mock Coordinates',
      formattedAddress: 'Mock Coordinate Address',
      latitude: lat,
      longitude: lng,
    };
  }
}
