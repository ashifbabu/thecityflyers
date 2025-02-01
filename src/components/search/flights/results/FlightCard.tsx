'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FareFeaturesList } from '@/components/search/flights/results/FareFeaturesList';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase(),
    date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  };
};

const FlightSegment: React.FC<{ segment: any; type: 'outbound' | 'return'; }> = ({ segment, type }) => {
  const formattedDeparture = formatDate(segment?.From?.DepartureTime || '');
  const formattedArrival = formatDate(segment?.To?.ArrivalTime || '');
  
  return (
    <div className="py-4">
      <div className="text-sm font-medium mb-4">{type === 'outbound' ? 'Outbound' : 'Return'}</div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-base text-muted-foreground">{segment?.From?.Name || 'Unknown Airport'}</div>
          <div className="text-lg font-bold">{segment?.From?.Code || 'N/A'}</div>
          <div className="text-3xl font-bold">{formattedDeparture.time || 'N/A'}</div>
        </div>
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="text-sm text-muted-foreground">{segment?.Duration || 'N/A'}</div>
          <div className="w-full h-px bg-border relative my-2">
            <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">Direct</div>
        </div>
        <div className="text-right">
          <div className="text-base text-muted-foreground">{segment?.To?.Name || 'Unknown Airport'}</div>
          <div className="text-lg font-bold">{segment?.To?.Code || 'N/A'}</div>
          <div className="text-3xl font-bold">{formattedArrival.time || 'N/A'}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">{formattedDeparture.date || 'N/A'}</div>
    </div>
  );
};

const FlightCard: React.FC<{ offer: any }> = ({ offer }) => {
  const segment = offer.Segments?.[0];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={segment?.Airline?.Logo || '/default-logo.png'} 
                  alt={segment?.Airline?.Name || 'Airline Logo'} 
                  className="w-12 h-12" 
                />
                <div>
                  <div className="font-semibold text-xl">
                    {segment?.Airline?.Name || 'Unknown Airline'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Flight {segment?.FlightNumber || 'N/A'}
                  </div>
                </div>
              </div>
              <div className={`text-sm font-medium ${offer.Refundable ? 'text-green-500' : 'text-red-500'}`}>
                {offer.Refundable ? 'Refundable' : 'Non-refundable'}
              </div>
            </div>
            
            <FlightSegment segment={segment} type="outbound" />
          </div>

          <div className="w-full lg:w-80 mt-6 lg:mt-0 lg:ml-6 lg:pl-6 lg:border-l">
            <Select defaultValue="economy">
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>

            <FareFeaturesList features={offer} />

            <div className="mt-6 pt-6 border-t">
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  {offer.Pricing?.[0]?.Currency || 'USD'} {offer.Pricing?.[0]?.Total?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Price per adult</div>
              </div>
              <Button size="lg" className="w-full">
                Select <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
