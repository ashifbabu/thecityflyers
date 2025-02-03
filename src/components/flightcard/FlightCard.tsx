'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, ChevronRight, Luggage, Clock, CalendarDays, Utensils, Armchair, BaggageClaim, Receipt, Ban } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FlightSegment {
  From: {
    Code: string;
    Name: string;
    DepartureTime: string;
  };
  To: {
    Code: string;
    Name: string;
    ArrivalTime: string;
  };
  Airline: {
    Name: string;
    Code: string;
    Logo: string;
  };
  FlightNumber: string;
  CabinClass: string;
  Duration: string;
}

interface FlightOffer {
  Source: string;
  TraceId: string;
  OfferId: string;
  Segments: FlightSegment[];
  Pricing: Array<{
    PaxType: string;
    Currency: string;
    BaseFare: number;
    Tax: number;
    Total: number;
    VAT: number;
  }>;
  BaggageAllowance: Array<{
    From: string;
    To: string;
    CheckIn: Array<{
      paxType: string;
      allowance: string;
    }>;
    Cabin: Array<{
      paxType: string;
      allowance: string;
    }>;
  }>;
  Refundable: boolean;
  FareType: string;
  SeatsRemaining: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    time: date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase(),
    date: date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  };
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const FlightCard: React.FC<{ offer: FlightOffer }> = ({ offer }) => {
  const firstSegment = offer.Segments[0];
  const lastSegment = offer.Segments[offer.Segments.length - 1];
  const isMultiSegment = offer.Segments.length > 1;
  const totalDuration = offer.Segments.reduce((acc, segment) => {
    const duration = parseInt(segment.Duration.split(' ')[0]);
    return acc + duration;
  }, 0);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={firstSegment.Airline.Logo || "/placeholder.svg"} 
                  alt={firstSegment.Airline.Name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="font-semibold text-xl">{firstSegment.Airline.Name}</div>
                  <div className="text-sm text-muted-foreground">Flight {firstSegment.FlightNumber}</div>
                </div>
              </div>
              {offer.Refundable && (
                <span className="text-green-500 text-sm font-medium">Refundable</span>
              )}
            </div>

            {isMultiSegment && (
              <div className="text-sm font-medium mt-4">
                {offer.Segments.length - 1} Stop
              </div>
            )}

            <div className="mt-6">
              {isMultiSegment && <div className="text-sm mb-2">Outbound</div>}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-base text-muted-foreground">{firstSegment.From.Name}</div>
                  <div className="text-lg font-bold">{firstSegment.From.Code}</div>
                  <div className="text-3xl font-bold my-1">
                    {formatDate(firstSegment.From.DepartureTime).time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(firstSegment.From.DepartureTime).date}
                  </div>
                </div>

                <div className="flex flex-col items-center px-8">
                  <div className="text-sm text-muted-foreground">
                    {firstSegment.Duration} minutes
                  </div>
                  <div className="w-32 h-px bg-border relative my-2">
                    <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Direct
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base text-muted-foreground">{lastSegment.To.Name}</div>
                  <div className="text-lg font-bold">{lastSegment.To.Code}</div>
                  <div className="text-3xl font-bold my-1">
                    {formatDate(lastSegment.To.ArrivalTime).time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(lastSegment.To.ArrivalTime).date}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 mt-6 lg:mt-0 lg:border-l lg:pl-6">
            <Select defaultValue={firstSegment.CabinClass.toLowerCase()}>
              <SelectTrigger>
                <SelectValue placeholder={firstSegment.CabinClass} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Receipt className="w-4 h-4" />
                <span>Cancellation Fee starting undefined</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BaggageClaim className="w-4 h-4" />
                <span>Cabin Bag undefined</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Utensils className="w-4 h-4" />
                <span>Meal Beverage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>Pre Reserved Seat Assignment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Armchair className="w-4 h-4" />
                <span>Premium Seat</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Total)}
                </div>
                <div className="text-sm text-muted-foreground">Price per adult</div>
              </div>
              <Button size="lg" className="w-full bg-black text-white dark:bg-white dark:text-black">
                Select <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="flight-details" className="mt-6">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="flight-details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Flight Details
            </TabsTrigger>
            <TabsTrigger 
              value="fare-summary"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Fare Summary
            </TabsTrigger>
            <TabsTrigger 
              value="baggage"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Baggage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="flight-details" className="mt-4">
            <div className="space-y-6">
              {offer.Segments.map((segment, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div className="mb-4 sm:mb-0">
                    <div className="text-lg font-bold">{segment.From.Name}</div>
                    <div className="text-xl font-bold">
                      {formatDate(segment.From.DepartureTime).time}
                    </div>
                    <div className="text-lg font-bold">{segment.From.Code}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(segment.From.DepartureTime).date}
                    </div>
                  </div>

                  <div className="flex flex-col items-center px-4 mb-4 sm:mb-0">
                    <div className="text-sm text-muted-foreground mb-2">{segment.Duration}</div>
                    <div className="w-32 sm:w-48 h-px bg-border relative">
                      <Plane className="w-3 h-3 absolute -top-1.5 right-0 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {segment.Airline.Name} {segment.FlightNumber}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">{segment.To.Name}</div>
                    <div className="text-xl font-bold">
                      {formatDate(segment.To.ArrivalTime).time}
                    </div>
                    <div className="text-lg font-bold">{segment.To.Code}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(segment.To.ArrivalTime).date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fare-summary" className="mt-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>{offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].BaseFare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT</span>
                <span>{offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].VAT)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border mt-2 pt-2">
                <span>Total</span>
                <span>{offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Total)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="baggage" className="mt-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium mb-2">Check-in Baggage</h4>
                <p>{offer.BaggageAllowance[0].CheckIn[0].allowance}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cabin Baggage</h4>
                <p>{offer.BaggageAllowance[0].Cabin[0].allowance}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FlightCard;