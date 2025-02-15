"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, ChevronRight, Luggage, BaggageClaim, Receipt,Clock  } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"

interface FlightSegment {
  Departure: {
    IATACode: string
    Terminal: string
    ScheduledTime: string
    AirportName: string
    CityName: string
  }
  Arrival: {
    IATACode: string
    Terminal: string
    ScheduledTime: string
    AirportName: string
    CityName: string
  }
  MarketingCarrier: {
    carrierDesigCode: string
    marketingCarrierFlightNumber: string
    carrierName: string
  }
  Duration: string
  CabinType: string
  SeatsRemaining?: number
  Logo: string
  ReturnJourney: boolean
}

interface BrandDetails {
  rbd: string;
  meal: boolean;
  seat: string;
  miles: string;
  refundAllowed: boolean;
  exchangeAllowed: boolean;
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

interface FlightOffer {
  Source: string
  TraceId: string
  OfferId: string
  OutboundSegments: FlightSegment[]
  InboundSegments: FlightSegment[]
  Pricing: {
    totalPayable?: {
      total: number
      currency: string
    }
    PriceBreakdown?: {
      Outbound: {
        totalPayable: {
          total: number
          currency: string
        }
      }
      Inbound: {
        totalPayable: {
          total: number
          currency: string
        }
      }
    }
  }
  Baggage: Array<{
    Departure: string
    Arrival: string
    CheckIn: Array<{
      paxType: string
      allowance: string
    }>
    Cabin: Array<{
      paxType: string
      allowance: string
    }>
  }>
  Refundable: boolean
  SeatsRemaining: number
  UpSellBrandList: UpSellBrand[] | null
}

const DEFAULT_AIRLINE_LOGO = '/default-logo.png';

const formatDate = (dateString: string) => {
  // Parse the date string and preserve the exact time
  const date = new Date(dateString);
  
  // Format time
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'  // Use UTC to prevent timezone shifts
  });

  // Format date
  const dateFormatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'  // Use UTC to prevent timezone shifts
  });

  return {
    time,
    date: dateFormatted
  };
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getTotalDuration = (segments: FlightSegment[]) => {
  const firstDeparture = new Date(segments[0].Departure.ScheduledTime)
  const lastArrival = new Date(segments[segments.length - 1].Arrival.ScheduledTime)
  const diffInMinutes = Math.floor((lastArrival.getTime() - firstDeparture.getTime()) / (1000 * 60))
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  return `${hours}h ${minutes}m`
}

const getPriceDisplay = (pricing: any) => {
  // For one-way flights
  if (pricing.totalPayable) {
    return {
      currency: pricing.totalPayable.currency,
      total: pricing.totalPayable.total
    };
  }
  
  // For return flights
  if (pricing.PriceBreakdown) {
    const outbound = pricing.PriceBreakdown.Outbound.totalPayable;
    const inbound = pricing.PriceBreakdown.Inbound.totalPayable;
    
    return {
      currency: outbound.currency, // Both should have same currency
      total: outbound.total + inbound.total // Sum of both flights
    };
  }

  // Fallback default
  return {
    currency: 'BDT',
    total: 0
  };
};

const getFlightNumbers = (segments: FlightSegment[]) => {
  return segments.map((segment) => 
    `${segment.MarketingCarrier.carrierDesigCode}-${segment.MarketingCarrier.marketingCarrierFlightNumber}`
  ).join(", ");
};

const getStopsDisplay = (segments: FlightSegment[]) => {
  if (segments.length <= 1) return null;
  
  const stops = segments.slice(0, -1).map(segment => segment.Arrival.IATACode);
  return {
    count: segments.length - 1,
    stops: stops,
    text: stops.join(", "),
  };
};

const formatBrandName = (brand: UpSellBrand) => {
  const { brandName, price } = brand.upSellBrand;
  return {
    name: brandName,
    price: price.totalPayable.total,
    currency: price.totalPayable.currency
  };
};

