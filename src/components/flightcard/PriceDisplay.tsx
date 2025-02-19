'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PriceBreakdown {
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
}

interface PriceDisplayProps {
  pricing: PriceBreakdown;
  className?: string;
  showDetails?: boolean;
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  pricing, 
  className,
  showDetails = false 
}) => {
  if (!pricing || !pricing.totalPayable) {
    return null;
  }

  const hasDiscount = pricing.discount?.total && pricing.discount.total > 0;
  const hasVAT = pricing.totalVAT?.total && pricing.totalVAT.total > 0;
  const hasGross = pricing.gross?.total && pricing.gross.total > 0;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main Price */}
      <div className="text-right">
        <div className="text-3xl font-bold">
          {formatPrice(pricing.totalPayable.total)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Price
        </div>
      </div>

      {/* Price Details */}
      {showDetails && (
        <div className="text-sm space-y-1 border-t pt-2 mt-2">
          {hasGross && pricing.gross && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gross Fare</span>
              <span>{formatPrice(pricing.gross.total)}</span>
            </div>
          )}
          
          {hasDiscount && pricing.discount && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-{formatPrice(pricing.discount.total)}</span>
            </div>
          )}
          
          {hasVAT && pricing.totalVAT && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">VAT</span>
              <span>{formatPrice(pricing.totalVAT.total)}</span>
            </div>
          )}

          <div className="flex justify-between font-medium pt-1 border-t">
            <span>Net Payable</span>
            <span>{formatPrice(pricing.totalPayable.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;