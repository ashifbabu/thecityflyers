'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const FlightLoadingSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 relative">
      {/* Generate 3 skeleton cards */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800",
            "p-6 space-y-6 overflow-hidden relative",
            "before:absolute before:inset-0 before:-translate-x-full",
            "before:animate-[shimmer_2s_infinite]",
            "before:bg-gradient-to-r",
            "before:from-transparent before:via-white/20 before:to-transparent"
          )}
        >
          {/* Airline Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
            <div className="space-y-6">
              {/* Flight Route */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Departure */}
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-800 relative animate-pulse">
                      <div className="absolute right-0 -top-1 w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-full" />
                    </div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>

                  {/* Arrival */}
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded ml-auto animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded ml-auto animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded ml-auto animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Price Section */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-6 space-y-6">
              {/* Fare Selection */}
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

              {/* Features Box */}
              <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded ml-auto animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded ml-auto animate-pulse" />
              </div>

              {/* CTA Button */}
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightLoadingSkeleton;