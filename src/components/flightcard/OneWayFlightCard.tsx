"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, ChevronRight, Luggage, BaggageClaim, Receipt, ChevronDown, Clock, Check, X, Tag, Utensils, Armchair, Users, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

// Use the same interfaces from FlightCard
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
}

interface UpSellBrand {
  upSellBrand: {
    offerId: string
    brandName: string
    refundable: boolean
    price: {
      totalPayable: {
        total: number
        currency: string
      }
    }
    baggageAllowanceList: Array<{
      baggageAllowance: {
        checkIn: Array<{
          paxType: string
          allowance: string
        }>
        cabin: Array<{
          paxType: string
          allowance: string
        }>
      }
    }>
    rbd: string
    meal: boolean
    seat: string
    miles: string
    refundAllowed: boolean
    exchangeAllowed: boolean
  }
}

interface OneWayFlightOffer {
  OfferId: string
  OutboundSegments: FlightSegment[]
  FareDetails: Array<{
    BaseFare: number
    Tax: number
    OtherFee: number
    Discount: number
    VAT: number
    Currency: string
    PaxType: string
    PaxCount: number
    SubTotal: number
  }>
  Pricing: {
    totalPayable: {
      total: number
      currency: string
    }
    gross: {
      total: number
      currency: string
    }
    discount: {
      total: number
      currency: string
    }
    totalVAT: {
      total: number
      currency: string
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

type ActiveTab = 'flight-details' | 'fare-summary' | 'baggage' | null

const DEFAULT_AIRLINE_LOGO = '/default-logo.png'

// Use the same helper functions from FlightCard
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
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

interface OneWayFlightCardProps {
  offer: OneWayFlightOffer;
  totalPassengers?: number;
}

const OneWayFlightCard: React.FC<OneWayFlightCardProps> = ({ offer, totalPassengers = 1 }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)
  const [selectedBrand, setSelectedBrand] = useState<UpSellBrand | null>(null)
  const [selectedFare, setSelectedFare] = useState<string>("")

  const getLayoverDuration = (currentSegment: FlightSegment, nextSegment: FlightSegment) => {
    const currentArrival = new Date(currentSegment.Arrival.ScheduledTime)
    const nextDeparture = new Date(nextSegment.Departure.ScheduledTime)
    const diffInMinutes = Math.floor((nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60))
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  useEffect(() => {
    if (offer.UpSellBrandList?.length) {
      const defaultBrand = offer.UpSellBrandList[0]
      setSelectedBrand(defaultBrand)
      setSelectedFare(defaultBrand.upSellBrand.brandName)
    }
  }, [offer.UpSellBrandList])

  const handleBrandSelect = (value: string) => {
    const brand = offer.UpSellBrandList?.find(
      b => b.upSellBrand.brandName === value
    ) || null
    setSelectedBrand(brand)
    setSelectedFare(value)
  }

  // Add helper function to get number of stops
  const getStopsLabel = (segments: FlightSegment[]) => {
    const stops = segments.length - 1;
    if (stops === 0) return "Direct";
    return `${stops} Stop${stops > 1 ? 's' : ''}`;
  };

  // Update the getStopsWithAirports function
  const getStopsWithAirports = (segments: FlightSegment[]) => {
    if (segments.length <= 1) return "Direct";
    const stopAirports = segments.slice(0, -1).map(segment => segment.Arrival.IATACode);
    const layoverTime = getLayoverDuration(segments[0], segments[1]); // Get layover time for first connection
    return `${layoverTime} • ${segments.length - 1} Stop ${stopAirports.join(', ')}`;
  };

  // Add this helper function to format layover details
  const getLayoverDetails = (segments: FlightSegment[]) => {
    const layovers = [];
    for (let i = 0; i < segments.length - 1; i++) {
      const currentSegment = segments[i];
      const nextSegment = segments[i + 1];
      const duration = getLayoverDuration(currentSegment, nextSegment);
      layovers.push({
        airport: currentSegment.Arrival.IATACode,
        duration,
        cityName: currentSegment.Arrival.CityName
      });
    }
    return layovers;
  };

  // Add this helper function after the existing helper functions
  const getBaggageAllowance = (brand: UpSellBrand) => {
    const adultBaggage = brand.upSellBrand.baggageAllowanceList?.[0]?.baggageAllowance?.checkIn?.find(
      item => item.paxType === 'Adult'
    );
    return adultBaggage?.allowance || 'N/A';
  };

  // Add the flight details tab content
  const renderFlightDetails = () => {
    if (activeTab !== 'flight-details') return null;

    return (
      <div className="space-y-4 overflow-x-auto">
        {offer.OutboundSegments.map((segment, index) => {
          const layoverDetails = index < offer.OutboundSegments.length - 1 
            ? getLayoverDetails(offer.OutboundSegments)[index] 
            : null;

          return (
            <div key={index} className="space-y-3 min-w-[600px] sm:min-w-0">
              {/* Flight segment */}
              <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={segment.Logo || DEFAULT_AIRLINE_LOGO}
                      alt={segment.MarketingCarrier.carrierName}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <div className="font-medium">{segment.MarketingCarrier.carrierName}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-bold">
                          {segment.MarketingCarrier.carrierDesigCode}
                        </span>
                        -{segment.MarketingCarrier.marketingCarrierFlightNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                    {/* Departure */}
                    <div>
                      <div className="font-semibold">{formatTime(segment.Departure.ScheduledTime)}</div>
                      <div className="text-sm">{segment.Departure.IATACode}</div>
                      <div className="text-sm text-muted-foreground">{segment.Departure.CityName}</div>
                      {segment.Departure.Terminal && (
                        <div className="text-sm text-muted-foreground">Terminal {segment.Departure.Terminal}</div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="text-center">
                      <div className="text-sm">{segment.Duration}</div>
                      <div className="w-24 h-px bg-border relative my-2">
                        <Plane className="w-4 h-4 absolute -top-2 right-0" />
                      </div>
                      <div className="text-sm">Direct</div>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <div className="font-semibold">{formatTime(segment.Arrival.ScheduledTime)}</div>
                      <div className="text-sm">{segment.Arrival.IATACode}</div>
                      <div className="text-sm text-muted-foreground">{segment.Arrival.CityName}</div>
                      {segment.Arrival.Terminal && (
                        <div className="text-sm text-muted-foreground">Terminal {segment.Arrival.Terminal}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Layover information */}
              {layoverDetails && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {layoverDetails.duration} layover in {layoverDetails.cityName} ({layoverDetails.airport})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Add these helper functions for fare summary and baggage details
  const renderFareSummary = () => {
    if (activeTab !== 'fare-summary') return null;

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-0">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-2 text-sm font-medium border-b pb-2">
            <div>Pax Type</div>
            <div>Base Fare</div>
            <div>Tax</div>
            <div>Other</div>
            <div>AIT VAT</div>
            <div>Amount</div>
          </div>

          {/* Table Body */}
          <div className="space-y-2 mt-2">
            {offer.FareDetails.map((fare, index) => {
              const paxTypeLabel = 
                fare.PaxType === 'Adult' ? 'Adult' :
                fare.PaxType === 'Child' ? 'Child' :
                fare.PaxType === 'Infant' ? 'Infant' : fare.PaxType;

              return (
                <div key={index} className="grid grid-cols-6 gap-2 text-sm">
                  <div>{paxTypeLabel}</div>
                  <div>{formatPrice(fare.BaseFare)}</div>
                  <div>{formatPrice(fare.Tax)}</div>
                  <div>{formatPrice(fare.OtherFee)}</div>
                  <div>{formatPrice(fare.VAT)}</div>
                  <div>BDT {formatPrice(fare.SubTotal)}</div>
                </div>
              );
            })}
          </div>

          {/* Total Rows */}
          <div className="border-t mt-2 pt-2 space-y-1">
            <div className="grid grid-cols-[5fr,1fr] gap-2 text-sm font-medium">
              <div className="text-right">Total Agent Payable</div>
              <div>BDT {formatPrice(offer.Pricing.totalPayable.total)}</div>
            </div>
            <div className="grid grid-cols-[5fr,1fr] gap-2 text-sm font-medium">
              <div className="text-right">Total Customer Payable</div>
              <div>BDT {formatPrice(offer.Pricing.totalPayable.total)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBaggageInfo = () => {
    if (activeTab !== 'baggage') return null;

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-0">
          {offer.Baggage.map((baggage, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Check-in Baggage</h3>
                {baggage.CheckIn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <BaggageClaim className="w-4 h-4 text-muted-foreground" />
                    <span>{item.allowance} ({item.paxType})</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Cabin Baggage</h3>
                {baggage.Cabin.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Luggage className="w-4 h-4 text-muted-foreground" />
                    <span>{item.allowance} ({item.paxType})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {/* Left side - Flight info */}
          <div>
            {/* Airline Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={offer.OutboundSegments[0].Logo || DEFAULT_AIRLINE_LOGO}
                  alt={offer.OutboundSegments[0].MarketingCarrier.carrierName}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_AIRLINE_LOGO;
                  }}
                />
                <div>
                  <div className="text-lg font-semibold">
                    {offer.OutboundSegments[0].MarketingCarrier.carrierName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {offer.OutboundSegments.map((segment, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        <span className="font-bold">
                          {segment.MarketingCarrier.carrierDesigCode}
                        </span>
                        -{segment.MarketingCarrier.marketingCarrierFlightNumber}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Section */}
            <div className="bg-muted/30 p-4 rounded-lg">
              {/* Desktop View */}
              <div className="hidden sm:grid sm:grid-cols-[1fr,auto,1fr] sm:gap-8">
                {/* Departure */}
                <div>
                  <div className="text-base font-bold text-black dark:text-white text-lg">
                    {offer.OutboundSegments[0].Departure.CityName} ({offer.OutboundSegments[0].Departure.IATACode})
                  </div>
                  <div className="text-4xl font-extrabold text-black dark:text-white my-1">
                    {formatTime(offer.OutboundSegments[0].Departure.ScheduledTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(offer.OutboundSegments[0].Departure.ScheduledTime)}
                  </div>
                  {offer.OutboundSegments[0].Departure.Terminal && (
                    <div className="text-sm text-muted-foreground">
                      Terminal: {offer.OutboundSegments[0].Departure.Terminal}
                    </div>
                  )}
                </div>

                {/* Duration - Desktop */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-medium">
                    {getTotalDuration(offer.OutboundSegments)}
                  </div>
                  <div className="w-32 h-px bg-border relative my-2">
                    <Plane className="w-4 h-4 absolute -top-2 right-0" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getStopsWithAirports(offer.OutboundSegments)}
                  </div>
                </div>

                {/* Arrival - Desktop - Show final destination */}
                <div className="text-right">
                  <div className="text-base font-bold text-black dark:text-white text-lg">
                    {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.CityName} 
                    ({offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.IATACode})
                  </div>
                  <div className="text-4xl font-extrabold text-black dark:text-white my-1">
                    {formatTime(offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.ScheduledTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.ScheduledTime)}
                  </div>
                  {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.Terminal && (
                    <div className="text-sm text-muted-foreground">
                      Terminal: {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.Terminal}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div className="sm:hidden">
                <div className="relative">
                  {/* Timeline dots and line */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                    {/* Top dot */}
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Plane className="w-1.5 h-1.5 text-white" />
                      </div>
                    </div>
                    {/* Connecting line */}
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-2" />
                    {/* Bottom dot */}
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Plane className="w-1.5 h-1.5 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Departure */}
                  <div className="relative mb-6 pl-4">
                    <div>
                      <div className="text-base font-bold text-black dark:text-white text-lg">
                        {offer.OutboundSegments[0].Departure.CityName} ({offer.OutboundSegments[0].Departure.IATACode})
                      </div>
                      <div className="text-3xl font-extrabold text-black dark:text-white">
                        {formatTime(offer.OutboundSegments[0].Departure.ScheduledTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(offer.OutboundSegments[0].Departure.ScheduledTime)}
                      </div>
                      {offer.OutboundSegments[0].Departure.Terminal && (
                        <div className="text-sm text-muted-foreground">
                          Terminal: {offer.OutboundSegments[0].Departure.Terminal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration info for mobile */}
                  <div className="relative mb-6 pl-4">
                    <div className="text-sm bg-gray-50 dark:bg-gray-900/20 px-3 py-2 rounded-md inline-block">
                      {getStopsWithAirports(offer.OutboundSegments)}
                    </div>
                  </div>

                  {/* Final Destination */}
                  <div className="relative pl-4">
                    <div>
                      <div className="text-base font-bold text-black dark:text-white text-lg">
                        {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.CityName}
                        ({offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.IATACode})
                      </div>
                      <div className="text-3xl font-extrabold text-black dark:text-white">
                        {formatTime(offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.ScheduledTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.ScheduledTime)}
                      </div>
                      {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.Terminal && (
                        <div className="text-sm text-muted-foreground">
                          Terminal: {offer.OutboundSegments[offer.OutboundSegments.length - 1].Arrival.Terminal}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Info row - Adjusted spacing */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <div>{formatDate(offer.OutboundSegments[0].Departure.ScheduledTime)}</div>
                <div className="flex items-center gap-2">
                  <BaggageClaim className="w-4 h-4" />
                  {offer.Baggage[0].CheckIn[0]?.allowance || '20kg'}
                </div>
                <div className={offer.Refundable ? "text-green-600" : "text-red-600"}>
                  {offer.Refundable ? 'Refundable' : 'Non-Refundable'}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Fare section */}
          <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
            <div className="space-y-4">
              <Select value={selectedFare} onValueChange={handleBrandSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Fare" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  {offer.UpSellBrandList?.map((brand) => (
                    <SelectItem 
                      key={brand.upSellBrand.offerId} 
                      value={brand.upSellBrand.brandName}
                      className="hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      {brand.upSellBrand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Fare Details */}
              {selectedBrand && (
                <div className="space-y-3 text-sm">
                  {/* Refundable Status - Keep original colors */}
                  <div className="flex items-center gap-2">
                    {selectedBrand.upSellBrand.refundable ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-green-600">Refundable</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-3 h-3 text-red-600" />
                        </div>
                        <span className="text-red-600">Non-Refundable</span>
                      </>
                    )}
                  </div>

                  {/* Update all other icons to green */}
                  {/* Baggage */}
                  <div className="flex items-center gap-2">
                    <BaggageClaim className="w-4 h-4 text-green-600" />
                    <span>Adult Baggage: {getBaggageAllowance(selectedBrand)}</span>
                  </div>

                  {/* Booking Class */}
                  {selectedBrand.upSellBrand.rbd && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span>Booking Class: {selectedBrand.upSellBrand.rbd}</span>
                    </div>
                  )}

                  {/* Meal */}
                  {selectedBrand.upSellBrand.meal && (
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-green-600" />
                      <span>Meal Included</span>
                    </div>
                  )}

                  {/* Seat */}
                  {selectedBrand.upSellBrand.seat && (
                    <div className="flex items-center gap-2">
                      <Armchair className="w-4 h-4 text-green-600" />
                      <span>{selectedBrand.upSellBrand.seat}</span>
                    </div>
                  )}

                  {/* Seats Remaining */}
                  {offer.SeatsRemaining && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{offer.SeatsRemaining} seats remaining</span>
                    </div>
                  )}

                  {/* Miles */}
                  {selectedBrand.upSellBrand.miles && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-600" />
                      <span>{selectedBrand.upSellBrand.miles}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price and Button */}
            <div>
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  BDT {formatPrice(selectedBrand?.upSellBrand.price.totalPayable.total || offer.Pricing.totalPayable.total)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Price
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Select <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Tabs - Improved Responsiveness */}
        <div className="mt-4 border-t pt-4">
          {/* Tabs Container */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabButton
              active={activeTab === "flight-details"}
              onClick={() => setActiveTab(activeTab === "flight-details" ? null : "flight-details")}
              icon={<Plane className="h-4 w-4" />}
              label={<span className="text-base">Flight Details</span>}
              showChevron
            />
            <TabButton
              active={activeTab === "fare-summary"}
              onClick={() => setActiveTab(activeTab === "fare-summary" ? null : "fare-summary")}
              icon={<Receipt className="h-4 w-4" />}
              label={<span className="text-base">Fare Summary</span>}
              showChevron
            />
            <TabButton
              active={activeTab === "baggage"}
              onClick={() => setActiveTab(activeTab === "baggage" ? null : "baggage")}
              icon={<Luggage className="h-4 w-4" />}
              label={<span className="text-base">Baggage</span>}
              showChevron
            />
          </div>

          {/* Tab Content - Improved Responsiveness */}
          <div className="relative mt-3 overflow-x-auto max-h-[400px] overflow-y-auto">
            <div className="min-w-full">
              {activeTab === 'flight-details' && renderFlightDetails()}
              {activeTab === 'fare-summary' && renderFareSummary()}
              {activeTab === 'baggage' && renderBaggageInfo()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Tab Button Component
const TabButton = ({ 
  active, 
  onClick, 
  icon, 
  label,
  showChevron 
}: { 
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: React.ReactNode
  showChevron?: boolean
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-md
      text-sm font-medium whitespace-nowrap
      transition-colors duration-200
      ${active 
        ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" 
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
      }
    `}
  >
    {icon}
    <span>{label}</span>
    {showChevron && (
      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${active ? 'rotate-180' : ''}`} />
    )}
  </button>
);

export default OneWayFlightCard 