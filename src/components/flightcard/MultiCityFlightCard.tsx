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

interface UpSellBrand {
  upSellBrand: {
    offerId: string;
    brandName: string;
    refundable: boolean;
    price: {
      totalPayable: {
        total: number;
        currency: string;
      };
    };
    baggageAllowanceList: Array<{
      baggageAllowance: {
        checkIn: Array<{
          paxType: string;
          allowance: string;
        }>;
        cabin: Array<{
          paxType: string;
          allowance: string;
        }>;
      };
    }>;
    rbd: string;
    meal: boolean;
    seat: string;
    miles: string;
    refundAllowed: boolean;
    exchangeAllowed: boolean;
  };
}

interface MultiCityOffer {
  OutboundSegments: Segment[]
  InboundSegments?: Segment[]
  Pricing: Pricing
  Refundable: boolean
  ValidatingCarrier: string
  UpSellBrandList?: UpSellBrand[]
  SeatsRemaining: number
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

const FlightDetailsTab: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  return (
    <div className="mt-4 space-y-6">
      {segments.map((segment, index) => (
        <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={segment.Logo}
              alt={segment.MarketingCarrier.carrierName}
              className="w-8 h-8"
            />
            <div>
              <div className="font-medium">{segment.MarketingCarrier.carrierName}</div>
              <div className="text-sm text-muted-foreground">Flight {segment.FlightNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Departure</div>
              <div className="font-medium">{formatDate(segment.Departure.ScheduledTime).time}</div>
              <div className="text-sm">{formatDate(segment.Departure.ScheduledTime).date}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {segment.Departure.AirportName} ({segment.Departure.IATACode})
                {segment.Departure.Terminal && ` • Terminal ${segment.Departure.Terminal}`}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Arrival</div>
              <div className="font-medium">{formatDate(segment.Arrival.ScheduledTime).time}</div>
              <div className="text-sm">{formatDate(segment.Arrival.ScheduledTime).date}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {segment.Arrival.AirportName} ({segment.Arrival.IATACode})
                {segment.Arrival.Terminal && ` • Terminal ${segment.Arrival.Terminal}`}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{segment.Duration}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {segment.CabinType} Class
              </div>
              {segment.SeatsRemaining && (
                <div className="text-sm text-orange-600 mt-1">
                  {segment.SeatsRemaining} seats left
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Aircraft</div>
              <div className="font-medium">
                Operated by {segment.OperatingCarrier.carrierName}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Flight {segment.OperatingCarrier.marketingCarrierFlightNumber}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FareSummaryTab: React.FC<{ 
  pricing: Pricing; 
  selectedBrand: UpSellBrand | null;
  seatsRemaining: number;
}> = ({ pricing, selectedBrand, seatsRemaining }) => {
  return (
    <div className="mt-4">
      <div className="space-y-6">
        {/* Add Seats Remaining */}
        {seatsRemaining > 0 && (
          <div className="text-sm text-orange-600 font-medium">
            {seatsRemaining} {seatsRemaining === 1 ? 'seat' : 'seats'} remaining
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-b pb-4">
          <div className="text-sm font-medium mb-4">Fare Breakdown</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Fare</span>
              <span>
                {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"}{" "}
                {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
          </div>
        </div>

        {/* Fare Features */}
        {selectedBrand?.upSellBrand && (
          <div className="space-y-4">
            <h4 className="font-medium">Fare Features</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">RBD</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.rbd}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Meal Service</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.meal ? "Included" : "Not Included"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Seat Selection</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.seat}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Miles</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.miles}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Exchange</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.exchangeAllowed ? "Allowed" : "Not Allowed"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Refund</span>
                <span className="text-sm font-medium">
                  {selectedBrand.upSellBrand.refundAllowed ? "Allowed" : "Not Allowed"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="pt-4 border-t">
          <div className="flex justify-between font-medium">
            <span>Total Price</span>
            <span className="text-lg">
              {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"}{" "}
              {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Price per adult • Including all taxes and fees
          </div>
        </div>
      </div>
    </div>
  );
};

const BaggageTab: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  return (
    <div className="mt-4 space-y-6">
      {segments.map((segment, index) => (
        <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
          <div className="text-sm font-medium mb-3">
            {segment.Departure.CityName} ({segment.Departure.IATACode}) → {segment.Arrival.CityName} ({segment.Arrival.IATACode})
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Cabin Baggage</div>
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4" />
                <span className="text-sm">7 KG</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Check-in Baggage</div>
              <div className="flex items-center gap-2">
                <BaggageClaim className="w-4 h-4" />
                <span className="text-sm">20 KG</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatBrandName = (brand: UpSellBrand) => {
  const { brandName, price } = brand.upSellBrand;
  return {
    name: brandName,
    price: price.totalPayable.total,
    currency: price.totalPayable.currency
  };
};

const MultiCityFlightCard: React.FC<{ multiCityOffer: MultiCityOffer }> = ({ multiCityOffer }) => {
  const [selectedFare, setSelectedFare] = useState<string>("ECONOMY STANDARD");
  const [selectedBrand, setSelectedBrand] = useState<UpSellBrand | null>(null);
  const [activeTab, setActiveTab] = useState<"flight-details" | "fare-summary" | "baggage" | null>(null);

  // Add this function to handle brand selection
  const handleBrandSelect = (value: string) => {
    setSelectedFare(value);
    const brand = multiCityOffer.UpSellBrandList?.find(
      b => b.upSellBrand.brandName === value
    ) || null;
    setSelectedBrand(brand);
  };

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

  // Add this before the return statement to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "flight-details":
        return <FlightDetailsTab segments={allSegments} />;
      case "fare-summary":
        return (
          <FareSummaryTab 
            pricing={multiCityOffer.Pricing} 
            selectedBrand={selectedBrand} 
            seatsRemaining={multiCityOffer.SeatsRemaining}
          />
        );
      case "baggage":
        return <BaggageTab segments={allSegments} />;
      default:
        return null;
    }
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
            <Select value={selectedFare} onValueChange={handleBrandSelect}>
              <SelectTrigger className="w-full h-auto py-3">
                <SelectValue>
                  {selectedBrand && (
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium">{selectedBrand.upSellBrand.brandName}</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedBrand.upSellBrand.price.totalPayable.currency} {formatPrice(selectedBrand.upSellBrand.price.totalPayable.total)}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {multiCityOffer.UpSellBrandList?.map((brand) => {
                  const { name, price, currency } = formatBrandName(brand);
                  return (
                    <SelectItem 
                      key={brand.upSellBrand.offerId} 
                      value={name}
                      className="py-3"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{name}</span>
                          <span className="text-sm font-medium">
                            {currency} {formatPrice(price)}
                          </span>
                        </div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{brand.upSellBrand.baggageAllowanceList[0]?.baggageAllowance.checkIn[0]?.allowance} Check-in</span>
                          {brand.upSellBrand.meal && <span>• Meal</span>}
                          {brand.upSellBrand.refundAllowed && <span>• Refundable</span>}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Features Box */}
            <div className="mt-4 p-4 rounded-lg border bg-muted/30">
              <h4 className="font-medium mb-4">{selectedFare} Features</h4>
              <div className="space-y-3">
                {/* Add Seats Remaining at the top */}
                {multiCityOffer.SeatsRemaining > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-sm font-medium">
                      {multiCityOffer.SeatsRemaining} {multiCityOffer.SeatsRemaining === 1 ? 'seat' : 'seats'} remaining
                    </span>
                  </div>
                )}

                {/* Baggage */}
                <div className="flex items-center gap-2">
                  <BaggageClaim className="w-4 h-4" />
                  <span className="text-sm">
                    Check-In: {selectedBrand?.upSellBrand.baggageAllowanceList[0]?.baggageAllowance.checkIn[0]?.allowance || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4" />
                  <span className="text-sm">
                    Cabin: {selectedBrand?.upSellBrand.baggageAllowanceList[0]?.baggageAllowance.cabin[0]?.allowance || "N/A"}
                  </span>
                </div>

                {/* Meal */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Meal: {selectedBrand?.upSellBrand.meal ? "Included" : "Not Included"}
                  </span>
                </div>

                {/* Seat */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Seat: {selectedBrand?.upSellBrand.seat}
                  </span>
                </div>

                {/* Miles */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Miles: {selectedBrand?.upSellBrand.miles}
                  </span>
                </div>

                {/* Exchange & Refund */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {selectedBrand?.upSellBrand.exchangeAllowed ? "Exchangeable" : "Non-Exchangeable"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {selectedBrand?.upSellBrand.refundAllowed ? "Refundable" : "Non-Refundable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="mt-6 text-right">
              <div className="text-3xl font-bold">
                {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"}{" "}
                {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
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
          {/* Add the tab content */}
          {renderTabContent()}
        </div>
      </CardContent>
    </Card>
  )
}

export default MultiCityFlightCard

