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
  
  // Calculate manual costs - pilots needed per site based on flight hours
  const flightHoursPerWeekPerSite = input.flightsPerDay * input.flightDaysPerWeek * input.pilotTimePerFlight;
  const pilotsNeededPerSite = flightHoursPerWeekPerSite / input.weeklyHoursPerPilot;
  const totalPilotsNeeded = pilotsNeededPerSite * input.numSites;
  const annualTravelCost = Math.ceil(totalPilotsNeeded) * input.travelAndRelatedCostsPerPilot; // Travel costs for whole pilots
  const annualManualLaborCost = totalPilotsNeeded * input.pilotSalary; // Labor costs for fractional pilots
  
  // Equipment costs: per site, depreciated over 3 years, plus 10% maintenance per drone per year
  const totalDrones = input.numSites * input.dronesPerSite;
  const equipmentDepreciationPerYear = (input.equipmentCostPerYear * input.numSites) / 3; // Depreciated over 3 years
  const maintenanceCostPerYear = (input.equipmentCostPerYear * totalDrones) * 0.1; // 10% maintenance per drone
  const totalEquipmentCostPerYear = equipmentDepreciationPerYear + maintenanceCostPerYear;
  
  const annualManualTotalCost = annualTravelCost + annualManualLaborCost + totalEquipmentCostPerYear;
  const fiveYearManualCost = annualManualTotalCost * 5;
  
  // Calculate remote costs based on hub type and managed flight services
  let hubCost = 0;
  if (input.hubType === "HubX") {
    hubCost = 100000;
  } else if (input.hubType === "HubT") {
    hubCost = 60000;
  }
  
  // Remote labor costs: calculate pilots needed for remote operations
  const totalRemoteFlightHours = totalFlightsPerYear * input.remotePilotTimePerFlight;
  const remoteFlightHoursPerWeek = (totalRemoteFlightHours / 52);
  const remotePilotsNeeded = remoteFlightHoursPerWeek / input.weeklyHoursPerPilot;
  const remoteLaborCost = remotePilotsNeeded * input.remotePilotSalary;
  
  const annualRemoteCost = hubCost + remoteLaborCost;
  const fiveYearRemoteCost = annualRemoteCost * 5;
  
  // Calculate savings and ROI
  const fiveYearSavings = fiveYearManualCost - fiveYearRemoteCost;
  const savingsPercentage = Math.round((fiveYearSavings / fiveYearManualCost) * 100);
  
  // Calculate time saved 
  const annualManualHours = flightHoursPerWeekPerSite * input.numSites * 52;
  const annualRemoteHours = totalRemoteFlightHours;
  const annualHoursSaved = annualManualHours - annualRemoteHours;
  const fiveYearHoursSaved = annualHoursSaved * 5;
  const efficiencyGain = Math.round(((annualManualHours - annualRemoteHours) / annualManualHours) * 100);
  
  // Calculate ROI timeframe
  const annualSavings = annualManualTotalCost - annualRemoteCost;
  const roiTimeframe = annualSavings > 0 ? Math.abs(hubCost / annualSavings) : 0;
  
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
    annualRemoteLaborCost: remoteLaborCost, // Show actual remote labor cost
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
