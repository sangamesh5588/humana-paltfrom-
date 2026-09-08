import { Injectable, Logger } from '@nestjs/common';
import { ILocationProvider, PlaceDetails, PlaceResult } from '../interfaces/location-provider.interface';

@Injectable()
export class GooglePlacesProvider implements ILocationProvider {
  private readonly logger = new Logger(GooglePlacesProvider.name);

  async searchPlaces(query: string, _type?: string): Promise<PlaceResult[]> {
    this.logger.log(`Mocking Google Places search: ${query}`);
    return [
      {
        id: 'mock-google-place-1',
        description: `${query}, California, USA`,
        mainText: query,
        secondaryText: 'California, USA',
      },
    ];
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    this.logger.log(`Mocking Google Place details: ${placeId}`);
    return {
      id: placeId,
      name: 'Mock Place',
      formattedAddress: 'Mock Place Address, CA, USA',
      latitude: 37.7749,
      longitude: -122.4194,
      country: 'USA',
      state: 'California',
      city: 'San Francisco',
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<PlaceDetails> {
    this.logger.log(`Mocking Google Places reverse geocoding: ${lat}, ${lng}`);
    return {
      id: 'mock-rev-1',
      name: 'Mock Coordinate Place',
      formattedAddress: 'Mock Rev Address',
      latitude: lat,
      longitude: lng,
    };
  }
}
