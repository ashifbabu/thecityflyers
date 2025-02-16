"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, ChevronRight, Luggage, BaggageClaim, Receipt, ChevronDown } from "lucide-react"
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
  Pricing: {
    totalPayable: {
      total: number
      currency: string
    }
    totalPassengers: number
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {/* Left side - Flight info */}
          <div>
            {/* Airline Info - Reduced vertical spacing */}
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
                    {offer.OutboundSegments[0].MarketingCarrier.marketingCarrierFlightNumber}
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
                  <div className="text-base font-bold text-black dark:text-white">
                    {offer.OutboundSegments[0].Departure.CityName}
                  </div>
                  <div className="text-4xl font-extrabold text-black dark:text-white my-1">
                    {formatTime(offer.OutboundSegments[0].Departure.ScheduledTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(offer.OutboundSegments[0].Departure.ScheduledTime)}
                  </div>
                  <div className="mt-1">
                    {offer.OutboundSegments[0].Departure.AirportName}
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
                    {offer.OutboundSegments[0].Duration}
                  </div>
                  <div className="w-32 h-px bg-border relative my-2">
                    <Plane className="w-4 h-4 absolute -top-2 right-0" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Direct
                  </div>
                </div>

                {/* Arrival - Desktop */}
                <div className="text-right">
                  <div className="text-base font-bold text-black dark:text-white">
                    {offer.OutboundSegments[0].Arrival.CityName}
                  </div>
                  <div className="text-4xl font-extrabold text-black dark:text-white my-1">
                    {formatTime(offer.OutboundSegments[0].Arrival.ScheduledTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(offer.OutboundSegments[0].Arrival.ScheduledTime)}
                  </div>
                  <div className="mt-1">
                    {offer.OutboundSegments[0].Arrival.AirportName}
                  </div>
                  {offer.OutboundSegments[0].Arrival.Terminal && (
                    <div className="text-sm text-muted-foreground">
                      Terminal: {offer.OutboundSegments[0].Arrival.Terminal}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div className="sm:hidden">
                <div className="relative">
                  {/* Vertical line for mobile */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  
                  {/* Departure */}
                  <div className="relative flex gap-4 mb-6">
                    <div className="w-3 h-3 rounded-full bg-black mt-2" />
                    <div>
                      <div className="text-base font-bold text-black dark:text-white">
                        {offer.OutboundSegments[0].Departure.CityName}
                      </div>
                      <div className="text-4xl font-extrabold text-black dark:text-white">
                        {formatTime(offer.OutboundSegments[0].Departure.ScheduledTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(offer.OutboundSegments[0].Departure.ScheduledTime)}
                      </div>
                      <div className="mt-1">
                        {offer.OutboundSegments[0].Departure.AirportName}
                      </div>
                      {offer.OutboundSegments[0].Departure.Terminal && (
                        <div className="text-sm text-muted-foreground">
                          Terminal: {offer.OutboundSegments[0].Departure.Terminal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration info for mobile */}
                  <div className="relative flex gap-4 mb-6">
                    <div className="w-3 h-3 rounded-full bg-transparent" />
                    <div className="text-sm">
                      {offer.OutboundSegments[0].Duration} • Direct
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="relative flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-black mt-2" />
                    <div>
                      <div className="text-base font-bold text-black dark:text-white">
                        {offer.OutboundSegments[0].Arrival.CityName}
                      </div>
                      <div className="text-4xl font-extrabold text-black dark:text-white">
                        {formatTime(offer.OutboundSegments[0].Arrival.ScheduledTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(offer.OutboundSegments[0].Arrival.ScheduledTime)}
                      </div>
                      <div className="mt-1">
                        {offer.OutboundSegments[0].Arrival.AirportName}
                      </div>
                      {offer.OutboundSegments[0].Arrival.Terminal && (
                        <div className="text-sm text-muted-foreground">
                          Terminal: {offer.OutboundSegments[0].Arrival.Terminal}
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
                <div className="text-green-600">
                  {offer.Refundable ? 'Refundable' : 'Non-Refundable'}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Fare section */}
          <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
            <div>
              <Select value={selectedFare} onValueChange={handleBrandSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Economy" />
                </SelectTrigger>
                <SelectContent>
                  {offer.UpSellBrandList?.map((brand) => (
                    <SelectItem 
                      key={brand.upSellBrand.offerId} 
                      value={brand.upSellBrand.brandName}
                    >
                      {brand.upSellBrand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground mt-2">
                Upgrade to enjoy premium services
              </div>
            </div>

            <div>
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  BDT {formatPrice(offer.Pricing.totalPayable.total * totalPassengers)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalPassengers > 1 
                    ? `Total price for ${totalPassengers} passengers`
                    : 'Price per adult'
                  }
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-black text-white hover:bg-black/90"
              >
                Select <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Tabs - Simplified */}
        <div className="mt-4 border-t pt-4">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={activeTab === "flight-details"}
              onClick={() => setActiveTab(activeTab === "flight-details" ? null : "flight-details")}
              icon={<Plane className="h-4 w-4" />}
              label="Flight Details"
              showChevron
            />
            <TabButton
              active={activeTab === "fare-summary"}
              onClick={() => setActiveTab(activeTab === "fare-summary" ? null : "fare-summary")}
              icon={<Receipt className="h-4 w-4" />}
              label="Fare Summary"
              showChevron
            />
            <TabButton
              active={activeTab === "baggage"}
              onClick={() => setActiveTab(activeTab === "baggage" ? null : "baggage")}
              icon={<Luggage className="h-4 w-4" />}
              label="Baggage"
              showChevron
            />
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
  label: string
  showChevron?: boolean
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 
      text-sm font-medium
      ${active 
        ? "text-black dark:text-white" 
        : "text-gray-600 dark:text-gray-400"
      }
    `}
  >
    {icon}
    <span>{label}</span>
    {showChevron && (
      <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${active ? 'rotate-180' : ''}`} />
    )}
  </button>
);

export default OneWayFlightCard 