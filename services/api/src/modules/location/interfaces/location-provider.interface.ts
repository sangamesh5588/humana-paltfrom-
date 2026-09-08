export interface PlaceResult {
  id: string;
  description: string;
  mainText: string;
  secondaryText?: string;
  types?: string[];
}

export interface PlaceDetails {
  id: string;
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  town?: string;
  village?: string;
  neighborhood?: string;
}

export interface ILocationProvider {
  searchPlaces(query: string, type?: string): Promise<PlaceResult[]>;
  getPlaceDetails(placeId: string): Promise<PlaceDetails>;
  reverseGeocode(lat: number, lng: number): Promise<PlaceDetails>;
}
