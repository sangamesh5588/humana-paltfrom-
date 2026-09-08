import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { GooglePlacesProvider } from './providers/google-places.provider';
import { GeoNamesProvider } from './providers/geonames.provider';
import { OpenStreetMapProvider } from './providers/openstreetmap.provider';

@Module({
  providers: [
    LocationService,
    GooglePlacesProvider,
    GeoNamesProvider,
    OpenStreetMapProvider,
  ],
  exports: [LocationService],
})
export class LocationModule {}
