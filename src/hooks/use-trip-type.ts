'use client'

import { create } from 'zustand';

type TripType = 'oneWay' | 'roundTrip' | 'multiCity';

interface TripTypeStore {
  tripType: TripType;
  setTripType: (type: TripType) => void;
}

export const useTripType = create<TripTypeStore>((set) => ({
  tripType: 'oneWay',
  setTripType: (type) => set({ tripType: type }),
}));