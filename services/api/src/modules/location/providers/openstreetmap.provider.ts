import { Injectable, Logger } from '@nestjs/common';
import { ILocationProvider, PlaceDetails, PlaceResult } from '../interfaces/location-provider.interface';

@Injectable()
export class OpenStreetMapProvider implements ILocationProvider {
  private readonly logger = new Logger(OpenStreetMapProvider.name);

  async searchPlaces(query: string, _type?: string): Promise<PlaceResult[]> {
    this.logger.log(`Mocking OSM search: ${query}`);
    return [];
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    return {
      id: placeId,
      name: 'Mock OSM Place',
      formattedAddress: 'Mock OSM address',
      latitude: 0,
      longitude: 0,
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<PlaceDetails> {
    return {
      id: 'mock-osm-rev',
      name: 'OSM Coordinates',
      formattedAddress: 'OSM Coordinate Address',
      latitude: lat,
      longitude: lng,
    };
  }
}
