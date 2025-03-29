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
  RBD: string
  ReturnJourney: boolean
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

// Add new interface for split pricing structure
interface SplitPricing {
  FareDetails: {
    Outbound: Array<{
      BaseFare: number;
      Tax: number;
      OtherFee: number;
      Discount: number;
      VAT: number;
      Currency: string;
      PaxType: string;
      PaxCount: number;
      SubTotal: number;
    }>;
    Inbound: Array<{
      BaseFare: number;
      Tax: number;
      OtherFee: number;
      Discount: number;
      VAT: number;
      Currency: string;
      PaxType: string;
      PaxCount: number;
      SubTotal: number;
    }>;
  };
  PriceBreakdown: {
    Outbound: {
      totalPayable: {
        total: number;
        currency: string;
      };
      gross?: {
        total: number;
        currency: string;
      };
      discount?: {
        total: number;
        currency: string;
      };
      totalVAT?: {
        total: number;
        currency: string;
      };
    };
    Inbound: {
      totalPayable: {
        total: number;
        currency: string;
      };
      gross?: {
        total: number;
        currency: string;
      };
      discount?: {
        total: number;
        currency: string;
      };
      totalVAT?: {
        total: number;
        currency: string;
      };
    };
  };
}

// Update the ReturnFlightOffer interface
interface ReturnFlightOffer {
  OfferId: string
  OutboundSegments: FlightSegment[]
  InboundSegments: FlightSegment[]
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
    totalPayable?: {
      total: number
      currency: string
    }
    FareDetails?: {
      Outbound: Array<{
        BaseFare: number
        Tax: number
        VAT: number
        Currency: string
        PaxType: string
        PaxCount: number
        SubTotal: number
      }>
      Inbound: Array<{
        BaseFare: number
        Tax: number
        VAT: number
        Currency: string
        PaxType: string
        PaxCount: number
        SubTotal: number
      }>
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
  Baggage: {
    Outbound: Array<{
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
    Inbound: Array<{
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
  }
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

interface ReturnFlightCardProps {
  offer: ReturnFlightOffer;
  totalPassengers?: number;
}

const ReturnFlightCard: React.FC<ReturnFlightCardProps> = ({ offer, totalPassengers = 1 }) => {
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

  // Update the getBaggageAllowance function
  const getBaggageAllowance = () => {
    try {
      // Check if Baggage exists and has Outbound array
      if (!offer?.Baggage?.Outbound || !Array.isArray(offer.Baggage.Outbound) || offer.Baggage.Outbound.length === 0) {
        return '20kg';
      }

      // Check if first outbound segment has CheckIn array
      const outboundBaggage = offer.Baggage.Outbound[0];
      if (!outboundBaggage?.CheckIn || !Array.isArray(outboundBaggage.CheckIn)) {
        return '20kg';
      }

      // Find adult baggage allowance
      const checkInBaggage = outboundBaggage.CheckIn.find(
        (item: { paxType: string; allowance: string }) => 
          item && typeof item === 'object' && item.paxType === 'Adult'
      );

      // Return allowance if found, otherwise default to 20kg
      return checkInBaggage?.allowance || '20kg';
    } catch (error) {
      console.error('Error getting baggage allowance:', error);
      return '20kg';
    }
  };

  // Update the getBaggageAllowanceForBrand function
  const getBaggageAllowanceForBrand = (brand: UpSellBrand | null) => {
    try {
      // If no brand is selected, return default baggage allowance
      if (!brand) {
        return getBaggageAllowance();
      }

      // Check if baggageAllowanceList exists and has items
      if (!brand.upSellBrand?.baggageAllowanceList?.length) {
        return getBaggageAllowance();
      }

      // Get the first baggage allowance
      const baggageAllowance = brand.upSellBrand.baggageAllowanceList[0]?.baggageAllowance;
      if (!baggageAllowance?.checkIn?.length) {
        return getBaggageAllowance();
      }

      // Find adult baggage allowance
      const checkInBaggage = baggageAllowance.checkIn.find(
        item => item && typeof item === 'object' && item.paxType === 'Adult'
      );

      return checkInBaggage?.allowance || getBaggageAllowance();
    } catch (error) {
      console.error('Error getting brand baggage allowance:', error);
      return getBaggageAllowance();
    }
  };

  // Add this helper function to calculate stay duration
  const getStayDuration = () => {
    const { outbound, inbound } = getSegments();
    
    const outboundArrival = new Date(outbound[outbound.length - 1].Arrival.ScheduledTime);
    const inboundDeparture = new Date(inbound[0].Departure.ScheduledTime);
    const diffInMinutes = Math.floor((inboundDeparture.getTime() - outboundArrival.getTime()) / (1000 * 60));
    const days = Math.floor(diffInMinutes / (24 * 60));
    const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
    const minutes = diffInMinutes % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Add helper function to separate outbound and inbound segments
  const getSegments = () => {
    const outbound = offer.OutboundSegments.filter(segment => !segment.ReturnJourney);
    const inbound = offer.OutboundSegments.filter(segment => segment.ReturnJourney);
    
    return {
      outbound,
      inbound: inbound.length > 0 ? inbound : offer.InboundSegments
    };
  };

  // Update where segments are used
  const { outbound, inbound } = getSegments();

  // Update the flight details tab content
  const renderFlightDetails = () => {
    if (activeTab !== 'flight-details') return null;

    return (
      <div className="space-y-6 overflow-x-auto">
        {/* Departure Flight Details */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-4">Departure Flight</div>
          <div className="space-y-4">
            {outbound.map((segment, index) => {
              const layoverDetails = index < outbound.length - 1 
                ? getLayoverDetails(outbound)[index] 
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
        </div>

        {/* Stay Duration Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-black px-4 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 inline-block mr-1" />
              Stay {getStayDuration()}
            </span>
          </div>
        </div>

        {/* Return Flight Details */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-4">Return Flight</div>
          <div className="space-y-4">
            {inbound.map((segment, index) => {
              const layoverDetails = index < inbound.length - 1 
                ? getLayoverDetails(inbound)[index] 
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
        </div>
      </div>
    );
  };

  // Update the renderFareSummary function
  const renderFareSummary = () => {
    if (activeTab !== 'fare-summary') return null;

    // Get the fare details from the correct structure
    const fareDetails = {
      outbound: offer.Pricing?.FareDetails?.Outbound || [],
      inbound: offer.Pricing?.FareDetails?.Inbound || []
    };

    // Get total amounts from FareDetails
    const outboundTotal = fareDetails.outbound.reduce((total, fare) => total + (fare.SubTotal || 0), 0);
    const inboundTotal = fareDetails.inbound.reduce((total, fare) => total + (fare.SubTotal || 0), 0);

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-0 space-y-6">
          {/* Outbound Fare Details */}
          <div className="space-y-4">
            <div className="text-lg font-semibold">Outbound Flight Fare</div>
            {fareDetails.outbound.map((fare, index) => (
              <div key={`outbound-${index}`} className="space-y-2">
                <div className="font-medium">
                  {fare.PaxType} × {fare.PaxCount}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm pl-4">
                  <div className="text-muted-foreground">Base Fare</div>
                  <div>BDT {formatPrice(fare.BaseFare || 0)}</div>
                  <div className="text-muted-foreground">Tax</div>
                  <div>BDT {formatPrice(fare.Tax || 0)}</div>
                  <div className="text-muted-foreground">VAT</div>
                  <div>BDT {formatPrice(fare.VAT || 0)}</div>
                  <div className="font-medium">Subtotal</div>
                  <div className="font-medium">BDT {formatPrice(fare.SubTotal || 0)}</div>
                </div>
              </div>
            ))}
            <div className="text-right text-sm">
              <div>Total: BDT {formatPrice(outboundTotal)}</div>
            </div>
          </div>

          {/* Inbound Fare Details */}
          <div className="space-y-4">
            <div className="text-lg font-semibold">Return Flight Fare</div>
            {fareDetails.inbound.map((fare, index) => (
              <div key={`inbound-${index}`} className="space-y-2">
                <div className="font-medium">
                  {fare.PaxType} × {fare.PaxCount}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm pl-4">
                  <div className="text-muted-foreground">Base Fare</div>
                  <div>BDT {formatPrice(fare.BaseFare || 0)}</div>
                  <div className="text-muted-foreground">Tax</div>
                  <div>BDT {formatPrice(fare.Tax || 0)}</div>
                  <div className="text-muted-foreground">VAT</div>
                  <div>BDT {formatPrice(fare.VAT || 0)}</div>
                  <div className="font-medium">Subtotal</div>
                  <div className="font-medium">BDT {formatPrice(fare.SubTotal || 0)}</div>
                </div>
              </div>
            ))}
            <div className="text-right text-sm">
              <div>Total: BDT {formatPrice(inboundTotal)}</div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium text-base">Grand Total</div>
              <div className="font-medium text-base text-right">
                BDT {formatPrice(outboundTotal + inboundTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBaggageInfo = () => {
    if (activeTab !== 'baggage') return null;

    // Get baggage info from the correct structure
    const baggageInfo = {
      outbound: offer.Baggage?.Outbound?.[0] || null,
      inbound: offer.Baggage?.Inbound?.[0] || null
    };

    const renderBaggageSection = (baggage: any, title: string) => {
      if (!baggage) {
        // Provide default baggage info if none exists
        return (
          <div className="space-y-4">
            <div className="font-semibold">{title}</div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Check-in Baggage</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Adult</div>
                  <div className="font-medium">20kg</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Cabin Baggage</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Adult</div>
                  <div className="font-medium">7kg</div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="font-semibold">{title}</div>
          
          {/* Check-in Baggage */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Check-in Baggage</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {baggage.CheckIn?.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">{item.paxType}</div>
                  <div className="font-medium">{item.allowance}</div>
                </div>
              )) || (
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Adult</div>
                  <div className="font-medium">20kg</div>
                </div>
              )}
            </div>
          </div>

          {/* Cabin Baggage */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Cabin Baggage</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {baggage.Cabin?.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">{item.paxType}</div>
                  <div className="font-medium">{item.allowance}</div>
                </div>
              )) || (
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Adult</div>
                  <div className="font-medium">7kg</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {renderBaggageSection(baggageInfo.outbound, "Outbound Flight Baggage")}
        {renderBaggageSection(baggageInfo.inbound, "Return Flight Baggage")}
      </div>
    );
  };

  // Update getTotalPrice function
  const getTotalPrice = (offer: ReturnFlightOffer): number => {
    try {
      // First check selected brand price if available
      if (selectedBrand?.upSellBrand?.price?.totalPayable?.total) {
        return selectedBrand.upSellBrand.price.totalPayable.total;
      }
  
      // Check main pricing structure (Biman Airlines structure)
      if (offer.Pricing?.totalPayable?.total) {
        return offer.Pricing.totalPayable.total;
      }
  
      // Check FareDetails array
      if (Array.isArray(offer.FareDetails) && offer.FareDetails.length > 0) {
        return offer.FareDetails.reduce((total, detail) => 
          total + (parseFloat(detail.SubTotal.toString()) || 0), 0
        );
      }
  
      // Check for split pricing structure
      if (offer.Pricing?.FareDetails) {
        let total = 0;
  
        // Add outbound fares
        if (Array.isArray(offer.Pricing.FareDetails.Outbound)) {
          total += offer.Pricing.FareDetails.Outbound.reduce((sum, fare) => 
            sum + (parseFloat(fare.SubTotal.toString()) || 0), 0
          );
        }
  
        // Add inbound fares
        if (Array.isArray(offer.Pricing.FareDetails.Inbound)) {
          total += offer.Pricing.FareDetails.Inbound.reduce((sum, fare) => 
            sum + (parseFloat(fare.SubTotal.toString()) || 0), 0
          );
        }
  
        if (total > 0) return total;
      }
  
      // Log unhandled pricing structure
      console.warn('Unhandled pricing structure in ReturnFlightCard:', {
        hasPricing: !!offer.Pricing,
        hasTotalPayable: !!offer.Pricing?.totalPayable,
        hasFareDetails: !!offer.FareDetails,
        hasPricingFareDetails: !!offer.Pricing?.FareDetails,
        hasPriceBreakdown: !!offer.Pricing?.PriceBreakdown,
        pricingStructure: offer.Pricing,
        fareDetails: offer.FareDetails
      });
  
      return 0;
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {/* Left side - Flight info */}
          <div className="space-y-4">
            {/* Outbound Flight */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Departure Flight</div>
              {/* Airline Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={outbound[0].Logo || DEFAULT_AIRLINE_LOGO}
                    alt={outbound[0].MarketingCarrier.carrierName}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <div className="text-lg font-semibold">
                      {outbound[0].MarketingCarrier.carrierName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold">
                        {outbound[0].MarketingCarrier.carrierDesigCode}
                      </span>
                      -{outbound[0].MarketingCarrier.marketingCarrierFlightNumber}
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
                    <div className="text-base font-bold">
                      {outbound[0].Departure.CityName} ({outbound[0].Departure.IATACode})
                    </div>
                    <div className="text-4xl font-extrabold my-1">
                      {formatTime(outbound[0].Departure.ScheduledTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(outbound[0].Departure.ScheduledTime)}
                    </div>
                    {outbound[0].Departure.Terminal && (
                      <div className="text-sm text-muted-foreground">
                        Terminal: {outbound[0].Departure.Terminal}
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-medium">
                      {getTotalDuration(outbound)}
                    </div>
                    <div className="w-32 h-px bg-border relative my-2">
                      <Plane className="w-4 h-4 absolute -top-2 right-0" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getStopsWithAirports(outbound)}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <div className="text-base font-bold">
                      {outbound[outbound.length - 1].Arrival.CityName} 
                      ({outbound[outbound.length - 1].Arrival.IATACode})
                    </div>
                    <div className="text-4xl font-extrabold my-1">
                      {formatTime(outbound[outbound.length - 1].Arrival.ScheduledTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(outbound[outbound.length - 1].Arrival.ScheduledTime)}
                    </div>
                    {outbound[outbound.length - 1].Arrival.Terminal && (
                      <div className="text-sm text-muted-foreground">
                        Terminal: {outbound[outbound.length - 1].Arrival.Terminal}
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
                          {outbound[0].Departure.CityName} ({outbound[0].Departure.IATACode})
                        </div>
                        <div className="text-3xl font-extrabold text-black dark:text-white">
                          {formatTime(outbound[0].Departure.ScheduledTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(outbound[0].Departure.ScheduledTime)}
                        </div>
                        {outbound[0].Departure.Terminal && (
                          <div className="text-sm text-muted-foreground">
                            Terminal: {outbound[0].Departure.Terminal}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration info for mobile */}
                    <div className="relative mb-6 pl-4">
                      <div className="text-sm bg-gray-50 dark:bg-gray-900/20 px-3 py-2 rounded-md inline-block">
                        {getStopsWithAirports(outbound)}
                      </div>
                    </div>

                    {/* Final Destination */}
                    <div className="relative pl-4">
                      <div>
                        <div className="text-base font-bold text-black dark:text-white text-lg">
                          {outbound[outbound.length - 1].Arrival.CityName}
                          ({outbound[outbound.length - 1].Arrival.IATACode})
                        </div>
                        <div className="text-3xl font-extrabold text-black dark:text-white">
                          {formatTime(outbound[outbound.length - 1].Arrival.ScheduledTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(outbound[outbound.length - 1].Arrival.ScheduledTime)}
                        </div>
                        {outbound[outbound.length - 1].Arrival.Terminal && (
                          <div className="text-sm text-muted-foreground">
                            Terminal: {outbound[outbound.length - 1].Arrival.Terminal}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Duration Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-black px-4 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline-block mr-1" />
                  Stay {getStayDuration()}
                </span>
              </div>
            </div>

            {/* Return Flight */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Return Flight</div>
              {/* Airline Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={inbound[0].Logo || DEFAULT_AIRLINE_LOGO}
                    alt={inbound[0].MarketingCarrier.carrierName}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <div className="text-lg font-semibold">
                      {inbound[0].MarketingCarrier.carrierName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold">
                        {inbound[0].MarketingCarrier.carrierDesigCode}
                      </span>
                      -{inbound[0].MarketingCarrier.marketingCarrierFlightNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Flight Section */}
              <div className="bg-muted/30 p-4 rounded-lg">
                {/* Desktop View */}
                <div className="hidden sm:grid sm:grid-cols-[1fr,auto,1fr] sm:gap-8">
                  {/* Departure */}
                  <div>
                    <div className="text-base font-bold">
                      {inbound[0].Departure.CityName} ({inbound[0].Departure.IATACode})
                    </div>
                    <div className="text-4xl font-extrabold my-1">
                      {formatTime(inbound[0].Departure.ScheduledTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(inbound[0].Departure.ScheduledTime)}
                    </div>
                    {inbound[0].Departure.Terminal && (
                      <div className="text-sm text-muted-foreground">
                        Terminal: {inbound[0].Departure.Terminal}
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-medium">
                      {getTotalDuration(inbound)}
                    </div>
                    <div className="w-32 h-px bg-border relative my-2">
                      <Plane className="w-4 h-4 absolute -top-2 right-0" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getStopsWithAirports(inbound)}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <div className="text-base font-bold">
                      {inbound[inbound.length - 1].Arrival.CityName} 
                      ({inbound[inbound.length - 1].Arrival.IATACode})
                    </div>
                    <div className="text-4xl font-extrabold my-1">
                      {formatTime(inbound[inbound.length - 1].Arrival.ScheduledTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(inbound[inbound.length - 1].Arrival.ScheduledTime)}
                    </div>
                    {inbound[inbound.length - 1].Arrival.Terminal && (
                      <div className="text-sm text-muted-foreground">
                        Terminal: {inbound[inbound.length - 1].Arrival.Terminal}
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
                    
                    {/* Return Departure */}
                    <div className="relative mb-6 pl-4">
                      <div>
                        <div className="text-base font-bold text-black dark:text-white text-lg">
                          {inbound[0].Departure.CityName} ({inbound[0].Departure.IATACode})
                        </div>
                        <div className="text-3xl font-extrabold text-black dark:text-white">
                          {formatTime(inbound[0].Departure.ScheduledTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(inbound[0].Departure.ScheduledTime)}
                        </div>
                        {inbound[0].Departure.Terminal && (
                          <div className="text-sm text-muted-foreground">
                            Terminal: {inbound[0].Departure.Terminal}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration info for mobile */}
                    <div className="relative mb-6 pl-4">
                      <div className="text-sm bg-gray-50 dark:bg-gray-900/20 px-3 py-2 rounded-md inline-block">
                        {getStopsWithAirports(inbound)}
                      </div>
                    </div>

                    {/* Return Final Destination */}
                    <div className="relative pl-4">
                      <div>
                        <div className="text-base font-bold text-black dark:text-white text-lg">
                          {inbound[inbound.length - 1].Arrival.CityName}
                          ({inbound[inbound.length - 1].Arrival.IATACode})
                        </div>
                        <div className="text-3xl font-extrabold text-black dark:text-white">
                          {formatTime(inbound[inbound.length - 1].Arrival.ScheduledTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(inbound[inbound.length - 1].Arrival.ScheduledTime)}
                        </div>
                        {inbound[inbound.length - 1].Arrival.Terminal && (
                          <div className="text-sm text-muted-foreground">
                            Terminal: {inbound[inbound.length - 1].Arrival.Terminal}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info row */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="space-y-2">
                {/* First row - Departure date */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">Departure:</div>
                    <div>{formatDate(outbound[0].Departure.ScheduledTime)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BaggageClaim className="w-4 h-4" />
                    {getBaggageAllowance()}
                  </div>
                  <div className={offer.Refundable ? "text-green-600" : "text-red-600"}>
                    {offer.Refundable ? 'Refundable' : 'Non-Refundable'}
                  </div>
                </div>

                {/* Second row - Return date with baggage and refundable status */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">Return:</div>
                    <div>{formatDate(inbound[0].Departure.ScheduledTime)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BaggageClaim className="w-4 h-4" />
                    {getBaggageAllowance()}
                  </div>
                  <div className={offer.Refundable ? "text-green-600" : "text-red-600"}>
                    {offer.Refundable ? 'Refundable' : 'Non-Refundable'}
                  </div>
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
              <div className="space-y-3 text-sm">
                {/* Refundable Status */}
                <div className="flex items-center gap-2">
                  {offer.Refundable ? (
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

                {/* Baggage */}
                <div className="flex items-center gap-2">
                  <BaggageClaim className="w-4 h-4 text-green-600" />
                  <span>Adult Baggage: {getBaggageAllowance()}</span>
                </div>

                {/* Booking Class */}
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span>Booking Class: {outbound[0].RBD}</span>
                </div>

                {/* Cabin Type */}
                <div className="flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-green-600" />
                  <span>{outbound[0].CabinType}</span>
                </div>

                {/* Seats Remaining */}
                {offer.SeatsRemaining && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>{offer.SeatsRemaining} seats remaining</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Button */}
            <div>
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  BDT {formatPrice(
                    selectedBrand?.upSellBrand?.price?.totalPayable?.total || 
                    getTotalPrice(offer)
                  )}
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

export default ReturnFlightCard 