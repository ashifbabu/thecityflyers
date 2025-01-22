export type TripType = 'oneWay' | 'roundTrip' | 'multiCity';

export interface FlightSearchError {
  field: string;
  message: string;
}