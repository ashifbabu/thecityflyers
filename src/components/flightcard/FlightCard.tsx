"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, ChevronRight, Luggage, BaggageClaim, Receipt,Clock  } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface FlightSegment {
  From: {
    Code: string
    Name: string
    DepartureTime: string
    Terminal?: number
  }
  To: {
    Code: string
    Name: string
    ArrivalTime: string
    Terminal?: number
  }
  Airline: {
    Name: string
    Code: string
    Logo: string
  }
  FlightNumber: string
  CabinClass: string
  Duration: string
  SeatsRemaining?: number
}

interface FlightOffer {
  Source: string
  TraceId: string
  OfferId: string
  Segments: FlightSegment[]
  Pricing: Array<{
    PaxType: string
    Currency: string
    BaseFare: number
    Tax: number
    Total: number
    VAT: number
  }>
  BaggageAllowance: Array<{
    From: string
    To: string
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
  FareType: string
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

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getTotalDuration = (segments: FlightSegment[]) => {
  const firstDeparture = new Date(segments[0].From.DepartureTime)
  const lastArrival = new Date(segments[segments.length - 1].To.ArrivalTime)
  const diffInMinutes = Math.floor((lastArrival.getTime() - firstDeparture.getTime()) / (1000 * 60))
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  return `${hours}h ${minutes}m`
}

const FlightCard: React.FC<{ offer: FlightOffer }> = ({ offer }) => {
  const firstSegment = offer.Segments[0]
  const lastSegment = offer.Segments[offer.Segments.length - 1]
  const isMultiSegment = offer.Segments.length > 1
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const getLayoverDuration = (currentSegment: FlightSegment, nextSegment: FlightSegment) => {
    const currentArrival = new Date(currentSegment.To.ArrivalTime)
    const nextDeparture = new Date(nextSegment.From.DepartureTime)
    const diffInMinutes = Math.floor((nextDeparture.getTime() - currentArrival.getTime()) / (1000 * 60))
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getFlightNumbers = () => {
    return offer.Segments.map((segment) => `${segment.Airline.Code}-${segment.FlightNumber}`).join(", ")
  }

  const getBaggageInfo = () => {
    return offer.Segments.map((segment) => `${segment.From.Code}-${segment.To.Code} Check-In 2P, Cabin SB`).join("\n")
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
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
                  <div className="text-sm text-muted-foreground">{getFlightNumbers()}</div>
                </div>
              </div>
              {offer.Refundable && (
                <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded">Refundable</span>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
                <div>
                  <div className="text-lg font-bold">{firstSegment.From.Code}</div>
                  <div className="text-sm text-muted-foreground mb-1">{firstSegment.From.Name}</div>
                  <div className="text-3xl font-bold">{formatDate(firstSegment.From.DepartureTime).time}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(firstSegment.From.DepartureTime).date}
                  </div>
                </div>

                <div className="flex flex-col items-center my-4 sm:my-0">
                  <div className="text-sm font-medium">{getTotalDuration(offer.Segments)}</div>
                  <div className="w-32 sm:w-48 h-px bg-primary/30 relative my-2">
                    <Plane className="w-4 h-4 absolute -top-2 -right-2 text-primary" />
                  </div>
                  {isMultiSegment && (
                    <Popover>
                      <PopoverTrigger className="text-sm text-primary hover:underline">
                        {offer.Segments.length - 1} {offer.Segments.length - 1 === 1 ? "Stop" : "Stops"}
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          {offer.Segments.map((segment, index) => {
                            if (index < offer.Segments.length - 1) {
                              return (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Plane className="w-4 h-4 text-muted-foreground" />
                                  <span>
                                    Plane change - {segment.To.Name} ({segment.To.Code}) -{" "}
                                    <span className="text-muted-foreground">
                                      {getLayoverDuration(segment, offer.Segments[index + 1])} Layover
                                    </span>
                                  </span>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold">{lastSegment.To.Code}</div>
                  <div className="text-sm text-muted-foreground mb-1">{lastSegment.To.Name}</div>
                  <div className="text-3xl font-bold">{formatDate(lastSegment.To.ArrivalTime).time}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(lastSegment.To.ArrivalTime).date}</div>
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
                <SelectItem value="economy">
                  <div className="space-y-1">
                    <div>Economy</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">{getBaggageInfo()}</div>
                  </div>
                </SelectItem>
                <SelectItem value="business">
                  <div className="space-y-1">
                    <div>Business</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">{getBaggageInfo()}</div>
                  </div>
                </SelectItem>
                <SelectItem value="first">
                  <div className="space-y-1">
                    <div>First Class</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">{getBaggageInfo()}</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                <BaggageClaim className="w-4 h-4 text-primary" />
                <div className="text-sm whitespace-pre-line">{getBaggageInfo()}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-right mb-4">
                <div className="text-3xl font-bold">
                  {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Total)}
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
                {offer.Segments.map((segment, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex flex-col bg-muted/30 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={segment.Airline.Logo || "/placeholder.svg"}
                            alt={segment.Airline.Name}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <div className="font-medium">{segment.Airline.Name}</div>
                            <div className="text-sm text-muted-foreground">
                              Flight {segment.FlightNumber} · Economy · {segment.SeatsRemaining || 9} Seats Left
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{segment.Duration}</div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                          <div className="text-lg font-bold">{segment.From.Code}</div>
                          <div className="text-2xl font-bold my-1">{formatDate(segment.From.DepartureTime).time}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(segment.From.DepartureTime).date}
                          </div>
                          <div className="text-sm mt-2">{segment.From.Name}</div>
                          <div className="text-sm text-muted-foreground">Terminal {segment.From.Terminal || 1}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <div className="w-full h-px bg-border relative">
                            <Plane className="w-4 h-4 absolute -top-2 right-0 text-primary" />
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">{segment.To.Code}</div>
                          <div className="text-2xl font-bold my-1">{formatDate(segment.To.ArrivalTime).time}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(segment.To.ArrivalTime).date}</div>
                          <div className="text-sm mt-2">{segment.To.Name}</div>
                          <div className="text-sm text-muted-foreground">Terminal {segment.To.Terminal || 1}</div>
                        </div>
                      </div>
                    </div>

                    {index < offer.Segments.length - 1 && (
                      <div className="flex items-center gap-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <div>
                          <div className="font-medium">Layover at {segment.To.Name}</div>
                          <div className="text-sm text-muted-foreground">
                            Connection time: {getLayoverDuration(segment, offer.Segments[index + 1])}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "fare-summary" && (
              <div className="mt-6">
                <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Fare Breakdown</span>
                    <span className="text-sm text-muted-foreground">Price per adult</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span className="font-medium">
                      {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].BaseFare)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">
                      {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT</span>
                    <span className="font-medium">
                      {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].VAT)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">
                      {offer.Pricing[0].Currency} {formatPrice(offer.Pricing[0].Total)}
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
                        <p>{offer.BaggageAllowance[0].CheckIn[0].allowance}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Cabin Baggage</h4>
                      <div className="p-4 bg-background rounded border">
                        <p>{offer.BaggageAllowance[0].Cabin[0].allowance}</p>
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

