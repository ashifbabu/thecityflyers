"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, ChevronRight, Luggage, BaggageClaim } from "lucide-react"

interface Carrier {
  carrierDesigCode: string
  marketingCarrierFlightNumber: string
  carrierName: string
}

interface Airport {
  IATACode: string
  Terminal: string | null
  ScheduledTime: string
  AirportName: string
  CityName: string
}

interface Segment {
  Departure: Airport
  Arrival: Airport
  MarketingCarrier: Carrier
  OperatingCarrier: Carrier
  Logo: string
  Duration: string
  FlightNumber: string
  SegmentGroup: number
  CabinType: string
  SeatsRemaining?: number
}

interface Pricing {
  PriceBreakdown: {
    Outbound: {
      totalPayable: {
        total: number;
        currency: string;
      };
    };
    Inbound: {
      totalPayable: {
        total: number;
        currency: string;
      };
    };
  };
}

interface MultiCityOffer {
  OutboundSegments: Segment[]
  InboundSegments?: Segment[]
  Pricing: Pricing
  Refundable: boolean
  ValidatingCarrier: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  }
}

const TripSegment: React.FC<{ segments: Segment[]; tripNumber: number }> = ({ segments, tripNumber }) => {
  const firstSegment = segments[0]
  const lastSegment = segments[segments.length - 1]

  return (
    <div>
      <div className="text-sm mb-2">Trip {tripNumber + 1}</div>
      <div className="p-4 border rounded-lg bg-muted/30">
        <div className="flex justify-between items-start">
          {/* Departure */}
          <div>
            <div className="font-bold text-lg">
              {firstSegment.Departure.CityName} ({firstSegment.Departure.IATACode})
            </div>
            <div className="text-sm text-muted-foreground">{firstSegment.Departure.AirportName}</div>
            <div className="text-3xl font-bold mt-2">{formatDate(firstSegment.Departure.ScheduledTime).time}</div>
            <div className="text-sm text-muted-foreground">{formatDate(firstSegment.Departure.ScheduledTime).date}</div>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center px-4 sm:px-8">
            <div className="text-sm font-medium">{firstSegment.Duration}</div>
            <div className="relative w-20 sm:w-32 my-2">
              <div className="border-t border-dashed border-gray-300 w-full"></div>
              <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
            </div>
            {segments.length > 1 && (
              <div className="text-center">
                <div className="text-sm text-primary">{segments.length - 1} Stops</div>
                <div className="text-xs text-muted-foreground">
                  {segments
                    .slice(0, -1)
                    .map((seg) => seg.Arrival.IATACode)
                    .join(", ")}
                </div>
              </div>
            )}
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="font-bold text-lg">
              {lastSegment.Arrival.CityName} ({lastSegment.Arrival.IATACode})
            </div>
            <div className="text-sm text-muted-foreground">{lastSegment.Arrival.AirportName}</div>
            <div className="text-3xl font-bold mt-2">{formatDate(lastSegment.Arrival.ScheduledTime).time}</div>
            <div className="text-sm text-muted-foreground">{formatDate(lastSegment.Arrival.ScheduledTime).date}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MultiCityFlightCard: React.FC<{ multiCityOffer: MultiCityOffer }> = ({ multiCityOffer }) => {
  const [selectedFare, setSelectedFare] = useState("ECONOMY STANDARD")
  const [activeTab, setActiveTab] = useState<"flight-details" | "fare-summary" | "baggage" | null>(null)

  // Combine outbound and inbound segments into trips
  const allSegments = [
    ...(multiCityOffer.OutboundSegments || []),
    ...(multiCityOffer.InboundSegments || [])
  ];

  // Group segments into trips
  const tripGroups = allSegments.reduce(
    (groups: Record<number, Segment[]>, segment, index) => {
      // Use index as group number if SegmentGroup is not available
      const groupNumber = segment.SegmentGroup ?? index;
      const group = groups[groupNumber] || [];
      group.push(segment);
      groups[groupNumber] = group;
      return groups;
    },
    {}
  );

  // Get price display
  const getPriceBreakdown = () => {
    const outboundTotal = multiCityOffer.Pricing?.PriceBreakdown?.Outbound?.totalPayable?.total || 0;
    const inboundTotal = multiCityOffer.Pricing?.PriceBreakdown?.Inbound?.totalPayable?.total || 0;
    const currency = multiCityOffer.Pricing?.PriceBreakdown?.Outbound?.totalPayable?.currency || 'BDT';
    
    return {
      currency,
      total: outboundTotal + inboundTotal
    };
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Main Content */}
          <div className="flex-grow">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={allSegments[0]?.Logo || "/placeholder.svg"}
                alt={allSegments[0]?.MarketingCarrier.carrierName}
                className="w-8 h-8"
              />
              <div>
                <div className="font-medium">{allSegments[0]?.MarketingCarrier.carrierName}</div>
                <div className="text-sm text-muted-foreground">
                  {allSegments.map((seg) => seg.FlightNumber).join(", ")}
                </div>
              </div>
              {multiCityOffer.Refundable && (
                <span className="ml-auto text-green-500 text-sm bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded">
                  Refundable
                </span>
              )}
            </div>

            {/* Trip Segments */}
            <div className="space-y-4">
              {Object.entries(tripGroups).map(([groupId, segments]) => (
                <TripSegment 
                  key={groupId} 
                  segments={segments} 
                  tripNumber={Number.parseInt(groupId)} 
                />
              ))}
            </div>
          </div>

          {/* Right Side Panel */}
          <div className="mt-6 lg:mt-0 lg:w-80 lg:border-l lg:pl-6">
            {/* Fare Selection */}
            <Select value={selectedFare} onValueChange={setSelectedFare}>
              <SelectTrigger className="w-full">
                <SelectValue>{selectedFare}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECONOMY STANDARD">ECONOMY STANDARD</SelectItem>
                <SelectItem value="ECONOMY FLEX">ECONOMY FLEX</SelectItem>
              </SelectContent>
            </Select>

            {/* Features Box */}
            <div className="mt-4 p-4 rounded-lg border bg-muted/30">
              <h4 className="font-medium mb-4">{selectedFare} Features</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BaggageClaim className="w-4 h-4" />
                  <span className="text-sm">Check-In: 2P</span>
                </div>
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4" />
                  <span className="text-sm">Cabin: SB</span>
                </div>
                {multiCityOffer.Refundable && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-500">Refundable</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Action */}
            <div className="mt-6 text-right">
              <div className="text-3xl font-bold">
                {getPriceBreakdown().currency}{" "}
                {getPriceBreakdown().total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mb-4">Price per adult</div>
              <Button className="w-full">
                Select <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex gap-4">
            <Button
              variant={activeTab === "flight-details" ? "default" : "ghost"}
              onClick={() => setActiveTab(activeTab === "flight-details" ? null : "flight-details")}
              className="gap-2"
            >
              <Plane className="w-4 h-4" /> Flight Details
            </Button>
            <Button
              variant={activeTab === "fare-summary" ? "default" : "ghost"}
              onClick={() => setActiveTab(activeTab === "fare-summary" ? null : "fare-summary")}
              className="gap-2"
            >
              Fare Summary
            </Button>
            <Button
              variant={activeTab === "baggage" ? "default" : "ghost"}
              onClick={() => setActiveTab(activeTab === "baggage" ? null : "baggage")}
              className="gap-2"
            >
              Baggage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MultiCityFlightCard

