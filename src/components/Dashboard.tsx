import React from 'react';
import LandingPage from './LandingPage';

interface DashboardProps {
  onCreateItinerary: () => void;
  onViewItineraries: () => void;
  onProfile: () => void;
}

export function Dashboard({ onCreateItinerary, onViewItineraries, onProfile }: DashboardProps) {
  return <LandingPage onCreateTrip={onCreateItinerary} />;
}