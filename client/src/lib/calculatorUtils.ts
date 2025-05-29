import { CalculationInput, CalculationResult } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateResults(input: CalculationInput): CalculationResult {
  // Calculate total flights per year
  const totalFlightsPerYear = input.numSites * input.flightsPerDay * input.flightDaysPerWeek * 52; // 52 weeks per year
  
  // Calculate manual costs - travel cost per pilot based on number of pilots needed
  const totalPilotHoursNeeded = totalFlightsPerYear * input.pilotTimePerFlight;
  const pilotsNeeded = Math.ceil(totalPilotHoursNeeded / (input.weeklyHoursPerPilot * 52));
  const annualTravelCost = pilotsNeeded * input.travelAndRelatedCostsPerPilot;
  const hourlyPilotRate = input.pilotSalary / (input.weeklyHoursPerPilot * 52); // Convert annual salary to hourly
  const annualManualLaborCost = totalFlightsPerYear * input.pilotTimePerFlight * hourlyPilotRate;
  const annualManualTotalCost = annualTravelCost + annualManualLaborCost + input.equipmentCostPerYear;
  const fiveYearManualCost = annualManualTotalCost * 5;
  
  // Calculate remote costs based on hub type and managed flight services
  let hubCost = 0;
  if (input.hubType === "HubX") {
    hubCost = 100000;
  } else if (input.hubType === "HubT") {
    hubCost = 60000;
  }
  
  const managedFlightServicesCost = input.managedFlightServices === "Yes" ? 40000 : 0;
  const annualRemoteCost = hubCost + managedFlightServicesCost;
  const fiveYearRemoteCost = annualRemoteCost * 5;
  
  // Calculate savings and ROI
  const fiveYearSavings = fiveYearManualCost - fiveYearRemoteCost;
  const savingsPercentage = Math.round((fiveYearSavings / fiveYearManualCost) * 100);
  
  // Calculate time saved (assuming remote operations require minimal time)
  const annualManualHours = totalFlightsPerYear * input.pilotTimePerFlight;
  const annualRemoteHours = totalFlightsPerYear * 0.1; // Assume 0.1 hours per remote flight
  const annualHoursSaved = annualManualHours - annualRemoteHours;
  const fiveYearHoursSaved = annualHoursSaved * 5;
  const efficiencyGain = Math.round(((annualManualHours - annualRemoteHours) / annualManualHours) * 100);
  
  // Calculate ROI timeframe
  const annualSavings = annualManualTotalCost - annualRemoteCost;
  const roiTimeframe = annualSavings > 0 ? Math.abs(annualRemoteCost / annualSavings) : 0;
  
  // Create yearly data for chart
  const yearlyManualCosts = [
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost,
    annualManualTotalCost
  ];
  
  const yearlyRemoteCosts = [
    annualRemoteCost,
    annualRemoteCost,
    annualRemoteCost,
    annualRemoteCost,
    annualRemoteCost
  ];
  
  return {
    annualTravelCost,
    annualManualLaborCost,
    annualManualTotalCost,
    fiveYearManualCost,
    totalDroneBoxCost: 0, // Not used in new model
    annualDroneBoxAmortized: 0, // Not used in new model
    annualRemoteLaborCost: 0, // Included in fixed cost
    firstYearRemoteCost: annualRemoteCost,
    subsequentYearRemoteCost: annualRemoteCost,
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
