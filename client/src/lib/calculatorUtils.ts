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
  const ON_COSTS_RATE = 0.25; // 25% of salary incl bonus and super
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
  
  // Assume 80% operational efficiency for both HubT and HubX
  const operationalEfficiency = 80;
  
  // FIXED: Separate base wage from fixed costs
  const baseSalary = input.annualSalary;
  const bonus = baseSalary * BONUS_RATE;
  const salaryPlusBonus = baseSalary + bonus;
  const superannuation = salaryPlusBonus * SUPERANNUATION_RATE; // Super calculated on salary + bonus
  const salaryWithBonusAndSuper = salaryPlusBonus + superannuation;
  
  // Calculate on costs as 25% of salary including bonus and super
  const onCosts = salaryWithBonusAndSuper * ON_COSTS_RATE;
  
  // Calculate working hours per year 
  const workingHoursPerYear = WORK_DAYS_PER_YEAR * HOURS_PER_DAY;
  const baseHourlyWageRate = salaryWithBonusAndSuper / workingHoursPerYear;
  
  // FIXED: Apply weekend premiums for 8-on-6-off roster
  // In a 14-day cycle (8 on + 6 off), approximately:
  // - 5.7 weekdays, 1.15 Saturdays, 1.15 Sundays per 8-day work period
  // This reflects the reality that 8 consecutive working days will include weekends
  const cyclesPerYear = WORK_DAYS_PER_YEAR / 8; // ~26.125 cycles
  const weekdaysPerCycle = 5.7; // Average weekdays in 8 consecutive days
  const saturdaysPerCycle = 1.15; // Average Saturdays in 8 consecutive days  
  const sundaysPerCycle = 1.15; // Average Sundays in 8 consecutive days
  
  const weekdayHours = cyclesPerYear * weekdaysPerCycle * HOURS_PER_DAY;
  const saturdayHours = cyclesPerYear * saturdaysPerCycle * HOURS_PER_DAY;
  const sundayHours = cyclesPerYear * sundaysPerCycle * HOURS_PER_DAY;
  
  const totalWeekdayWageCost = weekdayHours * baseHourlyWageRate;
  const totalSaturdayWageCost = saturdayHours * baseHourlyWageRate * SATURDAY_MULTIPLIER;
  const totalSundayWageCost = sundayHours * baseHourlyWageRate * SUNDAY_MULTIPLIER;
  const totalAnnualWageCost = totalWeekdayWageCost + totalSaturdayWageCost + totalSundayWageCost;
  
  // Add fixed costs once (not multiplied by weekend rates)
  const annualManualLaborCost = totalAnnualWageCost + onCosts + FIFO_TRAVEL;
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
  const annualRemoteLaborCost = totalAnnualWageCost * 0.2 + onCosts * 0.2; // 20% of wage + proportional on-costs
  
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
