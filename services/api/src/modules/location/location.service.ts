import { Injectable } from '@nestjs/common';
import { ILocationProvider } from './interfaces/location-provider.interface';
import { GooglePlacesProvider } from './providers/google-places.provider';
import { GeoNamesProvider } from './providers/geonames.provider';
import { OpenStreetMapProvider } from './providers/openstreetmap.provider';

@Injectable()
export class LocationService {
  private activeProvider: ILocationProvider;

  constructor(
    private readonly googleProvider: GooglePlacesProvider,
    private readonly geoNamesProvider: GeoNamesProvider,
    private readonly osmProvider: OpenStreetMapProvider,
  ) {
    // Defaulting to Google Places
    this.activeProvider = this.googleProvider;
  }

  setProvider(providerName: 'google' | 'geonames' | 'osm') {
    if (providerName === 'google') this.activeProvider = this.googleProvider;
    else if (providerName === 'geonames') this.activeProvider = this.geoNamesProvider;
    else if (providerName === 'osm') this.activeProvider = this.osmProvider;
  }

  async searchPlaces(query: string, type?: string) {
    return this.activeProvider.searchPlaces(query, type);
  }

  async getPlaceDetails(placeId: string) {
    return this.activeProvider.getPlaceDetails(placeId);
  }

  async reverseGeocode(lat: number, lng: number) {
    return this.activeProvider.reverseGeocode(lat, lng);
  }
}
