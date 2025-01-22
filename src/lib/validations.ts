import { TripType } from '@/types/flight';

interface Location {
  city: string;
  airportName: string;
}

interface FlightSegment {
  fromCity: string;
  fromAirport: string;
  toCity: string;
  toAirport: string;
  departureDate?: Date;
}

interface ValidationError {
  field: string;
  message: string;
}

export const validateFlightSearch = (
  tripType: TripType,
  data: {
    fromCity?: string;
    toCity?: string;
    departureDate?: Date;
    returnDate?: Date;
    travelers?: number;
    flights?: FlightSegment[];
  }
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Common validation for one-way and round-trip
  if (tripType === 'oneWay' || tripType === 'roundTrip') {
    if (!data.fromCity) {
      errors.push({ field: 'from', message: 'Departure location is required' });
    }
    if (!data.toCity) {
      errors.push({ field: 'to', message: 'Destination is required' });
    }
    if (data.fromCity && data.toCity && data.fromCity === data.toCity) {
      errors.push({ field: 'to', message: 'Departure and destination cannot be the same' });
    }
    if (!data.departureDate) {
      errors.push({ field: 'departureDate', message: 'Departure date is required' });
    }
    if (!data.travelers || data.travelers < 1) {
      errors.push({ field: 'travelers', message: 'At least one traveler is required' });
    }
    if (tripType === 'roundTrip') {
      if (!data.returnDate) {
        errors.push({ field: 'returnDate', message: 'Return date is required' });
      }
      if (data.departureDate && data.returnDate && data.returnDate < data.departureDate) {
        errors.push({ field: 'returnDate', message: 'Return date must be after departure date' });
      }
    }
  }

  // Multi-city validation
  if (tripType === 'multiCity') {
    if (!data.flights || data.flights.length < 2) {
      errors.push({ field: 'flights', message: 'At least two flight segments are required' });
      return errors; // Return early if no flights data
    }

    data.flights.forEach((flight, index) => {
      if (!flight.fromCity) {
        errors.push({
          field: `flights[${index}].from`,
          message: `Departure location is required for segment ${index + 1}`,
        });
      }
      if (!flight.toCity) {
        errors.push({
          field: `flights[${index}].to`,
          message: `Destination is required for segment ${index + 1}`,
        });
      }
      if (!flight.departureDate) {
        errors.push({
          field: `flights[${index}].departureDate`,
          message: `Departure date is required for segment ${index + 1}`,
        });
      }
      if (flight.fromCity && flight.toCity && flight.fromCity === flight.toCity) {
        errors.push({
          field: `flights[${index}].to`,
          message: `Departure and destination cannot be the same for segment ${index + 1}`,
        });
      }

      // Validate connecting flights (except for first segment)
      if (index > 0 && data.flights) { // Added `data.flights` check
        const previousFlight = data.flights[index - 1];
        if (previousFlight.toCity !== flight.fromCity) {
          errors.push({
            field: `flights[${index}].from`,
            message: `Departure must match previous destination for segment ${index + 1}`,
          });
        }
      }
    });
  }

  return errors;
};
