export type TripType = 'oneWay' | 'roundTrip' | 'multiCity';

// ✅ Handles errors during flight search
export interface FlightSearchError {
  field: string;
  message: string;
}

// ✅ Represents individual flight segments
export interface FlightSegment {
  Departure: {
    IATACode: string
    Terminal: string
    ScheduledTime: string
    AirportName: string
  }
  Arrival: {
    IATACode: string
    Terminal: string
    ScheduledTime: string
    AirportName: string
  }
  MarketingCarrier: {
    carrierDesigCode: string
    marketingCarrierFlightNumber: string
    carrierName: string
  }
  Duration: string
  CabinType: string
  SeatsRemaining?: number
}

// ✅ Defines the structure of flight search data
export interface FlightSearchData {  // Changed to export for reusability
  fromCity?: string;                 // Origin city name
  toCity?: string;                   // Destination city name
  departureDate?: Date;              // Departure date
  returnDate?: Date;                 // Return date (if applicable)
  travelers?: {                      // Travelers object for passenger details
    adults: number;                  // Number of adults (12+ years)
    kids: number;                    // Number of kids (2–5 years)
    children: number;                // Number of children (6–12 years)
    infants: number;                 // Number of infants (below 2 years)
    totalPassengers: number;         // Total passengers (calculated sum)
    travelClass: string;             // Travel class (e.g., Economy, Business)
  };
  flights?: FlightSegment[];         // Optional list of flight segments
}

