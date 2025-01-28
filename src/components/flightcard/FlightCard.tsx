'use client';

import React from 'react';

interface Flight {
  Source: string;
  TraceId?: string;
  OfferId?: string;
  SearchId?: string;
  ResultId?: string;
  ValidatingCarrier?: string;
  Refundable: boolean;
  FareType: string;
  Pricing: any;
  Availability?: number;
  Segments: any[];
  BaggageAllowance?: { CheckIn?: { allowance?: string }[] }[];
}

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  if (!flight.Segments || flight.Segments.length === 0) {
    return <div className="p-4 text-red-500">No flight segment data available.</div>;
  }

  // Handle segment structure differences between BDFare and FlyHub
  const segment =
    flight.Segments[0]?.Segments?.[0] || // FlyHub nested segments
    flight.Segments[0]; // BDFare direct segments

  if (!segment || !segment.From || !segment.To) {
    return <div className="p-4 text-red-500">Invalid flight segment data.</div>;
  }

  const airline = segment.Airline;

  // ✅ Fix Pricing Extraction for BDFare & FlyHub
  const pricing = Array.isArray(flight.Pricing)
    ? flight.Pricing[0]?.Total || 0 // Extract BDFare pricing from array
    : flight.Pricing?.TotalFare || 0; // Use FlyHub pricing format

  // ✅ Extracting Baggage Information
  const baggageInfo =
    segment.Baggage ||
    flight.BaggageAllowance?.[0]?.CheckIn?.[0]?.allowance ||
    'N/A';

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
      {/* Airline Info */}
      <div className="flex items-center space-x-3">
        <img src={airline?.Logo || ''} alt={airline?.Name || 'Airline'} className="w-10 h-10 rounded-md" />
        <h2 className="text-lg font-semibold">{airline?.Name || 'Unknown Airline'} ({airline?.Code || 'N/A'})</h2>
      </div>

      {/* Flight Route */}
      <div className="flex justify-between items-center mt-4 border-b pb-2">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Departure</p>
          <p className="text-lg font-bold">{segment.From.Code || 'N/A'}</p>
          <p className="text-sm">{segment.From.Name || 'Unknown Airport'}</p>
          <p className="text-sm font-semibold">
            {segment.From.DepartureTime ? new Date(segment.From.DepartureTime).toLocaleString() : 'N/A'}
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Duration</p>
          <p className="text-lg font-bold">{segment.Duration || 'N/A'}</p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Arrival</p>
          <p className="text-lg font-bold">{segment.To.Code || 'N/A'}</p>
          <p className="text-sm">{segment.To.Name || 'Unknown Airport'}</p>
          <p className="text-sm font-semibold">
            {segment.To.ArrivalTime ? new Date(segment.To.ArrivalTime).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Pricing & Baggage */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Price</p>
          <p className="text-xl font-bold">{pricing.toLocaleString()} BDT</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Baggage</p>
          <p className="text-lg font-semibold">{baggageInfo}</p>
        </div>
      </div>

      {/* Refundable & Seats Info */}
      <div className="mt-4 flex justify-between">
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${flight.Refundable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {flight.Refundable ? "Refundable" : "Non-Refundable"}
        </span>
        {flight.Availability && (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {flight.Availability} Seats Remaining
          </span>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
