'use client';

import React from 'react';

interface FlightCardProps {
  airlineName: string;
  flightNumber: string;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  price: string;
  airlineLogo: string;
  refundable: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({
  airlineName,
  flightNumber,
  departureAirport,
  departureTime,
  arrivalAirport,
  arrivalTime,
  duration,
  price,
  airlineLogo,
  refundable,
}) => {
  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-4">
        {airlineLogo && (
          <img src={airlineLogo} alt={airlineName} className="w-12 h-12 object-contain rounded-md" />
        )}
        <div>
          <p className="font-semibold text-lg">{airlineName} - {flightNumber}</p>
          <p className="text-gray-500 dark:text-gray-400">{departureTime} → {arrivalTime} ({duration})</p>
          <p className="text-gray-500 dark:text-gray-400">{departureAirport} → {arrivalAirport}</p>
          <p className={`text-sm ${refundable ? "text-green-600" : "text-red-500"}`}>
            {refundable ? "Refundable" : "Non-Refundable"}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">{price}</p>
        <button className="mt-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 transition">
          Select Flight
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