const FlightCard: React.FC<{ offer: FlightOffer }> = ({ offer }) => {
  if (!offer?.OutboundSegments?.length) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-muted-foreground">
            Invalid flight offer data
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle both ReturnJourney flag and InboundSegments
  const outboundSegments = offer.OutboundSegments.filter(segment => !segment.ReturnJourney);
  const returnSegments = offer.InboundSegments?.length > 0 
    ? offer.InboundSegments 
    : offer.OutboundSegments.filter(segment => segment.ReturnJourney);

  const firstOutboundSegment = outboundSegments[0];
  const lastOutboundSegment = outboundSegments[outboundSegments.length - 1];
  const firstReturnSegment = returnSegments?.[0];
  const lastReturnSegment = returnSegments?.[returnSegments.length - 1];
  const isMultiSegment = outboundSegments.length > 1 || returnSegments.length > 1;
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<UpSellBrand | null>(null);
  const [selectedFare, setSelectedFare] = useState<string>("");

  const getLayoverDuration = (currentSegment: FlightSegment, nextSegment: FlightSegment) => {
    const currentArrival = new Date(currentSegment.Arrival.ScheduledTime)
    const nextDeparture = new Date(nextSegment.Departure.ScheduledTime)
    const diffInMinutes = Math.floor((nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60))
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getBaggageInfo = () => {
    if (!offer.Baggage?.[0]) return "No baggage information available"
    const baggage = offer.Baggage[0]
    return `${baggage.Departure}-${baggage.Arrival} Check-In: ${baggage.CheckIn[0]?.allowance || 'N/A'}, Cabin: ${baggage.Cabin[0]?.allowance || 'N/A'}`
  }

  const SegmentLogo: React.FC<{ segment: FlightSegment }> = ({ segment }) => {
    return (
      <img
        src={segment.Logo || DEFAULT_AIRLINE_LOGO}
        alt={segment.MarketingCarrier.carrierName}
        className="w-8 h-8 object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = DEFAULT_AIRLINE_LOGO;
        }}
      />
    );
  };

  const getRouteDisplay = (segments: FlightSegment[]) => {
    if (!segments || segments.length === 0) return null;
    
    const origin = segments[0];
    const destination = segments[segments.length - 1];
    const stopsList = segments.slice(1, -1).map(seg => seg.Arrival.IATACode);
    
    return {
      origin: {
        city: origin.Departure.CityName,
        code: origin.Departure.IATACode,
        airport: origin.Departure.AirportName,
        time: origin.Departure.ScheduledTime,
      },
      destination: {
        city: destination.Arrival.CityName,
        code: destination.Arrival.IATACode,
        airport: destination.Arrival.AirportName,
        time: destination.Arrival.ScheduledTime,
      },
      stops: stopsList,
      duration: getTotalDuration(segments),
    };
  };

  const outboundRoute = getRouteDisplay(outboundSegments);
  const returnRoute = getRouteDisplay(returnSegments);

  useEffect(() => {
    if (offer.UpSellBrandList?.length) {
      const defaultBrand = offer.UpSellBrandList[0];
      setSelectedBrand(defaultBrand);
      setSelectedFare(defaultBrand.upSellBrand.brandName);
    }
  }, [offer.UpSellBrandList]);

  const handleBrandSelect = (value: string) => {
    const brand = offer.UpSellBrandList?.find(
      b => b.upSellBrand.brandName === value
    ) || null;
    setSelectedBrand(brand);
    setSelectedFare(value);
  };

  if (!outboundRoute) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-muted-foreground">
            Invalid flight data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={firstOutboundSegment.Logo || DEFAULT_AIRLINE_LOGO}
                  alt={firstOutboundSegment.MarketingCarrier.carrierName}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_AIRLINE_LOGO;
                  }}
                />
                <div>
                  <div className="font-semibold text-xl">{firstOutboundSegment.MarketingCarrier.carrierName}</div>
                  <div className="text-sm text-muted-foreground">
                    {getFlightNumbers(outboundSegments)}
                    {returnSegments.length > 0 && (
                      <>, {getFlightNumbers(returnSegments)}</>
                    )}
                  </div>
                </div>
              </div>
              {offer.Refundable && (
                <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded">Refundable</span>
              )}
            </div>

            {/* Outbound Flight */}
            <div className="mt-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">Departure</div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
                <div>
                  <div className="text-lg font-bold">
                    {outboundRoute.origin.city} ({outboundRoute.origin.code})
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{outboundRoute.origin.airport}</div>
                  <div className="text-3xl font-bold">{formatDate(outboundRoute.origin.time).time}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(outboundRoute.origin.time).date}
                  </div>
                </div>

                <div className="flex flex-col items-center my-4 sm:my-0">
                  <div className="text-sm font-medium">{getTotalDuration(outboundSegments)}</div>
                  <div className="w-32 sm:w-48 h-px bg-primary/30 relative my-2">
                    <Plane className="w-4 h-4 absolute -top-2 -right-2 text-primary" />
                  </div>
                  {outboundSegments.length > 1 && (
                    <div className="text-sm">
                      <div className="text-primary">
                        {outboundSegments.length - 1} {outboundSegments.length - 1 === 1 ? "Stop" : "Stops"}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        {getStopsDisplay(outboundSegments)?.text}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold">
                    {outboundRoute.destination.city} ({outboundRoute.destination.code})
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{outboundRoute.destination.airport}</div>
                  <div className="text-3xl font-bold">{formatDate(outboundRoute.destination.time).time}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(outboundRoute.destination.time).date}</div>
                </div>
              </div>
            </div>

            {/* Return Flight */}
            {returnSegments && returnSegments.length > 0 && returnRoute && (
              <div className="mt-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Return</div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
                  <div>
                    <div className="text-lg font-bold">
                      {returnRoute!.origin.city} ({returnRoute!.origin.code})
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{returnRoute!.origin.airport}</div>
                    <div className="text-3xl font-bold">{formatDate(returnRoute!.origin.time).time}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(returnRoute!.origin.time).date}
                    </div>
                  </div>

                  <div className="flex flex-col items-center my-4 sm:my-0">
                    <div className="text-sm font-medium">{getTotalDuration(returnSegments)}</div>
                    <div className="w-32 sm:w-48 h-px bg-primary/30 relative my-2">
                      <Plane className="w-4 h-4 absolute -top-2 -right-2 text-primary" />
                    </div>
                    {returnSegments.length > 1 && (
                      <div className="text-sm">
                        <div className="text-primary">
                          {returnSegments.length - 1} {returnSegments.length - 1 === 1 ? "Stop" : "Stops"}
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {returnSegments.slice(0, -1).map(seg => seg.Arrival.IATACode).join(", ")}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {returnRoute!.destination.city} ({returnRoute!.destination.code})
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{returnRoute!.destination.airport}</div>
                    <div className="text-3xl font-bold">{formatDate(returnRoute!.destination.time).time}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(returnRoute!.destination.time).date}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 mt-6 lg:mt-0 lg:border-l lg:pl-6">
            {/* Fare Selection Dropdown */}
            <Select value={selectedFare} onValueChange={handleBrandSelect}>
              <SelectTrigger className="w-full h-auto py-3">
                <SelectValue>
                  {selectedBrand && (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{selectedBrand.upSellBrand.brandName}</span>
                        <span className="font-medium">
                          {selectedBrand.upSellBrand.price.totalPayable.currency} {formatPrice(selectedBrand.upSellBrand.price.totalPayable.total)}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{selectedBrand.upSellBrand.baggageAllowanceList[0]?.baggageAllowance.checkIn[0]?.allowance} Check-in</span>
                        {selectedBrand.upSellBrand.meal && <span>• Meal</span>}
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                className="w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-950 border rounded-md shadow-lg"
                position="popper"
                sideOffset={5}
              >
                {offer.UpSellBrandList?.map((brand) => (
                  <SelectItem 
                    key={brand.upSellBrand.offerId} 
                    value={brand.upSellBrand.brandName}
                    className="py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 border-b last:border-b-0 focus:bg-gray-100 dark:focus:bg-gray-900"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Header: Brand Name and Price */}
                      <div className="flex justify-between items-center w-full">
                        <span className="font-semibold">{brand.upSellBrand.brandName}</span>
                        <span className="font-semibold">
                          {brand.upSellBrand.price.totalPayable.currency} {formatPrice(brand.upSellBrand.price.totalPayable.total)}
                        </span>
                      </div>

                      {/* Features List */}
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        {/* Baggage */}
                        <div className="flex items-center gap-2">
                          <BaggageClaim className="w-4 h-4" />
                          <span>Check-in: {brand.upSellBrand.baggageAllowanceList[0]?.baggageAllowance.checkIn[0]?.allowance}</span>
                        </div>

                        {/* Meal */}
                        {brand.upSellBrand.meal && (
                          <div className="flex items-center gap-2">
                            <span>✓ Meal Included</span>
                          </div>
                        )}

                        {/* Seat */}
                        {brand.upSellBrand.seat && (
                          <div className="flex items-center gap-2">
                            <span>{brand.upSellBrand.seat}</span>
                          </div>
                        )}

                        {/* Exchange/Refund */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className={`px-2 py-0.5 rounded ${brand.upSellBrand.exchangeAllowed ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                            {brand.upSellBrand.exchangeAllowed ? "Exchangeable" : "Non-Exchangeable"}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${brand.upSellBrand.refundAllowed ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                            {brand.upSellBrand.refundAllowed ? "Refundable" : "Non-Refundable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Features Box */}
            {selectedBrand && (
              <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                <h4 className="font-medium mb-4">{selectedFare} Features</h4>
                <div className="space-y-3">
                  {/* Seats Remaining */}
                  {offer.SeatsRemaining > 0 && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <span className="text-sm font-medium">
                        {offer.SeatsRemaining} {offer.SeatsRemaining === 1 ? 'seat' : 'seats'} remaining
                      </span>
                    </div>
                  )}

                  {/* Baggage */}
                  {selectedBrand.upSellBrand.baggageAllowanceList?.[0]?.baggageAllowance.checkIn?.[0]?.allowance && (
                    <div className="flex items-center gap-2">
                      <BaggageClaim className="w-4 h-4" />
                      <span className="text-sm">
                        Check-In: {selectedBrand.upSellBrand.baggageAllowanceList[0].baggageAllowance.checkIn[0].allowance}
                      </span>
                    </div>
                  )}

                  {selectedBrand.upSellBrand.baggageAllowanceList?.[0]?.baggageAllowance.cabin?.[0]?.allowance && (
                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4" />
                      <span className="text-sm">
                        Cabin: {selectedBrand.upSellBrand.baggageAllowanceList[0].baggageAllowance.cabin[0].allowance}
                      </span>
                    </div>
                  )}

                  {/* Meal */}
                  {selectedBrand.upSellBrand.meal !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Meal: {selectedBrand.upSellBrand.meal ? "Included" : "Not Included"}
                      </span>
                    </div>
                  )}

                  {/* Seat */}
                  {selectedBrand.upSellBrand.seat && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Seat: {selectedBrand.upSellBrand.seat}
                      </span>
                    </div>
                  )}

                  {/* Miles */}
                  {selectedBrand.upSellBrand.miles && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Miles: {selectedBrand.upSellBrand.miles}
                      </span>
                    </div>
                  )}

                  {/* Exchange & Refund */}
                  {selectedBrand.upSellBrand.exchangeAllowed !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedBrand.upSellBrand.exchangeAllowed ? "Exchangeable" : "Non-Exchangeable"}
                      </span>
                    </div>
                  )}
                  
                  {selectedBrand.upSellBrand.refundAllowed !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedBrand.upSellBrand.refundAllowed ? "Refundable" : "Non-Refundable"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="mt-6">
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"} {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Price per adult</div>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                Select <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="border-t pt-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab(activeTab === "flight-details" ? null : "flight-details")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === "flight-details" ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Plane className="h-4 w-4" />
                Flight Details
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "fare-summary" ? null : "fare-summary")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === "fare-summary" ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Receipt className="h-4 w-4" />
                Fare Summary
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "baggage" ? null : "baggage")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === "baggage" ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Luggage className="h-4 w-4" />
                Baggage
              </button>
            </div>

            {activeTab === "flight-details" && (
              <div className="mt-6 space-y-6">
                {/* Outbound Segments */}
                {outboundSegments.length > 0 && (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">Outbound Flight</div>
                    {outboundSegments.map((segment, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex flex-col bg-muted/30 p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <SegmentLogo segment={segment} />
                              <div>
                                <div className="font-medium">{segment.MarketingCarrier.carrierName}</div>
                                <div className="text-sm text-muted-foreground">
                                  Flight {segment.MarketingCarrier.marketingCarrierFlightNumber} · {segment.CabinType} · {offer.SeatsRemaining || segment.SeatsRemaining || 9} Seats Left
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">{segment.Duration}</div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-6">
                            <div>
                              <div className="text-lg font-bold">
                                {segment.Departure.CityName} ({segment.Departure.IATACode})
                              </div>
                              <div className="text-2xl font-bold my-1">{formatDate(segment.Departure.ScheduledTime).time}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(segment.Departure.ScheduledTime).date}
                              </div>
                              <div className="text-sm mt-2">{segment.Departure.AirportName}</div>
                              <div className="text-sm text-muted-foreground">Terminal {segment.Departure.Terminal || 1}</div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                              <div className="w-full h-px bg-border relative">
                                <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {segment.Arrival.CityName} ({segment.Arrival.IATACode})
                              </div>
                              <div className="text-2xl font-bold my-1">{formatDate(segment.Arrival.ScheduledTime).time}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(segment.Arrival.ScheduledTime).date}</div>
                              <div className="text-sm mt-2">{segment.Arrival.AirportName}</div>
                              <div className="text-sm text-muted-foreground">Terminal {segment.Arrival.Terminal || 1}</div>
                            </div>
                          </div>
                        </div>

                        {index < outboundSegments.length - 1 && (
                          <div className="flex items-center gap-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <div>
                              <div className="font-medium">Layover at {segment.Arrival.AirportName}</div>
                              <div className="text-sm text-muted-foreground">
                                Connection time: {getLayoverDuration(segment, outboundSegments[index + 1])}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Return Segments */}
                {returnSegments.length > 0 && (
                  <>
                    <div className="text-sm text-muted-foreground mb-4 mt-6">Return Flight</div>
                    {returnSegments.map((segment, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex flex-col bg-muted/30 p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <SegmentLogo segment={segment} />
                              <div>
                                <div className="font-medium">{segment.MarketingCarrier.carrierName}</div>
                                <div className="text-sm text-muted-foreground">
                                  Flight {segment.MarketingCarrier.marketingCarrierFlightNumber} · {segment.CabinType} · {offer.SeatsRemaining || segment.SeatsRemaining || 9} Seats Left
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">{segment.Duration}</div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-6">
                            <div>
                              <div className="text-lg font-bold">
                                {segment.Departure.CityName} ({segment.Departure.IATACode})
                              </div>
                              <div className="text-2xl font-bold my-1">{formatDate(segment.Departure.ScheduledTime).time}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(segment.Departure.ScheduledTime).date}
                              </div>
                              <div className="text-sm mt-2">{segment.Departure.AirportName}</div>
                              <div className="text-sm text-muted-foreground">Terminal {segment.Departure.Terminal || 1}</div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                              <div className="w-full h-px bg-border relative">
                                <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {segment.Arrival.CityName} ({segment.Arrival.IATACode})
                              </div>
                              <div className="text-2xl font-bold my-1">{formatDate(segment.Arrival.ScheduledTime).time}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(segment.Arrival.ScheduledTime).date}</div>
                              <div className="text-sm mt-2">{segment.Arrival.AirportName}</div>
                              <div className="text-sm text-muted-foreground">Terminal {segment.Arrival.Terminal || 1}</div>
                            </div>
                          </div>
                        </div>

                        {index < returnSegments.length - 1 && (
                          <div className="flex items-center gap-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <div>
                              <div className="font-medium">Layover at {segment.Arrival.AirportName}</div>
                              <div className="text-sm text-muted-foreground">
                                Connection time: {getLayoverDuration(segment, returnSegments[index + 1])}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === "fare-summary" && (
              <div className="mt-6">
                <div className="bg-muted/30 p-6 rounded-lg border space-y-6">
                  {/* Add Seats Remaining */}
                  {offer.SeatsRemaining > 0 && (
                    <div className="text-sm text-orange-600 font-medium">
                      {offer.SeatsRemaining} {offer.SeatsRemaining === 1 ? 'seat' : 'seats'} remaining
                    </div>
                  )}
                  
                  {/* Price Breakdown */}
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Fare Breakdown</span>
                      <span className="text-sm text-muted-foreground">Price per adult</span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between">
                        <span>Base Fare</span>
                        <span className="font-medium">
                          {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"} {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Taxes & Fees</span>
                        <span>Included</span>
                      </div>
                    </div>
                  </div>

                  {/* Fare Features */}
                  {selectedBrand?.upSellBrand && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Fare Features</h4>
                      
                      <div className="grid gap-4">
                        {selectedBrand.upSellBrand.rbd && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">RBD</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.rbd}
                            </span>
                          </div>
                        )}

                        {selectedBrand.upSellBrand.meal !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Meal Service</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.meal ? "Included" : "Not Included"}
                            </span>
                          </div>
                        )}

                        {selectedBrand.upSellBrand.seat && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Seat Selection</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.seat}
                            </span>
                          </div>
                        )}

                        {selectedBrand.upSellBrand.miles && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Miles</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.miles}
                            </span>
                          </div>
                        )}

                        {selectedBrand.upSellBrand.exchangeAllowed !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Exchange</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.exchangeAllowed ? "Allowed" : "Not Allowed"}
                            </span>
                          </div>
                        )}

                        {selectedBrand.upSellBrand.refundAllowed !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Refund</span>
                            <span className="text-sm font-medium">
                              {selectedBrand.upSellBrand.refundAllowed ? "Allowed" : "Not Allowed"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">
                      {selectedBrand?.upSellBrand.price.totalPayable.currency || "BDT"} {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "baggage" && (
              <div className="mt-6 space-y-6">
                <div className="bg-muted/30 p-6 rounded-lg border">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Check-in Baggage</h4>
                      <div className="p-4 bg-background rounded border">
                        <p>{offer.Baggage[0].CheckIn[0]?.allowance || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Cabin Baggage</h4>
                      <div className="p-4 bg-background rounded border">
                        <p>{offer.Baggage[0].Cabin[0]?.allowance || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FlightCard

