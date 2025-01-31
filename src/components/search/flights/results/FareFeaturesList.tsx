import { Clock, Briefcase, UtensilsCrossed, Armchair, Star, CalendarCheck, Check } from 'lucide-react'
import { FareFeatures } from '@/types/types'

export function FareFeaturesList({ features }: { features: FareFeatures }) {
  const featuresList = [
    {
      icon: Clock,
      label: `Cancellation Fee starting ${features.cancellationFee}`,
    },
    {
      icon: Briefcase,
      label: `Cabin Bag ${features.cabinBaggage}`,
    },
    {
      icon: UtensilsCrossed,
      label: "Meal Beverage",
      isAvailable: features.mealBeverage,
    },
    {
      icon: Armchair,
      label: "Pre Reserved Seat Assignment",
      isAvailable: features.preReservedSeat,
    },
    {
      icon: Star,
      label: "Premium Seat",
      isAvailable: features.premiumSeat,
    },
    {
      icon: CalendarCheck,
      label: features.freeDateChange,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {featuresList.map((feature, index) => {
        const Icon = feature.icon
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className="w-4 h-4 fill-foreground" />
            <span className="text-muted-foreground">{feature.label}</span>
            {'isAvailable' in feature && feature.isAvailable && (
              <Check className="w-4 h-4 text-green-500 ml-auto" />
            )}
          </div>
        )
      })}
    </div>
  )
}

