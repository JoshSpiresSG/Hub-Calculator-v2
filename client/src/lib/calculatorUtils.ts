import { CalculationInput, CalculationResult } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateResults(input: CalculationInput): CalculationResult {
  // Calculate manual costs
  const annualTravelCost = input.numSites * input.flightFrequency * input.travelCost;
  const annualManualLaborCost = input.numSites * input.flightFrequency * input.hoursPerFlight * input.pilotHourly;
  const annualManualTotalCost = annualTravelCost + annualManualLaborCost + input.equipmentCost;
  const fiveYearManualCost = annualManualTotalCost * 5;
  
  // Calculate remote costs
  const totalDroneBoxCost = input.numSites * input.droneBoxCost;
  const annualDroneBoxAmortized = totalDroneBoxCost / 3; // Amortized over 3 years
  const annualRemoteLaborCost = input.numSites * input.flightFrequency * input.remoteHours * input.remoteHourly;
  const firstYearRemoteCost = input.platformCost + totalDroneBoxCost + annualRemoteLaborCost;
  const subsequentYearRemoteCost = input.platformCost + annualRemoteLaborCost;
  const fiveYearRemoteCost = firstYearRemoteCost + (subsequentYearRemoteCost * 4);
  
  // Calculate savings and ROI
  const fiveYearSavings = fiveYearManualCost - fiveYearRemoteCost;
  const savingsPercentage = Math.round((fiveYearSavings / fiveYearManualCost) * 100);
  
  // Calculate time saved
  const annualManualHours = input.numSites * input.flightFrequency * input.hoursPerFlight;
  const annualRemoteHours = input.numSites * input.flightFrequency * input.remoteHours;
  const annualHoursSaved = annualManualHours - annualRemoteHours;
  const fiveYearHoursSaved = annualHoursSaved * 5;
  const efficiencyGain = Math.round(((annualManualHours - annualRemoteHours) / annualManualHours) * 100);
  
  // Calculate ROI timeframe
  const initialInvestment = totalDroneBoxCost + input.platformCost;
  const annualSavings = annualManualTotalCost - subsequentYearRemoteCost;
  const roiTimeframe = initialInvestment / annualSavings;
  
  // Create yearly data for chart
  const yearlyManualCosts = [
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost
  ];
  
  const yearlyRemoteCosts = [
    firstYearRemoteCost,
    subsequentYearRemoteCost,
    subsequentYearRemoteCost,
    subsequentYearRemoteCost,
    subsequentYearRemoteCost
  ];
  
  return {
    annualTravelCost,
    annualManualLaborCost,
    annualManualTotalCost,
    fiveYearManualCost,
    totalDroneBoxCost,
    annualDroneBoxAmortized,
    annualRemoteLaborCost,
    firstYearRemoteCost,
    subsequentYearRemoteCost,
    fiveYearRemoteCost,
    fiveYearSavings,
    savingsPercentage,
    annualManualHours,
    annualRemoteHours,
    annualHoursSaved,
    fiveYearHoursSaved,
    efficiencyGain,
    roiTimeframe,
    yearlyManualCosts,
    yearlyRemoteCosts
  };
}
