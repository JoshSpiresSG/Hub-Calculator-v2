import { CalculationInput, CalculationResult } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateResults(input: CalculationInput): CalculationResult {
  // Constants based on user requirements
  const HOURS_PER_DAY = 12;
  const WORK_DAYS_PER_YEAR = 209;
  const BONUS_RATE = 0.05; // 5%
  const SUPERANNUATION_RATE = 0.12; // 12%
  const ON_COSTS = 25000; // $25,000
  const FIFO_TRAVEL = 100000; // $100,000
  const SATURDAY_MULTIPLIER = 1.5;
  const SUNDAY_MULTIPLIER = 2.0;
  
  // Equipment costs per cycle/flight
  const BATTERY_COST = 300;
  const BATTERY_CYCLES = 200;
  const PROPELLER_COST = 25;
  const PROPELLER_FLIGHTS = 150;
  const MAINTENANCE_COST = 2500;
  const MAINTENANCE_FLIGHTS = 400;
  const DRONE_COST = 5000;
  const DRONE_FLIGHTS = 400;
  
  // Hub costs
  const HUBX_COST = 114815; // From Excel
  const HUBT_COST = 89815; // From Excel
  
  // Flight assumptions for equipment calculations
  const AVERAGE_FLIGHT_DURATION_MINUTES = 25; // 20-30 min average
  
  // Calculate operational efficiency
  const operationalEfficiency = input.operationHours > 0 ? (input.airtimeHours / input.operationHours) * 100 : 0;
  
  // FIXED: Separate base wage from fixed costs
  const baseSalary = input.annualSalary;
  const salaryWithBonusAndSuper = baseSalary + (baseSalary * BONUS_RATE) + (baseSalary * SUPERANNUATION_RATE);
  
  // Calculate working hours per year 
  const workingHoursPerYear = WORK_DAYS_PER_YEAR * HOURS_PER_DAY;
  const baseHourlyWageRate = salaryWithBonusAndSuper / workingHoursPerYear;
  
  // FIXED: Apply weekend premiums only to wage component
  const weekdayHours = workingHoursPerYear * (5/7); // 5 weekdays
  const saturdayHours = workingHoursPerYear * (1/7); // 1 Saturday  
  const sundayHours = workingHoursPerYear * (1/7); // 1 Sunday
  
  const totalWeekdayWageCost = weekdayHours * baseHourlyWageRate;
  const totalSaturdayWageCost = saturdayHours * baseHourlyWageRate * SATURDAY_MULTIPLIER;
  const totalSundayWageCost = sundayHours * baseHourlyWageRate * SUNDAY_MULTIPLIER;
  const totalAnnualWageCost = totalWeekdayWageCost + totalSaturdayWageCost + totalSundayWageCost;
  
  // Add fixed costs once (not multiplied by weekend rates)
  const annualManualLaborCost = totalAnnualWageCost + ON_COSTS + FIFO_TRAVEL;
  const annualTravelCost = FIFO_TRAVEL;
  
  // FIXED: Equipment cost methodology with proper flight duration conversion
  const airtimeHoursPerYear = input.airtimeHours * 52; // Weekly to annual
  const flightsPerYear = (airtimeHoursPerYear * 60) / AVERAGE_FLIGHT_DURATION_MINUTES; // Convert airtime to flights
  
  const batteryCostPerYear = (flightsPerYear / BATTERY_CYCLES) * BATTERY_COST;
  const propellerCostPerYear = (flightsPerYear / PROPELLER_FLIGHTS) * PROPELLER_COST;
  const maintenanceCostPerYear = (flightsPerYear / MAINTENANCE_FLIGHTS) * MAINTENANCE_COST;
  const droneCostPerYear = (flightsPerYear / DRONE_FLIGHTS) * DRONE_COST;
  
  const totalEquipmentCostPerYear = batteryCostPerYear + propellerCostPerYear + maintenanceCostPerYear + droneCostPerYear;
  
  // FIXED: Ensure cost totals are consistent
  const annualManualTotalCost = annualManualLaborCost + totalEquipmentCostPerYear;
  const fiveYearManualCost = annualManualTotalCost * 5;
  
  // FIXED: Remote cost modeling with proper amortization
  const hubCost = HUBX_COST; // Default to HubX for now
  const annualDroneBoxAmortized = hubCost / 5; // Amortize over 5 years
  const annualRemoteLaborCost = totalAnnualWageCost * 0.2 + ON_COSTS * 0.2; // 20% of wage + proportional on-costs
  
  // First year includes upfront hub cost, subsequent years only include amortized cost
  const firstYearRemoteCost = hubCost + annualRemoteLaborCost;
  const subsequentYearRemoteCost = annualDroneBoxAmortized + annualRemoteLaborCost;
  const fiveYearRemoteCost = firstYearRemoteCost + (subsequentYearRemoteCost * 4);
  
  // FIXED: ROI calculation using recurring annual savings
  const annualSavingsAfterFirstYear = annualManualTotalCost - subsequentYearRemoteCost;
  const roiTimeframe = annualSavingsAfterFirstYear > 0 ? hubCost / annualSavingsAfterFirstYear : 0;
  
  // Calculate savings and ROI
  const fiveYearSavings = fiveYearManualCost - fiveYearRemoteCost;
  const savingsPercentage = fiveYearManualCost > 0 ? Math.round((fiveYearSavings / fiveYearManualCost) * 100) : 0;
  
  // Calculate time saved (based on operational efficiency)
  const annualManualHours = input.operationHours * 52; // Assuming weekly operation hours
  const annualRemoteHours = input.airtimeHours * 52; // Remote operations are more efficient
  const annualHoursSaved = annualManualHours - annualRemoteHours;
  const fiveYearHoursSaved = annualHoursSaved * 5;
  const efficiencyGain = annualManualHours > 0 ? Math.round((annualHoursSaved / annualManualHours) * 100) : 0;
  
  // Create yearly data for chart with proper remote cost progression
  const yearlyManualCosts = Array(5).fill(annualManualTotalCost);
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
    totalDroneBoxCost: hubCost,
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
    operationalEfficiency, // FIXED: Include operational efficiency
    roiTimeframe,
    yearlyManualCosts,
    yearlyRemoteCosts
  };
}
